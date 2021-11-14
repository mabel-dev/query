/* ****************************************************************************

    This module contains the dynamic parts of the SQL Query cell type -

    - Executing Queries (the table rendering is separate)
    - Keeping and rendering the last 10 queries - "Recent"
    - Maintaining and rendering Saved queries

**************************************************************************** */

function get_columns(data) {
    if (data.columns === undefined) {
        var columns = [];
        for (var key in data) {
            columns.push(key);
        }
        return columns
    }
    return data.columns
}

function execute_sql_query(id) {
    let ticker_start = Date.now()
    document.getElementById(`play-${id}`).disabled = true;

    document.getElementById(`result-cell-${id}`).innerHTML = `
<div class="placeholder-glow">
  <span class="placeholder col-12"></span>
</div>`

    // get the execution details
    let data = {};
    data.query = document.getElementById(`editor-${id}`).innerText;
    data.start_date = document.getElementById(`cell-start-date-${id}`).value;
    data.end_date = document.getElementById(`cell-end-date-${id}`).value;

    update_sql_history(data.query, undefined, "--", "--", data.start_date, data.end_date)

    function do_ticker() {
        document.getElementById(`execution-timer-${id}`).innerText = ((Date.now() - ticker_start) / 1000).toFixed(1) + "s";
    }

    do_ticker();
    _interval_obj = setInterval(function() { do_ticker() }, 100);
    document.getElementById(`last-executed-${id}`).innerText = moment();

    var url = '/v1/search'

    let execute = fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            clearInterval(_interval_obj);
            console.log(response.status)
            if (response.status == "200") {
                response.text().then(function(text) {
                    _results = text.toString().split(/[\n]/).filter(x => x).map(JSON.parse)

                    _has_more_records = false
                    if (_results[_results.length - 1].more_records !== undefined) {
                        _results.pop()
                        _has_more_records = true
                    }

                    _record_count = _results.length
                    _results.columns = get_columns(_results[0]);
                    resultTable = renderTable(_results, 1, 10, document.getElementById('data-table-wrapper'))

                    if (_has_more_records) {
                        _records = "Many (" + _results.length + " available)";
                        update_sql_history(data.query, "okay", "Many", document.getElementById(`execution-timer-${id}`).innerText);
                    } else {
                        _records = _results.length;
                        update_sql_history(data.query, "okay", _records, document.getElementById(`execution-timer-${id}`).innerText);
                    }
                    //max_record = Math.min(_results.length, _page_number * _records_per_page)

                    //document.getElementById('page-back').disabled = (_page_number == 1)
                    //document.getElementById('page-forward').disabled = (_page_number * _records_per_page) >= _results.length
                    //document.getElementById('record_counter').innerText = ((_page_number - 1) * _records_per_page + 1) + " - " + max_record + " of " + _records

                    resultHeader = ''
                    resultFooter = `
                    <div class="card d-flex flex-row justify-content-between notebook-cell-footer">
                        <div>
                            <button type="button" class="btn btn-sm btn-secondary" id="do-save-sql-${id}">
                                <i class="fa-fw fa-regular fa-floppy-disk"></i> Save
                            </button>
                            <button type="button" class="btn btn-sm btn-secondary">
                                <i class="fa-fw fa-solid fa-right-to-bracket fa-rotate-90 "></i> Download
                            </button>
                        </div>
                        <div class="align-middle">
                            1 - 10 of Many (2000 available) 
                            <button type="button" class="btn btn-sm btn-secondary">
                                <i class="fa-fw fas fa-chevron-left"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-secondary">
                                <i class="fa-fw fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>`

                    document.getElementById(`result-cell-${id}`).innerHTML = resultHeader + "<div class='w-100 overflow-auto'>" + resultTable + "</div>" + resultFooter;
                    document.getElementById(`play-${id}`).disabled = false;
                    document.getElementById(`do-save-sql-${id}`).addEventListener("click", function(e) { save_query(e.target); })

                })
            } else {
                if (response.status == "416") {
                    throw new Error(JSON.stringify({
                        "error": "No Matching Records",
                        "detail": "The query ran with any problems but returned no records."
                    }))
                }
                if (response.status == "401") {
                    throw new Error(JSON.stringify({
                        "error": "Session Expired",
                        "detail": "Your session has expired, please reauthenticate."
                    }))
                }
                if (response.status == "403") {
                    throw new Error(JSON.stringify({
                        "error": "Access Denied",
                        "detail": "You do not have access to this resource, you may have access after authenticating."
                    }))
                }
                if (response.status == "404") {
                    throw new Error(JSON.stringify({
                        "error": "Dataset Not Found",
                        "detail": "The dataset was not able to be found, it may be missing for the selected period or it may not exist."
                    }))
                }
                if (response.status == "500") {
                    throw new Error(JSON.stringify({
                        "error": "Server Error",
                        "detail": "The server failed to respond to your request."
                    }))
                }
                if (response.status == "503") {
                    throw new Error(JSON.stringify({
                        "error": "Server Failure",
                        "detail": "The server terminated unexpectedly whilst handing your request, this is not expected to be a persistent error."
                    }))
                }
                return response.text().then(response => {
                    error_object = JSON.parse(response).detail
                    error_object.error = error_object.error.replace(/([A-Z])/g, ' $1').trim()
                    throw new Error(JSON.stringify(error_object))
                })
            }
        })
        .catch(error => {
            clearInterval(_interval_obj);
            document.getElementById(`play-${id}`).disabled = false;
            update_sql_history(data.query, "fail", "--", "--");
            console.log(error.message)
            errorObject = JSON.parse(error.message)
            document.getElementById(`result-cell-${id}`).innerHTML =
                `
<div class="alert alert-danger" role="alert">
    <p class="alert-heading">${htmlEncode(errorObject.error)}</p>
    <p>${htmlEncode(errorObject.detail)}</p>
    <hr />
    <p class="mb-0">Please update your query before trying again.</p>
</div>
`;
        })
}


/* ****************************************************************************
    HISTORY & SAVED
**************************************************************************** */

function sqlDialogAction(element, dialog) {

    // we can't do anything useful at this level, stop
    if (element.id == dialog) { return; }

    if (!element.id.startsWith(dialog)) {
        // if we don't have a handler, try the parent element
        sqlDialogAction(element.parentElement, dialog);
        return;
    }

    // get the information from the button and dialog
    let action_item = element.id.split("-");
    let action = action_item[2];
    let item = action_item[3];
    let cell = document.getElementById(dialog + "-modal").querySelector('.cell-id').value;

    let query_list = []
    if (dialog == "sql-history") {
        query_list = JSON.parse(getLocalCache("recent_queries"));
    }
    if (dialog == "sql-saved") {
        query_list = JSON.parse(getLocalCache("saved_sql"));
    }

    // both of these actions put the query into the query box
    if (action == 'reload' || action == 'rerun') {
        document.getElementById(`editor-${cell}`).innerHTML = sql_highlight(query_list[item].query);
    }
    // we've just put the query into the query box, rerun runs it
    if (action == 'rerun') {
        document.getElementById(`play-${cell}`).click();
    }
    if (action == 'remove') {
        query_list.splice(item, 1);
        if (dialog == "sql-history") {
            putLocalCache("recent_queries", JSON.stringify(query_list));
            update_sql_history();
        }
        if (dialog == "sql-saved") {
            putLocalCache("saved_sql", JSON.stringify(query_list));
            update_sql_saved();
        }
    }
}

function update_sql_history(query, query_outcome, records, duration, start_date, end_date) {

    const history_timestampFormat = "DD MMM YYYY HH:mm"
    let history = getLocalCache("recent_queries");
    if (history) {
        try {
            _history = JSON.parse(history)
        } catch (objError) {
            _history = []
        }
    } else {
        _history = []
    }

    // if we've been given a query, update the history
    if (query) {
        index = -1
        for (var i = 0; i < _history.length; i++) {
            if (_history[i].query == query) {
                index = i
            }
        }
        if (index > -1) {
            _history.splice(index, 1);
        }

        history_object = {};
        history_object.query = query;
        history_object.last_run = Date.now();
        history_object.outcome = query_outcome;
        history_object.runtime = duration;
        history_object.rowcount = records;
        history_object.start_date = start_date;
        history_object.end_date = end_date;

        _history.push(history_object);

        while (_history.length > 25) {
            // we only keep the last 25 queries, so if we have more than
            // 25 items, remove the older items from the list
            _history.shift();
        }
    }

    // save the history
    putLocalCache("recent_queries", JSON.stringify(_history))

    // render the history table
    history_table = "<thead><tr><th>Status</th><th>Query</th><th>Date Range</th><th>Last Run</th><th>Duration</th><th>Rows</th><th class='text-end'>Actions</th></tr></thead>"
    history_table += "<tbody>"
    for (var i = 0; i < _history.length; i++) {

        let status = '<span class="badge waiting mono-font">wait</span>'
        if (_history[i].outcome == "okay") {
            status = '<span class="badge success mono-font">okay</span>'
        } else if (_history[i].outcome == "fail") {
            status = '<span class="badge fail mono-font">fail</span>'
        }
        runtime = '--'
        if (_history[i].runtime != '--') {
            runtime = moment.utc(_history[i].runtime * 1000).format("mm:ss.SS");
        }
        entry = `
        <tr>
            <td class="align-middle">${status}</td>
            <td class="align-middle mono-font" title="${htmlEncode(_history[i].query)}">${sql_highlight(_history[i].query.replace(/\n/g, " "))}</td>
            <td class="align-middle">${moment(_history[i].start_date).format("DD MMM YYYY")} to ${moment(_history[i].end_date).format("DD MMM YYYY")}</td>
            <td class="align-middle">${moment(_history[i].last_run).format(history_timestampFormat)}</td>
            <td class="align-middle text-end">${runtime}</td>
            <td class="align-middle text-end">${_history[i].rowcount}</td>
            <td>
                <button type="button" id="sql-history-reload-${i}" class="btn btn-tiny btn-primary" title="Load Query into Editor" data-bs-dismiss="modal"><i class="fa-fw fa-solid fa-reply fa-rotate-90"></i></button>
                <button type="button" id="sql-history-rerun-${i}" class="btn btn-tiny btn-success" title="Rerun Query" data-bs-dismiss="modal"><i class="fa-fw fa-solid fa-play"></i></button>
            </td>
        </tr>
        `
        history_table = entry + history_table
    }
    history_table += "</tbody>"

    // update the history dialog
    document.getElementById("sql-history").innerHTML = "<table class='table'>" + history_table + "</table>";

    // update all of the pills in the command bar
    let history_count_lists = document.getElementsByClassName("sql-history-count");
    for (let i = 0; i < history_count_lists.length; i++) {
        history_count_lists[i].innerText = _history.length;
    }

    document.getElementById("sql-history").addEventListener("click", function(e) { sqlDialogAction(e.target, "sql-history") })
}



function update_sql_saved(query) {

    let saved = getLocalCache("saved_sql")
    if (saved) {
        try {
            saved_list = JSON.parse(saved)
        } catch (objError) {
            saved_list = []
        }
        if (saved_list.length > 0 && saved_list[0].query === undefined) {
            for (var i = 0; i < saved_list.length; i++) {
                saved_list[i] = { query: saved_list[i] }
            }
        }
    } else {
        saved_list = []
    }

    if (query) {
        index = -1
        for (var i = 0; i < saved_list.length; i++) {
            if (saved_list[i].query == query) {
                index = i
            }
        }
        if (index > -1) {
            saved_list.splice(index, 1);
        }
        saved_list.push({ query: query });
    }

    console.log(saved_list);
    putLocalCache("saved_sql", JSON.stringify(saved_list));

    // update all of the pills in the command bar
    let saved_count_lists = document.getElementsByClassName("sql-saved-count");
    for (let i = 0; i < saved_count_lists.length; i++) {
        saved_count_lists[i].innerText = saved_list.length;
    }

    // if we have no items, show a placeholder and bail
    if (saved_list.length == 0) {
        document.getElementById("sql-saved").innerHTML = '<br /><div class="alert alert-primary" role="alert">No queries have been Saved.</div>'
        return
    }

    saved_table = "<thead><tr><th>Query</th><th>Actions</th></tr></thead>"
    saved_table += "<tbody>"
    for (var i = 0; i < saved_list.length; i++) {
        entry = `
        <tr>
            <td class="align-middle mono-font">${sql_highlight(htmlEncode(saved_list[i].query))}</td>
            <td>
                <button type="button" id="sql-saved-reload-${i}" class="btn btn-tiny btn-primary" title="Load Query into Editor" data-bs-dismiss="modal"><i class="fa-fw fa-solid fa-reply fa-rotate-90"></i></button>
                <button type="button" id="sql-saved-rerun-${i}" class="btn btn-tiny btn-success" title="Rerun Query" data-bs-dismiss="modal"><i class="fa-fw fa-solid fa-play"></i></button>
                <button type="button" id="sql-saved-remove-${i}" class="btn btn-tiny btn-danger" title="Remove Query from Saved"><i class="fa-fw fas fa-trash-alt"></i></button>
            </td>
        </tr>
        `
        saved_table = entry + saved_table
    }
    saved_table += "</tbody>"

    // update the saved dialog
    document.getElementById("sql-saved").innerHTML = "<table class='table'>" + saved_table + "</table>";
    document.getElementById("sql-saved").addEventListener("click", function(e) { sqlDialogAction(e.target, "sql-saved") })
}


function save_query(initiator) {
    /*
     */

    if (!initiator.id.startsWith("do-save-sql-")) {
        // if we're not the one we want, try the parent
        if (initiator.parentElement !== undefined) {
            save_query(initiator.parentElement);
        }
        return;
    }

    id = initiator.id.replace("do-save-sql-", "");

    console.log(initiator, id, document.getElementById(`editor-${id}`).innerText);

    update_sql_saved(document.getElementById(`editor-${id}`).innerText);
}
/* ****************************************************************************
    This module contains the dynamic parts of the SQL Query cell type -

    - Executing Queries (the table rendering is separate)
    - Keeping and rendering the last 10 queries - "Recent"
    - Maintaining and rendering Saved queries

**************************************************************************** */

function execute(id) {
    ticker_start = Date.now()
    update_history(_query, undefined, "--", "--")

    function do_ticker() {
        document.getElementById('clock').innerText = ((Date.now() - ticker_start) / 1000).toFixed(1);
    }
    if (_interval_obj) {
        clearInterval(_interval_obj)
    }

    do_ticker();
    _interval_obj = setInterval(function() { do_ticker() }, 100);

    var url = '/v1/search';
    data = {};
    data.query = _query;
    data.start_date = document.getElementById('start_date').value;
    data.end_date = document.getElementById('end_date').value;
    data.page_size = recordBufferSize;

    fetch(url, {
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
                    renderTable(_results, _page_number, _records_per_page, document.getElementById('data-table-wrapper'))

                    if (_has_more_records) {
                        _records = "Many (" + _results.length + " available)";
                        update_history(_query, "okay", "Many", document.getElementById('clock').innerText);
                    } else {
                        _records = _results.length;
                        update_history(_query, "okay", _records, document.getElementById('clock').innerText);
                    }
                    max_record = Math.min(_results.length, _page_number * _records_per_page)

                    document.getElementById('page-back').disabled = (_page_number == 1)
                    document.getElementById('page-forward').disabled = (_page_number * _records_per_page) >= _results.length
                    document.getElementById('record_counter').innerText = ((_page_number - 1) * _records_per_page + 1) + " - " + max_record + " of " + _records


                    update_visualization(_query, _results);
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
            update_history(_query, "fail", "--", "--");
            console.log(error.message)
            errorObject = JSON.parse(error.message)
            document.getElementById("data-table-wrapper").innerHTML =
                `
<div class="alert alert-error col-sm-8" role="alert">
    <h4 class="alert-heading">${htmlEncode(errorObject.error)}</h4>
    <p>${htmlEncode(errorObject.detail)}</p>
    <hr />
    <p class="mb-0">Update your query and try again.</p>
</div>
`;
        })
}


/* ****************************************************************************
    HISTORY
**************************************************************************** */

function update_history(query, query_outcome, records, duration, start_date, end_date) {
    // we keep and show some summary information about the query
    const history_timestampFormat = "DD MMM YYYY HH:mm"
    let _history = JSON.parse(getLocalCache("recent_queries"));
    if (_history == null) { _sql_history = [] };

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

        while (_history.length > 10) {
            // we only keep the last 10 queries, so if we have more than
            // 10 items, remove the older items from the list
            _history.shift();
        }
    }

    putLocalCache("recent_queries", JSON.stringify(_history))

    history_table = "<thead><tr><th>Status</th><th>Query</th><th>Date Range</th><th>Last Run</th><th>Duration</th><th>Rows</th><th class='text-end'>Actions</th></tr></thead>"
    history_table += "<tbody>"
    for (var i = 0; i < _history.length; i++) {

        console.log(_history[i]);

        let status = '<span class="badge waiting mono-font">wait</span>'
        if (_history[i].outcome == "okay") {
            status = '<span class="badge success mono-font">okay</span>'
        } else if (_history[i].outcome == "fail") {
            status = '<span class="badge fail mono-font">fail</span>'
        }
        entry = `
        <tr>
            <td class="align-middle">${status}</td>
            <td class="align-middle mono-font" title="${htmlEncode(_history[i].query)}">${sql_highlight(_history[i].query.replace(/\n/g, " "))}</td>
            <td class="align-middle">${moment(_history[i].start_date).format("DD MMM YYYY")} to ${moment(_history[i].end_date).format("DD MMM YYYY")}</td>
            <td class="align-middle">${moment(_history[i].last_run).format(history_timestampFormat)}</td>
            <td class="align-middle text-end">${moment.utc(_history[i].runtime * 1000).format("mm:ss.SS")}</td>
            <td class="align-middle text-end">${_history[i].rowcount}</td>
            <td>
                <button type="button" id="redo-${i}" class="btn btn-tiny btn-primary" title="Load Query into Editor"><i class="fa-fw fa-solid fa-reply fa-rotate-90"></i></button>
                <button type="button" id="redo-${i}" class="btn btn-tiny btn-success" title="Rerun Query"><i class="fa-fw fa-solid fa-play"></i></button>
            </td>
        </tr>
        `
        history_table = entry + history_table
    }
    history_table += "</tbody>"

    // update all of the history lists (the exist within the cells)
    let history_lists = document.getElementsByClassName("sql-history");
    for (let i = 0; i < history_lists.length; i++) {
        history_lists[i].innerHTML = "<table class='table history-table'>" + history_table + "</table>";
    }

    // update all of the pills in the command bar
    let history_count_lists = document.getElementsByClassName("sql-history-count");
    for (let i = 0; i < history_count_lists.length; i++) {
        history_count_lists[i].innerText = _history.length;
    }
}
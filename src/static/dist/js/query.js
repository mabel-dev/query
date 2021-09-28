var _records_per_page = parseInt(document.getElementById("records_per_page").value);
var _query = "";
var _records = "Many";
var _results = [];
var _history = [];
var _page_number = 0;
var _interval_obj = null;

var outcome

const recordBufferSize = 2500
const history_timestampFormat = "YYYY-MM-DD HH:mm:ss"

function putData(key, value) {
    localStorage.setItem(key, value);
}

function getData(key) {
    return localStorage.getItem(key)
}

function colorize_sql(str) {
    // this is used to colorize in tables, just to help readability
    let keyword_reg = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|AND|OR|NOT|LIKE)\b/gi;
    var literal_reg = /"([^\"]*)"/g
    s = str.replace(keyword_reg, "<span class='sql-keyword'>$1</span>");
    return s
}


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

function update_period() {
    var selected_value = document.getElementById('period').value;
    var start_element = document.getElementById('start_date')
    var end_element = document.getElementById('end_date')
    var today = new Date()
    var t_minus_30 = new Date(new Date().setDate(today.getDate() - 30))
    var yesterday = new Date(new Date().setDate(today.getDate() - 1))

    switch (selected_value) {
        case 'today':
            start_element.valueAsDate = today;
            end_element.valueAsDate = new Date();
            break;
        case 'yesterday':
            start_element.valueAsDate = yesterday;
            end_element.valueAsDate = yesterday;
            break;
        case 't-30':
            start_element.valueAsDate = t_minus_30;
            end_element.valueAsDate = today;
            break;
    }
}

function update_date(field, increment) {
    current_date = document.getElementById(field).valueAsDate;
    document.getElementById(field).valueAsDate = new Date(new Date().setDate(current_date.getDate() + increment))
}

function isEmptyObject(obj) {
    return JSON.stringify(obj) === JSON.stringify({})
}

function execute() {
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
                    _record_count = _results.length
                    _results.columns = get_columns(_results[0]);
                    renderTable(_results, _page_number, _records_per_page, document.getElementById('data-table-wrapper'))

                    let max_record = _page_number * _records_per_page
                    if (_results.length != recordBufferSize) {
                        _records = _results.length
                    } else {
                        _records = "Many (" + _results.length + " available)"
                        max_record = Math.min(_records, _page_number * _records_per_page)
                    }

                    document.getElementById('page-back').disabled = (_page_number == 1)
                    document.getElementById('page-forward').disabled = (_page_number * _records_per_page) >= _results.length
                    document.getElementById('record_counter').innerText = ((_page_number - 1) * _records_per_page + 1) + " - " + max_record + " of " + _records

                    update_history(_query, "okay", _results.length, document.getElementById('clock').innerText);
                    update_visualization(_query, _results);
                })
            } else {
                if (response.status == "204") {
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
    <h4 class="alert-heading">${errorObject.error}</h4>
    <p>${errorObject.detail}</p>
    <hr />
    <p class="mb-0">Update your query and try again.</p>
</div>
`;
        })
}

function update_history(query, query_outcome, records, duration) {

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

        _history.push(history_object);
    }


    history_table = "<thead><tr><th>Status</th><th>Query</th><th>Last Run</th><th>Duration</th><th>Rows</th><th class='text-end'>Actions</th></tr></thead>"
    history_table += "<tbody>"
    for (var i = 0; i < _history.length; i++) {

        let status = '<span class="badge waiting mono-font">wait</span>'
        if (_history[i].outcome == "okay") {
            status = '<span class="badge success mono-font">okay</span>'
        } else if (_history[i].outcome == "fail") {
            status = '<span class="badge fail mono-font">fail</span>'
        }
        entry = `
        <tr>
            <td class="align-middle">${status}</td>
            <td class="align-middle trim sql-statement">${colorize_sql(_history[i].query)}</td>
            <td class="align-middle">${moment(_history[i].last_run).format(history_timestampFormat)}</td>
            <td class="align-middle text-end">${_history[i].runtime}</td>
            <td class="align-middle text-end">${_history[i].rowcount}</td>
            <td>
                <button type="button" id="redo-${i}" class="btn btn-sm button-query-white" title="Load Query into Editor"><i class="fas fa-redo"></i></button>
                <button type="button" id="save-${i}" class="btn btn-sm button-query-white" title="Save Query"><i class="fas fa-save"></i></button>
                <button type="button" id="del-${i}" class="btn btn-sm button-query-white" title="Remove Query from History"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
        `
        history_table = entry + history_table
    }
    history_table += "</tbody>"
    document.getElementById("recent").innerHTML = "<table class='table table-sm history-table table-responsive'>" + history_table + "</table>"
}

function update_saved(query) {

    let saved = getData("saved_sql")
    if (saved) {
        saved_list = JSON.parse(saved)
    } else {
        saved_list = []
    }

    if (query) {
        index = -1
        for (var i = 0; i < saved_list.length; i++) {
            if (saved_list[i] == query) {
                index = i
            }
        }
        if (index > -1) {
            saved_list.splice(index, 1);
        }

        saved_list.push(query);
        putData("saved_sql", JSON.stringify(saved_list));
    }

    if (saved_list.length == 0) {
        document.getElementById("saved").innerHTML = '<div class="alert alert-primary col-sm-8" role="alert">No queries have been Saved.</div>'
        return
    }

    saved_table = "<thead><tr><th>Query</th><th>Actions</th></tr></thead>"
    saved_table += "<tbody>"
    for (var i = 0; i < saved_list.length; i++) {
        entry = `
        <tr>
            <td class="align-middle trim sql-statement">${colorize_sql(saved_list[i])}</td>
            <td>
                <button type="button" id="redo-${i}" class="btn btn-sm button-query-white" title="Load Query into Editor"><i class="fas fa-redo"></i></button>
                <button type="button" id="del-${i}" class="btn btn-sm button-query-white" title="Remove Query from Saved"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
        `
        saved_table = entry + saved_table
    }
    saved_table += "</tbody>"
    document.getElementById("saved").innerHTML = "<table class='table table-sm history-table table-responsive'>" + saved_table + "</table>"
}

function run_query() {
    _query = SqlEditor.getValue('\n');
    _records = "Many"
    _cursors = []
    _page_number = 1

    execute();
}

function download_query() {

    download_button = document.getElementById('download')
    original_text = download_button.innerHTML;
    download_button.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only"></span></div> Download'

    let url = '/download/'
    let data = {};
    data.query = SqlEditor.getValue('\n');
    data.start_date = document.getElementById('start_date').value
    data.end_date = document.getElementById('end_date').value

    //    const authHeader = "Bearer 6Q************"
    //    const options = {
    //        headers: {
    //            //  Authorization: authHeader
    //        }
    //    };

    fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            const filename = "download.csv" //response.headers.get('Content-Disposition').split('filename=')[1];
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
            });
            download_button.innerHTML = original_text

        });

}

function save_query() {
    let query = SqlEditor.getValue('\n');
    update_saved(query);
}

function set_records_per_page() {
    _records_per_page = parseInt(document.getElementById("records_per_page").value);
    _page_number = 1;

    if (_results.results !== undefined) {
        renderTable(_results, _page_number, _records_per_page, document.getElementById('data-table-wrapper'));
        let max_record = _page_number * _records_per_page
        if (_records != "Many") {
            max_record = Math.min(_records, _page_number * _records_per_page)
        }
        document.getElementById('page-back').disabled = (_page_number == 1)
        document.getElementById('page-forward').disabled = (_page_number * _records_per_page) >= _results.length
        document.getElementById('record_counter').innerText = ((_page_number - 1) * _records_per_page + 1) + " - " + max_record + " of " + _records
    }
}

function page_forward() {
    _page_number++;
    renderTable(_results, _page_number, _records_per_page, document.getElementById('data-table-wrapper'));
    let max_record = _page_number * _records_per_page
    if (_records != "Many") {
        max_record = Math.min(_records, _page_number * _records_per_page)
    }
    document.getElementById('page-back').disabled = (_page_number == 1)
    document.getElementById('page-forward').disabled = (_page_number * _records_per_page) >= _results.length
    document.getElementById('record_counter').innerText = ((_page_number - 1) * _records_per_page + 1) + " - " + max_record + " of " + _records
}

function page_back() {
    _page_number--;
    renderTable(_results, _page_number, _records_per_page, document.getElementById('data-table-wrapper'));
    let max_record = _page_number * _records_per_page
    if (_records != "Many") {
        max_record = Math.min(_records, _page_number * _records_per_page)
    }
    document.getElementById('page-back').disabled = (_page_number == 1)
    document.getElementById('page-forward').disabled = (_page_number * _records_per_page) >= _results.length
    document.getElementById('record_counter').innerText = ((_page_number - 1) * _records_per_page + 1) + " - " + max_record + " of " + _records
}

function history_button_click(e) {
    if (e.id.startsWith('redo-')) {
        index = e.id.replace(/^redo-/, "");
        SqlEditor.setValue(_history[index].query);

    } else if (e.id.startsWith('del-')) {
        index = e.id.replace(/^del-/, "");
        _history.splice(index, 1);
        update_history();
    } else if (e.id.startsWith('save-')) {
        index = e.id.replace(/^save-/, "");
        update_saved(_history[index].query);

    } else {
        if (e.parentElement) {
            history_button_click(e.parentElement)
        }
    }
}

function saved_button_click(e) {

    let saved = getData("saved_sql")
    if (saved) {
        saved_list = JSON.parse(getData("saved_sql"))
    } else {
        saved_list = []
    }

    if (e.id.startsWith('redo-')) {
        index = e.id.replace(/^redo-/, "");
        SqlEditor.setValue(saved_list[index]);

    } else if (e.id.startsWith('del-')) {
        index = e.id.replace(/^del-/, "");
        saved_list.splice(index, 1);
        putData("saved_sql", JSON.stringify(saved_list))
        update_saved();

    } else {
        if (e.parentElement) {
            saved_button_click(e.parentElement)
        }
    }
}

function header_navigation(e) {

    function setVisibility(elem, visibile) {
        if (visibile) {
            if (elem.classList.contains("d-none")) {
                elem.classList.remove("d-none")
            }
        } else {
            if (!elem.classList.contains("d-none")) {
                elem.classList.add("d-none")
            }
        }
    }

    if (e.id.startsWith('nav-')) {
        setVisibility(document.getElementById('main-explorer'), e.id.endsWith('explorer'))
        setVisibility(document.getElementById('main-lab'), e.id.endsWith('lab'))
        setVisibility(document.getElementById('main-visualize'), e.id.endsWith('visualize'))
        setVisibility(document.getElementById('main-dashboard'), e.id.endsWith('dashboard'))
    } else {
        if (e.parentElement) {
            header_navigation(e.parentElement)
        }
    }
}

document.getElementById('run').addEventListener('click', run_query, false);
document.getElementById('download').addEventListener('click', download_query, false);
document.getElementById('save').addEventListener('click', save_query, false);
document.getElementById('records_per_page').addEventListener('change', set_records_per_page, false);
document.getElementById('page-forward').addEventListener('click', page_forward, false);
document.getElementById('page-back').addEventListener('click', page_back, false);
document.getElementById("recent").addEventListener('click', function(e) { history_button_click(e.target) });
document.getElementById("saved").addEventListener('click', function(e) { saved_button_click(e.target) });
document.getElementById("period").addEventListener('change', update_period, false);
document.getElementById("header-nav").addEventListener('click', function(e) { header_navigation(e.target) });

update_saved();
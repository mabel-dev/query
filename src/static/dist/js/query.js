var _records_per_page = document.getElementById("records_per_page").value;
var _query = ""
var _records = "Many"
var _cursors = []
var _history = []
var _page_number = 0
var _interval_obj = null

var outcome

const history_timestampFormat = "YYYY-MM-DD HH:mm:ss"

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

    function do_ticker() {
        document.getElementById('clock').innerText = ((Date.now() - ticker_start) / 1000).toFixed(1);
    }
    if (_interval_obj) {
        clearInterval(_interval_obj)
    }
    _interval_obj = setInterval(function() { do_ticker() }, 250);

    var url = '/v1/search'
    data = {}
    data.query = _query
    data.start_date = document.getElementById('start_date').value
    data.end_date = document.getElementById('end_date').value
    data.page_size = _records_per_page
    data.cursor = _cursors[_page_number]

    console.log(JSON.stringify(data))

    fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            clearInterval(_interval_obj);
            if (response.ok) return response.json();
            return response.text().then(response => { throw new Error(response) })
        })
        .then(response => {
            console.log(response)

            if (response.results.length == 0) {
                e = {}
                e.error = "No Records Found"
                e.detail = "The query appears to be valid, but it matched no records"
                wrapper = {}
                wrapper.detail = e
                throw new Error(JSON.stringify(wrapper))
            }
            response.columns = get_columns(response.results[0]);
            document.getElementById('data-table-wrapper').innerHTML = renderTable(response, (_page_number - 1) * _records_per_page + 1)

            document.getElementById('clock').innerText = ((Date.now() - ticker_start) / 1000).toFixed(2)
            document.getElementById('page-back').disabled = (_page_number == 1)
            document.getElementById('page-forward').disabled = isEmptyObject(response.cursor)

            _cursors[_page_number + 1] = JSON.stringify(response.cursor)

            max_record = _page_number * _records_per_page
            if (response.records > 0) {
                _records = response.records
            }
            if (isEmptyObject(response.cursor)) {
                _records = (_page_number - 1) * _records_per_page + response.results.length
            }
            if (max_record > _records) {
                max_record = _records
            }
            document.getElementById('record_counter').innerText =
                (_page_number - 1) * _records_per_page + " - " + max_record + " of " + _records

            update_history(_query, true);
        })
        .catch(error => {
            console.log(error.message)
            errorObject = JSON.parse(error.message).detail
            document.getElementById("data-table-wrapper").innerHTML =
                "<p><strong>" + errorObject.error + "</strong></p>" + errorObject.detail;

            update_history(_query, false);
        })

}

function update_history(query, query_outcome) {

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

        _history.push(history_object);
    }


    history_table = "<thead><tr><th></th><th>Query</th><th>Last Run</th><th></th></tr></thead>"
    history_table += "<tbody>"
    for (var i = 0; i < _history.length; i++) {
        entry = "<tr>"
        if (_history[i].outcome) {
            entry += "<td><span class='badge success mono-font'>okay</span></td>"
        } else {
            entry += "<td><span class='badge fail mono-font'>fail</span></td>"
        }
        entry += "<td class='align-middle trim'>" + _history[i].query + "</td>"
        entry += "<td class='align-middle'>" + moment(_history[i].last_run).format(history_timestampFormat) + "</td>"
        entry += "<td>"
        entry += '<button type="button" id="redo-' + i + '" class="btn btn-sm button-query-white" title="Load Query into Editor"><i class="fas fa-redo"></i></button>'
        entry += '<button type="button" id="del-' + i + '" class="btn btn-sm button-query-white" title="Remove Query from History"><i class="fas fa-trash-alt"></i></button>'
        entry += "</td>"
        entry += "</tr>"
        history_table = entry + history_table
    }
    history_table += "</tbody>"
    document.getElementById("history").innerHTML = "<table class='table table-sm history-table table-responsive'>" + history_table + "</table>"
}


function run_query() {
    _query = document.getElementById("query").innerText;
    _records = "Many"
    _cursors = []
    _cursors[0] = ""
    _page_number = 1

    execute();
}

function download_query() {
    query = document.getElementById('query').innerText
    start_date = document.getElementById('start_date').value
    end_date = document.getElementById('end_date').value

    var url = '/download/' + start_date + '/' + end_date + '/' + query

    console.log(url)

    const authHeader = "Bearer 6Q************"

    const options = {
        headers: {
            //  Authorization: authHeader
        }
    };
    fetch(url, options)
        .then(res => res.blob())
        .then(blob => {
            var file = window.URL.createObjectURL(blob);
            window.location.assign(file);
        });
}

function set_records_per_page() {
    _records_per_page = document.getElementById("records_per_page").value;
    _page_number = 1;
    execute();
}

function page_forward() {
    document.getElementById('page-back').disabled = true
    document.getElementById('page-forward').disabled = true
    _page_number++;
    execute();
}

function page_back() {
    document.getElementById('page-back').disabled = true
    document.getElementById('page-forward').disabled = true
    _page_number--;
    execute();
}

function history_button_click(e) {
    if (e.id.startsWith('redo-')) {
        index = e.id.replace(/^redo-/, "");
        document.getElementById("query").innerHTML = _history[index].query;
        document.getElementById("query").dispatchEvent(new Event('change'));

    } else if (e.id.startsWith('del-')) {
        index = e.id.replace(/^del-/, "");
        _history.splice(index, 1);
        update_history();

    } else {
        if (e.parentElement) {
            history_button_click(e.parentElement)
        }
    }
}

document.getElementById('run').addEventListener('click', run_query, false);
document.getElementById('download').addEventListener('click', download_query, false);
document.getElementById('records_per_page').addEventListener('change', set_records_per_page, false);
document.getElementById('page-forward').addEventListener('click', page_forward, false);
document.getElementById('page-back').addEventListener('click', page_back, false);
document.getElementById("history").addEventListener('click', function(e) {
    history_button_click(e.target)
});
document.getElementById("period").addEventListener('change', update_period, false);
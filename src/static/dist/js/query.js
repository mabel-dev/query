var _records_per_page = document.getElementById("records_per_page").value;
var _query = ""
var _records = "Many"
var _cursors = []
var _history = []
var _page_number = 0
var _interval_obj = null

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

    var timer = performance.now();
    fetch(url, { method: "POST", body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
        .then((res) => res.json())
        .then(output => {
            clearInterval(_interval_obj);
            var response = output;
            console.log(response)
            response.columns = get_columns(response.results[0]);
            document.getElementById('data-table-wrapper').innerHTML = renderTable(response, 0)

            document.getElementById('clock').innerText = ((Date.now() - ticker_start) / 1000).toFixed(2)

            // if there is a cursor - set the attribute on the cursor
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

        }).catch(function() {
            clearInterval(_interval_obj);
            document.getElementById("data-table-wrapper").innerHTML = "<p>ERROR</p>"
        })
}

function run_query() {
    _query = document.getElementById("query").innerText;
    _history.push(_query)
    _records = "Many"
    _cursors = []
    _cursors[0] = ""
    _page_number = 1
    execute();
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


document.getElementById('run').addEventListener('click', run_query, false);
document.getElementById('records_per_page').addEventListener('change', set_records_per_page, false);
document.getElementById('page-forward').addEventListener('click', page_forward, false);
document.getElementById('page-back').addEventListener('click', page_back, false)
const timestampFormat = "DD MMM YYYY HH:mm"

document.getElementById('start_date').valueAsDate = new Date();
document.getElementById('end_date').valueAsDate = new Date();

function htmlEncode(str) {
    if (str === undefined || str == null) { return '' }
    return str.toString().replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';'
    });
}

function is_date(sDate) {
    if (sDate === undefined || sDate == null) { return false }
    if (sDate.toString() == parseInt(sDate).toString()) return false;
    var tryDate = new Date(sDate);
    var m = moment(sDate, ['YYYY-MM-DD', 'YYYYMMDD', 'DD/MM/YYYY', moment.ISO_8601, 'L', 'LL', 'LLL', 'LLLL'], true);
    return (tryDate && tryDate.toString() != "NaN" && tryDate != "Invalid Date" && m.isValid());
}

function renderTable(data, page) {
    var page_size = 100
    var row_data = ''
    row_data += "<thead><tr>";
    row_data += "<th scope='col'></th>";
    for (var h = 0; h < data.columns.length; h++) {
        row_data += "<th>" + htmlEncode(data.columns[h]) + "<th>"
    }
    row_data += "</tr></thead><tbody>";
    var max_rows = page_size;
    if (data.results.length < max_rows) { max_rows = data.results.length; }
    for (var i = 0; i < max_rows; i++) {
        row_data += "<tr>";
        row_data += "<th scope='row'>1</th>";
        let index = i + (page * page_size);
        for (var h = 0; h < data.columns.length; h++) {
            var cell_value = data.results[index][data.columns[h]];
            if (is_date(cell_value)) {
                row_data += "<td>" + moment(data.results[index][data.columns[h]]).format(timestampFormat) + "<td>"
            } else {
                row_data += "<td>" + htmlEncode(data.results[index][data.columns[h]]) + "<td>"
            }
        }
        row_data += "</tr>";
    }
    row_data += "</tbody>"

    return "<table class='table table-striped table-sm data-table table-responsive'>" + row_data + "</table>";
}
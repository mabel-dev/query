const timestampFormat = "YYYY-MM-DD HH:mm"

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

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function renderTable(data, start_index) {
    var row_data = ''
    row_data += "<thead><tr>";
    row_data += '<th scope="col" class="mono-font">#</th>';
    for (var h = 0; h < data.columns.length; h++) {
        row_data += `<th>${htmlEncode(data.columns[h])}</th>`
    }
    row_data += "</tr></thead><tbody>";
    for (var i = 0; i < data.results.length; i++) {
        row_data += `<tr><th scope="row" class="mono-font align-middle">${zeroPad(start_index + i, 2)}</th>`;
        for (var h = 0; h < data.columns.length; h++) {
            var cellValue = htmlEncode(data.results[i][data.columns[h]])
            if (is_date(cellValue)) {
                row_data += `<td>${moment(cellValue).format(timestampFormat)}</td>`
            } else if (cellValue.length > 16) {
                row_data += `<td title="${cellValue}">${cellValue}</td>`
            } else {
                row_data += `<td>${cellValue}</td>`
            }
        }
        row_data += "</tr>";
    }
    row_data += "</tbody>"

    return "<table class='table table-striped table-sm results-table table-responsive'>" + row_data + "</table>";
}
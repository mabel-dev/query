const timestampFormat = "YYYY-MM-DD HH:mm"

function htmlEncode(str) {
    if (str === undefined || str == null) { return '' }
    return str.toString().replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#' + i.charCodeAt(0) + ';'
        })
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
}

function is_date(sDate) {
    if (sDate === undefined || sDate == null) { return false }
    if (sDate.toString() == parseInt(sDate).toString()) return false;
    var tryDate = new Date(sDate);
    var m = dayjs(sDate, ['YYYY-MM-DD', 'YYYYMMDD', 'DD/MM/YYYY', dayjs.ISO_8601, 'L', 'LL', 'LLL', 'LLLL'], true);
    return (tryDate && tryDate.toString() != "NaN" && tryDate != "Invalid Date" && m.isValid());
}

function is_number(sNum) {
    if (sNum === undefined || sNum == null) { return false }
    if (sNum.toString().trim() == parseFloat(sNum).toString()) return true;
    if (sNum.toString().trim() == parseInt(sNum).toString()) return true;
    return false;
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function renderTable(data, pageNumber, pageSize) {
    var row_data = ''

    startIndex = (pageNumber - 1) * pageSize

    right_justified_headers = []

    for (var i = startIndex; i < (startIndex + pageSize); i++) {
        if (i < data.length) {
            row_data += `<tr><th scope="row" class="mono-font align-middle row-nums">${zeroPad(i + 1, 2)}</th>`;
            for (var h = 0; h < data.columns.length; h++) {
                var cellValue = htmlEncode(data[i][data.columns[h]])
                if (is_date(cellValue)) {
                    row_data += `<td class="cell_right">${dayjs(cellValue).format(timestampFormat)}</td>`
                    if (!right_justified_headers.includes(data.columns[h])) {
                        right_justified_headers.push(data.columns[h])
                    }
                } else if (is_number(cellValue)) {
                    row_data += `<td class="cell_right">${cellValue}</td>`
                    if (!right_justified_headers.includes(data.columns[h])) {
                        right_justified_headers.push(data.columns[h])
                    }
                } else if (cellValue.length > 32) {
                    row_data += `<td title="${cellValue}">${cellValue}</td>`
                } else {
                    row_data += `<td>${cellValue}</td>`
                }
            }
            row_data += "</tr>";
        }
    }
    row_data += "</tbody>"

    header_data = "<thead><tr>";
    header_data += '<th scope="col"></th>';
    for (var h = 0; h < data.columns.length; h++) {
        if (right_justified_headers.includes(data.columns[h])) {
            header_data += `<th class="cell_right">${htmlEncode(data.columns[h])}</th>`
        } else {
            header_data += `<th>${htmlEncode(data.columns[h])}</th>`
        }
    }
    header_data += "</tr></thead><tbody>";

    return "<table class='table'>" + header_data + row_data + "</table>";
}
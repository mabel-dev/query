var chart = undefined


function download_chart() {
    var a = document.createElement('a');
    a.href = chart.toBase64Image();
    a.download = 'chart.png';
    a.click();
}

function parallel_sort(list1, list2) {

    //1) combine the arrays:
    var list = [];
    for (var j = 0; j < list1.length; j++)
        list.push({ 'list1': list1[j], 'list2': list2[j] });

    //2) sort:
    list.sort(function(a, b) {
        return ((a.list1 > b.list1) ? -1 : ((a.list1 == b.list1) ? 0 : 1));
    });

    //3) separate them back out:
    for (var k = 0; k < list.length; k++) {
        list1[k] = list[k].list1;
        list2[k] = list[k].list2;
    }

    return [list1, list2]
}



function draw_pie(data, labels, group) {

    colors = getColors(DEFAULT_COLORS, labels.length)

    res = parallel_sort(data, labels)
    data = res[0]
    labels = res[1]

    const config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: colors,
                data: data,
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        }
    };
    Chart.defaults.font.family = 'JetBrains Mono', 'Roboto Mono', 'monospace';
    Chart.defaults.font.size = 16;
    chart = new Chart(
        document.getElementById('visualization'),
        config
    );
}

function draw_histogram(data, labels, group) {

    colors = getColors(DEFAULT_COLORS, labels.length)

    res = parallel_sort(labels, data)
    labels = res[0].reverse()
    data = res[1].reverse()

    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: {
                    min: 0,
                    title: { display: true, text: "Frequency" }
                },
                x: {
                    title: { display: true, text: group }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        },
    };
    Chart.defaults.font.family = 'JetBrains Mono', 'Roboto Mono', 'monospace';
    Chart.defaults.font.size = 16;
    chart = new Chart(
        document.getElementById('visualization'),
        config
    );
}


function update_visualization(query, results) {

    let count_column = undefined
    let group_column = undefined

    for (var i = 0; i < results.columns.length; i++) {
        if (results.columns[i].includes("COUNT(")) {
            count_column = results.columns[i]
        } else {
            group_column = results.columns[i]
        }
    }

    // we're couting groups of things
    if ((count_column !== undefined) && (group_column !== undefined)) {
        data = []
        labels = []
        for (var i = 0; i < results.results.length; i++) {
            labels.push(results.results[i][group_column])
            data.push(results.results[i][count_column])
        }
        document.getElementById("visualize").innerHTML = '<canvas id="visualization"></canvas>'
        if (!labels.some(isNaN)) {
            draw_histogram(data, labels, group_column)
        } else if (labels.every(date => Date.parse(date) != NaN)) {
            draw_histogram(data, labels, group_column)
        } else {
            draw_pie(data, labels, group_column)
        }
    }
    // if we're just counting everything, show a single value
    else if ((count_column !== undefined) && (group_column === undefined)) {
        document.getElementById("visualize").innerText = results.results[0][count_column]
    }
    // we don't have a auto chart for that yet
    else {
        document.getElementById("visualize").innerHTML = '<div class="alert alert-primary col-sm-8" role="alert">Cannot Automatically Determine Chart</div>'
    }

}
COLORS = ["#2680eb", "#e34850", "#e68619", "#2d9d78", "#6767ec", "#44b556", "#d83790", "#dfbf00", "#c038cc", "#1b959a", "#85d044", "#9256d9", "#6e6e6e"]


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


function draw_pie(count_column, group_column, results) {

    labels = []
    data = []

    for (var i = 0; i < results.results.length; i++) {
        labels.push(results.results[i][group_column])
        data.push(results.results[i][count_column])
    }

    res = parallel_sort(data, labels)
    data = res[0]
    labels = res[1]

    const config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: COLORS,
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

    var myChart = new Chart(
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

    console.log(results.columns)
    console.log(count_column)
    console.log(group_column)

    // if we're counting groups of things, draw a pie-chart
    if ((count_column !== undefined) && (group_column !== undefined)) {
        document.getElementById("visualize").innerHTML = '<canvas id="visualization"></canvas>'
        draw_pie(count_column, group_column, results)
    }
    // if we're just counting everything, show a single value
    else if ((count_column !== undefined) && (group_column === undefined)) {
        document.getElementById("visualize").innerText = results.results[0][count_column]
    }
    // we don't have a auto chart for that yet
    else {
        document.getElementById("visualize").innerText = "Cannot Automatically Determine Chart"
    }

}
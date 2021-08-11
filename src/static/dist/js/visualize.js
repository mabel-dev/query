COLORS = ["#2680eb", "#e34850", "#e68619", "#2d9d78", "#6767ec", "#44b556", "#d83790", "#dfbf00", "#c038cc", "#1b959a", "#85d044", "#9256d9", "#6e6e6e"]

function draw_pie(count_column, group_column, results) {

    labels = []
    data = []

    for (var i = 0; i < results.results.length; i++) {
        labels.push(results.results[i][group_column])
        data.push(results.results[i][count_column])
    }

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
    if (count_column && group_column) {
        document.getElementById("visualize").innerHTML = '<canvas id="visualization"></canvas>'
        draw_pie(count_column, group_column, results)
    } else {
        document.getElementById("visualize").innerText = "Cannot Automatically Determine Chart"
    }

}
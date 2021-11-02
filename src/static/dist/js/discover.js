function draw_profile_pie(data, labels, target) {

    colors = ["#0b3f7c", "#2680eb", "#a4caf7"]

    const config = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: colors,
                data: data,
            }]
        },
        options: {
            maintainAspectRatio: true,
            responsive: true,
            plugins: { legend: { display: false } }
        }
    };
    Chart.defaults.font.family = 'JetBrains Mono', 'Roboto Mono', 'monospace';
    Chart.defaults.font.size = 16;
    chart = new Chart(target, config);
}
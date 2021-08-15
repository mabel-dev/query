/*
Colors used for visualizations.

These are continuous color schemes, the entries define points along the continuum. This
means that the scheme can be used for charts with 2 items or 25 items (in theory
inifinite, but, more than a dozen becomes difficult to read regardless of the color
scheme)

PLASMA and VIRIDIS are color schemes available in plotly even though that library
isn't used.
*/
BLUE_AND_ORANGE = ['#1984c5', '#ffffe0', '#c23728']
PLASMA = ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921']
VIRIDIS = ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725']
PINK_AND_BLUE = ["#e52165", "#0d1137"]
BLUE_SCALE = ["#0d1137", "#e0f0ff"]

DEFAULT_COLORS = PLASMA

function interpolateColor(c0, c1, f) {
    c0 = c0.match(/.{1,2}/g).map((oct) => parseInt(oct, 16) * (1 - f))
    c1 = c1.match(/.{1,2}/g).map((oct) => parseInt(oct, 16) * f)
    let ci = [0, 1, 2].map(i => Math.min(Math.round(c0[i] + c1[i]), 255))
    return ci.reduce((a, v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
}

function colorGradient(colors, fadeFraction) {

    if (fadeFraction >= 1) {
        return colors[colors.length - 1]
    } else if (fadeFraction <= 0) {
        return colors[0]
    }

    let fade = fadeFraction * (colors.length - 1);
    let interval = Math.trunc(fade);
    fade = fade - interval
    color1 = colors[interval].replace('#', '');
    color2 = colors[interval + 1].replace('#', '');

    return '#' + interpolateColor(color1, color2, fade);
}

function getColors(scheme, steps) {
    colors = []
    for (var i = 0; i < steps; i++) {
        colors.push(colorGradient(scheme, (i / (steps - 1))))
    }
    return colors;
}
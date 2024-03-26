function createNewChartCell(id, cellBlock) {
    cell_icon = '<i class="fa-solid fa-fw fa-chart-line notebook-cell-icon"></i>'
    editor_class = 'notebook-cell-editor-chart'

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    document.getElementById(`editor-${id}`).hidden = true;
    document.getElementById(`editor-${id}`).insertAdjacentHTML('afterEnd', `
<div class="row">
    <div class="col-5 chart-options-box">

        <div class="row">
            <label for="setting-chart-type-${id}" class="col-4 col-form-label">Dataset</label>
            <div class="col-8">
                <button id="setting-chart-type-${id}" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="setting-chart-type-${id}-label-${id}">Cell_1</a></span> 
                </button>
                <ul class="dropdown-menu" id="notebook-new-cell-selector">
                    
                </ul>
            </div>
        </div>

        <div class="row">
            <label for="setting-chart-type-${id}" class="col-4 col-form-label">CHART TYPE</label>
            <div class="col-8">
                <button id="setting-chart-type-${id}" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="setting-chart-type-${id}-label-${id}">Pie Chart</a></span> 
                </button>
                <ul class="dropdown-menu" id="notebook-new-cell-selector">
                    <li><a href="#" class="dropdown-item" id="setting-pie-chart-${id}"><i class="fa-fw fa-solid fa-chart-pie"></i> Pie Chart</a></li>
                    <li><a href="#" class="dropdown-item" id="setting-line-chart-${id}"><i class="fa-fw fa-solid fa-chart-line"></i> Line Chart</a></li>
                    <li><a href="#" class="dropdown-item" id="setting-bar-chart-${id}"><i class="fa-fw fa-solid fa-chart-bar"></i> Bar Chart</a></li>
                </ul>
            </div>
        </div>

        <div class="row">
            <label for="setting-chart-xaxis-${id}" class="col-4 col-form-label">X-AXIS</label>
            <div class="col-8">
                <button id="setting-chart-xaxis-${id}" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="setting-chart-xaxis-${id}-label-${id}">SELECT...</span> 
                </button>
                <ul class="dropdown-menu" id="notebook-new-cell-selector">

                </ul>
            </div>
        </div>

        <div class="row">
            <label for="setting-chart-yaxis-${id}" class="col-4 col-form-label">Y-AXIS</label>
            <div class="col-8">
                <button id="setting-chart-yaxis-${id}" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="setting-chart-yaxis-${id}-label-${id}">SELECT...</span> 
                </button>
                <ul class="dropdown-menu" id="notebook-new-cell-selector">

                </ul>
            </div>
        </div>

        <div class="row">
            <label for="setting-chart-colors-${id}" class="col-4 col-form-label">Colours</label>
            <div class="col-8">
                <button id="setting-chart-colors-${id}" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="setting-chart-colors-${id}-label-${id}">Sprout</span> 
                </button>
                <ul class="dropdown-menu" id="notebook-new-cell-selector">
                <li><a href="#" class="dropdown-item" id="setting-chart-colors-corporate-${id}">Corporate<br />${createExampleGradient(CORPORATE)}</a></li>
                    <li><a href="#" class="dropdown-item" id="setting-chart-colors-sprout-${id}">Sprout<br />${createExampleGradient(SPROUT)}</a></li>
                    <li><a href="#" class="dropdown-item" id="setting-chart-colors-plasma-${id}">Plasma<br />${createExampleGradient(PLASMA)}</a></li>
                    <li><a href="#" class="dropdown-item" id="setting-chart-colors-viridis-${id}">Viridis<br />${createExampleGradient(VIRIDIS)}</a></li>
                    <li><a href="#" class="dropdown-item" id="setting-chart-colors-dracula-${id}">Dracula<br />${createExampleGradient(DRACULA)}</a></li>
                </ul>
            </div>
        </div>

    </div>
    <div class="col-7">
        <span id="execution-timer-${id}" class="mono-font">-</span>
    </div>
</div>
    `);
}


// add the new Chart Cell option
const newChartCellOption = `<li><a class="dropdown-item" href="#" id="new-chart-cell"><i class="fa-solid fa-fw fa-chart-line"></i> Chart cell </a></li>`
document.getElementById("notebook-new-cell-selector").insertAdjacentHTML('beforeend', newChartCellOption)
document.getElementById("new-chart-cell").addEventListener("click", function() { createNewCell("chart") }, false)




function dnskdsldsd() {
    let cell_icon = '<i class="fa-solid fa-fw fa-a notebook-cell-icon"></i>';
    let editor_class = 'notebook-cell-editor-parameter';

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    let control_bar = document.getElementById(`controls-${id}`)
    control_bar.innerHTML = `
<button id="config-${id}" type="button" class="btn btn-secondary">
    <i class="fa-fw fa-solid fa-gear"></i>
</button>
    ` + control_bar.innerHTML

    // add action for the play-function
    document.getElementById(`play-${id}`);
}

//                                 <li><a class="dropdown-item" href="#" id="new-chart-cell"><i class="fa-solid fa-fw fa-chart-line"></i> Chart cell </a></li>
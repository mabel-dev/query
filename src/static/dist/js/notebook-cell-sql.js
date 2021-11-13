/*
Everything relating to the operation of SQL Cells should be in this file and other
than the include in the HTML file, everything should be contained in here.
*/

function createNewSqlCell(id, cellBlock) {
    let cell_icon = '<i class="fa-fw fa-solid fa-table notebook-cell-icon"></i>';
    let editor_class = 'notebook-cell-editor-sql';

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    // add the cell specific buttons to the command bar
    document.getElementById(`controls-${id}`).insertAdjacentHTML('beforebegin', `
<div class="btn-group btn-group-sm notebook-cell-buttons" role="group">
    <button id="pins-${id}" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#sql-saved-modal" data-bs-cellid="${id}">
        Saved <span class="badge bg-pill sql-saved-count">0</span>
    </button>
    <button id="history-${id}" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#sql-history-modal" data-bs-cellid="${id}">
        Recent <span class="badge bg-pill sql-history-count">0</span>
    </button>
    <button id="dates-${id}" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fa-fw fa-solid fa-calendar-days"></i> <span id="date-label-${id}">NOT SET</span> 
    </button>
    <ul class="dropdown-menu" id="notebook-new-cell-selector">
        <li><a href="#" class="dropdown-item" id="dates-last-cycle-${id}">Last Reporting Cycle</a></li>
        <li><a href="#" class="dropdown-item" id="dates-since-last-cycle-${id}">Since Last Reporting Cycle</a></li>
        <li><a href="#" class="dropdown-item" id="dates-today-${id}">Today</a></li>
        <li><a href="#" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#sql-date-modal-${id}">Select Custom Range</a></li>
    </ul>
</div>
    `);

    // create the data selection dialog
    cellBlock.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="sql-date-modal-${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Date Range</h5>
            <button type="button" class="btn-close btm-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
                <div class="setting-label">START DATE</div>
                <input type="date" class="form-control datepicker" id="cell-start-date-${id}" />
                <div class="setting-label">END DATE</div>
                <input type="date" class="form-control datepicker" id="cell-end-date-${id}" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" id="sql-date-modal-apply-${id}" class="btn btn-primary" data-bs-dismiss="modal">Apply</button>
          </div>
        </div>
      </div>
    </div>
    `);

    document.getElementById(`editor-${id}`).insertAdjacentHTML('afterEnd', `
<div class="d-flex flex-row justify-content-between notebook-cell-divider notebook-cell-footer">
    <div>
        <span id="last-executed-${id}">NOT RUN</span>
    </div>
    <div>
        <span id="execution-timer-${id}" class="mono-font">-</span>
    </div>
</div>
    `);

    // add the actions for the control buttons
    let play = document.getElementById(`play-${id}`);
    play.addEventListener("click", function() { execute_sql_query(id) }, false);

    // add the actions for the date selectors
    document.getElementById(`dates-last-cycle-${id}`).addEventListener("click", function() { select_dates(id, moment().subtract(2, 'months').date(27), moment().subtract(1, 'months').date(26)) });
    document.getElementById(`dates-since-last-cycle-${id}`).addEventListener("click", function() { select_dates(id, moment().subtract(1, 'months').date(27), moment()) });
    document.getElementById(`dates-today-${id}`).addEventListener("click", function() { select_dates(id, moment(), moment()) });
    document.getElementById(`sql-date-modal-apply-${id}`).addEventListener("click", function() { select_dates(id, moment(document.getElementById(`cell-start-date-${id}`).value), moment(document.getElementById(`cell-end-date-${id}`).value)) })

    // default to the last reporting cycle
    select_dates(id, moment().subtract(2, 'months').date(27), moment().subtract(1, 'months').date(26));

    // set up the syntax highlighting
    const sql_e = document.getElementById(`editor-${id}`);
    sql_e.focus();
    editor(sql_e, highlight = sql_highlight);

    // load the history and saved lists
    update_sql_history();
    update_sql_saved();
}

function select_dates(id, start, end) {
    document.getElementById(`cell-start-date-${id}`).value = start.format('YYYY-MM-DD');
    document.getElementById(`cell-end-date-${id}`).value = end.format('YYYY-MM-DD');

    if (start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')) {
        document.getElementById(`date-label-${id}`).innerText = start.format('DD MMM YYYY');
    } else {
        document.getElementById(`date-label-${id}`).innerText = start.format('DD MMM YYYY') + ' to ' + end.format('DD MMM YYYY');
    }
}

// add the new SQL Cell option
const newSqlCellOption = `<li><a class="dropdown-item" href="#" id="new-sql-cell"><i class="fa-fw fa-solid fa-table"></i> Query cell </a></li>`
document.getElementById("notebook-new-cell-selector").insertAdjacentHTML('beforeend', newSqlCellOption)
document.getElementById("new-sql-cell").addEventListener("click", function() { createNewCell("sql") }, false)

// add bespoke styles
addNewStyle('.cssClass { color: #F00; }');

let cellBlock = document.getElementById("cell-block")

// create history dialog
cellBlock.insertAdjacentHTML("beforeEnd", `
<div class="modal fade" id="sql-history-modal" tabindex="-1" aria-hidden="true">
  <input type="hidden" class="cell-id" />
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Recent Queries</h5>
        <button type="button" class="btn-close btm-sm" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="sql-history">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`);

// use BootStrap features to put the ID of the Cell that the actions should be applied to
var sqlHistoryModal = document.getElementById('sql-history-modal')
sqlHistoryModal.addEventListener('show.bs.modal', function(event) {
    // Button that triggered the modal
    var button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    var cellId = button.getAttribute('data-bs-cellid');
    // Update the modal's content.
    sqlHistoryModal.querySelector('.cell-id').value = cellId
})

// create saved queries dialog
cellBlock.insertAdjacentHTML("beforeEnd", `
<div class="modal fade" id="sql-saved-modal" tabindex="-1" aria-hidden="true">
  <input type="hidden" class="cell-id" />
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Saved Queries</h5>
        <button type="button" class="btn-close btm-sm" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="sql-saved">

      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`);

// use BootStrap features to put the ID of the Cell that the actions should be applied to
var sqlSavedModal = document.getElementById('sql-saved-modal')
sqlSavedModal.addEventListener('show.bs.modal', function(event) {
    // Button that triggered the modal
    var button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    var cellId = button.getAttribute('data-bs-cellid');
    // Update the modal's content.
    sqlSavedModal.querySelector('.cell-id').value = cellId
})
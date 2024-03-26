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
</div>
    `);

    // create the status bar
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

    // set up the syntax highlighting
    const sql_e = document.getElementById(`editor-${id}`);
    sql_e.focus();
    editor(sql_e, highlight = sql_highlight);

    // load the history and saved lists
    update_sql_history();
    update_sql_saved();
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
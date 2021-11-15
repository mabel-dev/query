var pyodide = null

function createNewPythonCell(id, cellBlock) {
    let cell_icon = '<i class="fa-solid fa-fw fa-code"></i>'
    let editor_class = 'notebook-cell-editor-python'

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    // set up the syntax highlighting
    const sql_e = document.getElementById(`editor-${id}`);
    sql_e.focus();
    editor(sql_e, highlight = py_highlight);


    document.getElementById(`play-${id}`).addEventListener("click", function() {
        python_code = document.getElementById(`editor-${id}`).innerText;
        python_code = python_code.replace(/\u00A0/g, "").replace(/[\r\n]+/g, "\n");
        console.log(python_code);
        if (pyodide !== undefined) {
            let output = pyodide.runPython(python_code);
            console.log(output);
            document.getElementById(`result-cell-${id}`).innerText = output
        } else {
            document.getElementById(`result-cell-${id}`).innerText = "Python Engine not Initialized."
        }
    });
}


// add the new Python Cell option
const newPythonCellOption = `<li><a class="dropdown-item" href="#" id="new-python-cell"><i class="fa-fw fa-solid fa-fw fa-code"></i> Code cell </a></li>`
document.getElementById("notebook-new-cell-selector").insertAdjacentHTML('beforeend', newPythonCellOption)
document.getElementById("new-python-cell").addEventListener("click", function() { createNewCell("python") }, false)



function pythonInitializer() {
    pyodide = null;
    pyodide = loadPyodide({
        indexURL: "/plugins/pyodide@0.18.1/"
    });

    console.log(pyodide.runPython(`
            import sys
            sys.version
        `));
}

loadJS("plugins/pyodide@0.18.1/pyodide.js", pythonInitializer, document.body);
cell_icon = '<i class="fa-solid fa-fw fa-code"></i>'
editor_class = 'notebook-cell-editor-python'

document.getElementById("play-py").addEventListener("click", function() {
    python_code = document.getElementById("py-code").innerText;
    python_code = python_code.replace(/\u00A0/g, "").replace(/[\r\n]+/g, "\n");
    console.log(python_code);
    let output = pyodide.runPython(python_code);
    console.log(output);
    document.getElementById("py-res").innerText = output
});


//const py_ed = document.querySelector('.py_editor');
//py_ed.focus();
//editor(py_ed, highlight = py_highlight);
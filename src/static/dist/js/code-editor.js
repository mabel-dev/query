function sql_highlight(element) {

    var keyword_reg = /\b(SELECT|FROM|WHERE|GROUP\sBY|ORDER\sBY|LIMIT|AS|DESC|ASC|HAVING)\b/gi;
    var function_reg = /\b(COUNT|MAX|MAX|MIN|AVG)\b/gi;
    var numbers_reg = /\b(\d+)\b/g;
    var literal_reg = /"([^\"]*)"/g

    s = element.innerText;
    s = s.replace(keyword_reg, function(m) { return "<span class='code-keyword'>" + m.toUpperCase() + "</span>" });
    s = s.replace(function_reg, function(m) { return "<span class='code-function'>" + m.toUpperCase() + "</span>" });
    s = s.replace(literal_reg, "\"<span class='code-literal'>$1</span>\"");
    s = s.replace(numbers_reg, "<span class='code-numbers'>$1</span>");
    element.innerHTML = s.split('\n').join('<br/>');
}

function py_highlight(element) {

    var numbers_reg = /\b(\d+)\b/g;
    var literal_dbl_reg = /"([^\"]*)"/g
    var literal_sng_reg = /'([^\']*)'/g
    var control_reg = /\b(try|except|pass|finally|return|else|if|elif|import|from|for|in)\b/gi;
    var keyword_reg = /\b(def|class\s)\b/gi;

    s = element.innerText;

    s = s.replace(literal_dbl_reg, "\"<span class='code-yellow'>$1</span>\"");
    s = s.replace(literal_sng_reg, "\"<span class='code-yellow'>$1</span>\"");
    s = s.replace(numbers_reg, "<span class='code-keyword'>$1</span>");
    s = s.replace(control_reg, "<span class='code-literal'>$1</span>");
    s = s.replace(keyword_reg, "<span class='code-blue'>$1</span>");
    element.innerHTML = s.split('\n').join('<br/>');
}

const editor = (el, highlight = js, tab = '    ') => {
    const caret = () => {
        const range = window.getSelection().getRangeAt(0);
        const prefix = range.cloneRange();
        prefix.selectNodeContents(el);
        prefix.setEnd(range.endContainer, range.endOffset);
        return prefix.toString().length;
    };

    const setCaret = (pos, parent = el) => {
        for (const node of parent.childNodes) {
            if (node.nodeType == Node.TEXT_NODE) {
                if (node.length >= pos) {
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStart(node, pos);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    return -1;
                } else {
                    pos = pos - node.length;
                }
            } else {
                pos = setCaret(pos, node);
                if (pos < 0) {
                    return pos;
                }
            }
        }
        return pos;
    };

    highlight(el);

    el.addEventListener('keydown', e => {
        if (e.code == "Tab") {
            pos = caret() + tab.length;
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(tab));
            highlight(el);
            setCaret(pos);
            e.preventDefault();
        }
    });

    el.addEventListener('keyup', e => {
        if (e.code == "Space") {
            const pos = caret();
            highlight(el);
            setCaret(pos);
        }
    });
};
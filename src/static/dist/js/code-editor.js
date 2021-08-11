var keyword_reg = /\b(SELECT|FROM|WHERE|GROUP\sBY|HAVING|LIMIT|ORDER\sBY)\b/gi;
var logical_reg = /\b(AND|OR|NOT|IN|LIKE|IS)\b/gi;
var numbers_reg = /\b(\d+)\b/g;
var literal_reg = /"([^\"]*)"/g;
var function_reg = /\b(COUNT|SUM|MAX|MIN)\b/gi;

const js = el => {
    for (const node of el.children) {
        var s = node.innerText
        s = s.replace(keyword_reg, "<span class='code-keyword'>$1</span>");
        s = s.replace(logical_reg, "<span class='code-logical'>$1</span>");
        s = s.replace(literal_reg, "\"<span class='code-literal'>$1</span>\"");
        s = s.replace(numbers_reg, "<span class='code-numbers'>$1</span>");
        s = s.replace(function_reg, "<span class='code-function'>$1</span>");
        node.innerHTML = s.split('\n').join('<br/>');
    }
};

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
        if (e.which === 9) {
            const pos = caret() + tab.length;
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(tab));
            highlight(el);
            setCaret(pos);
            e.preventDefault();
        }
    });

    el.addEventListener('keyup', e => {
        if (e.keyCode >= 0x30 || e.keyCode == 0x20) {
            const pos = caret();
            highlight(el);
            setCaret(pos);
        }
    });

};

// Turn div into an editor
const el = document.querySelector('#sql-editor');
el.focus();
editor(el);
function sql_highlight(s) {

    var keyword_reg = /\b(SELECT|FROM|WHERE|GROUP\sBY|ORDER\sBY|LIMIT|AS|DESC|ASC|HAVING|NOT|LIKE|MATCHES|AND|OR|IS)\b/gi;
    var function_reg = /\b(COUNT|MAX|MAX|MIN|AVG|DATE|YEAR|MONTH|STRING|CONCAT)\b/gi;
    var values_reg = /\b(TRUE|FALSE|NONE|NULL)\b/gi;
    var numbers_reg = /\b(\d+)\b/g;
    var literal_reg_dbl = /"([^\"]*)"/g

    s = s.replace(keyword_reg, function(m) { return "<span class='code-purple'>" + m.toUpperCase() + "</span>" });
    s = s.replace(function_reg, function(m) { return "<span class='code-green'>" + m.toUpperCase() + "</span>" });
    s = s.replace(literal_reg_dbl, "\"<span class='code-red'>$1</span>\"");
    s = s.replace(numbers_reg, "<span class='code-orange'>$1</span>");
    s = s.replace(values_reg, function(m) { return "<span class='code-blue'>" + m.toUpperCase() + "</span>" });
    return s.split('\n').join('<br/>');
}

function py_highlight(s) {

    var numbers_reg = /\b(\d+)\b/g;
    var literal_dbl_reg = /"([^\"]*)"/g
    var literal_sng_reg = /'([^\']*)'/g
    var control_reg = /\b(try|except|pass|finally|return|else|if|elif|import|from|for|in)\b/gi;
    var keyword_reg = /\b(def|class\s)\b/gi;

    s = s.replace(literal_dbl_reg, "\"<span class='code-yellow'>$1</span>\"");
    s = s.replace(literal_sng_reg, "\"<span class='code-yellow'>$1</span>\"");
    s = s.replace(numbers_reg, "<span class='code-purple'>$1</span>");
    s = s.replace(control_reg, "<span class='code-red'>$1</span>");
    s = s.replace(keyword_reg, "<span class='code-blue'>$1</span>");
    return s.split('\n').join('<br/>');
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

    el.innerHTML = highlight(el.innerText);

    el.addEventListener('keydown', e => {
        if (e.code == "Tab") {
            pos = caret() + tab.length;
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(tab));
            el.innerHTML = highlight(el.innerText);
            setCaret(pos);
            e.preventDefault();
        }
    });

    function insertCharacter(str, char, pos) {
        return [str.slice(0, pos), char, str.slice(pos)].join('');
    }

    el.addEventListener('keydown', e => {
        if (e.code == "Space" ||
            e.code == "Enter" ||
            e.key == "\"" ||
            e.key == "(" ||
            e.key == ")" ||
            e.key == "ArrowUp" ||
            e.key == "ArrowDown" ||
            e.key == "ArrowLeft" ||
            e.key == "ArrowRight") {
            const pos = caret();

            //            if (pos == el.innerText.replace(/\n/g, "").length) {
            //                // if a user types a ( or a ", pre-empt them needing a close
            //                if (e.key == "\"") { el.innerText = insertCharacter(el.innerText, "\"", pos + 1); }
            //                if (e.key == "(") { el.innerText = insertCharacter(el.innerText, ")", pos + 1); }
            //            } else {
            //                console.log(pos, el.innerText.replace(/\n/g, "").length, el.innerText)
            //            }

            el.innerHTML = highlight(el.innerText);
            setCaret(pos);
        }
    });
};
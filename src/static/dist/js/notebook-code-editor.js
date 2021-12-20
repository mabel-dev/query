function stripHTML(s) {
    return s.replace(/(<([^>]+)>)/gi, "");
}

function sql_highlight(s) {

    var keyword_reg = /(?<!\S)(SELECT|FROM|WHERE|GROUP\sBY|ORDER\sBY|LIMIT|AS|DESC|ASC|HAVING|NOT|LIKE|MATCHES|AND|OR|IS)(?!\S)/gi;
    var function_reg = /(?<!\S)(ADDDAYS|AVG|CONCAT|COUNT|DATE|DAY|FLOAT|HASH|HOUR|INT|LEFT|LEN|LOWER|MAX|MD5|MID|MIN|MINUTE|MONTH|NOW|QUARTER|RANDOM|RIGHT|ROUND|SECOND|STRING|TIME|TRIM|TRUNC|UPPER|WEEK|YEAR|PERCENT|APPROX_DISTINCT)\b/gi;
    var values_reg = /(?<!\S)(TRUE|FALSE|NONE|NULL)(?!\S)/gi;
    var numbers_reg = /(?<!\S)(-?\d*(\.?\d+))(?!\S)/gi;
    var literal_reg_dbl = /"([^\"]*)"/g;
    var punctuation_reg = /(\=\=|\!\=|\(|\)|\=|\!)/g;
    var comments_reg = /(--[^\r\n]*$)/g;

    s = s.replaceAll("&#160;", " ");
    s = s.replace(punctuation_reg, function(m) { return "<span class='code-yellow'>" + stripHTML(m) + "</span>" });
    s = s.replace(keyword_reg, function(m) { return "<span class='code-purple'>" + stripHTML(m).toUpperCase() + "</span>" });
    s = s.replace(function_reg, function(m) { return "<span class='code-green'>" + stripHTML(m).toUpperCase() + "</span>" });
    s = s.replace(numbers_reg, function(m) { return "<span class='code-orange'>" + stripHTML(m) + "</span>" });
    s = s.replace(values_reg, function(m) { return "<span class='code-blue'>" + stripHTML(m).toUpperCase() + "</span>" });
    s = s.replace(literal_reg_dbl, function(m) { return "<span class='code-red'>" + stripHTML(m) + "</span>" });
    s = s.replace(comments_reg, function(m) { return "<span class='code-comments'>" + stripHTML(m) + "</span>" });
    return s.split('\n').join('<br/>');
}

function py_highlight(s) {

    var numbers_reg = /\b(\d+)\b/g;
    var literal_dbl_reg = /"([^\"]*)"/g
    var control_reg = /\b(try|except|pass|finally|return|else|if|elif|for|in)\b/gi;
    var keyword_reg = /\b(import|from|def|class)\b/gi;
    var inbuilt_func = /\b(print|enumerate|int|float|dict|list|tuple|set)\b/gi;


    s = s.replace(literal_dbl_reg, "\"<span class='code-yellow'>$1</span>\"");
    s = s.replace(numbers_reg, "<span class='code-purple'>$1</span>");
    s = s.replace(control_reg, "<span class='code-red'>$1</span>");
    s = s.replace(keyword_reg, "<span class='code-blue'>$1</span>");
    s = s.replace(inbuilt_func, "<span class='code-green'>$1</span>");
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
        if (e.code == "sEnter") {
            pos = caret() + "\n".length;
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode("\n"));
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
            e.code == "Tab" ||
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
function createNewSqlCell(id, cellBlock) {
    let cell_icon = '<i class="fas fa-fw fa-database notebook-cell-icon"></i>';
    let editor_class = 'notebook-cell-editor-sql';

    cellBlock.insertAdjacentHTML('beforeend', createCell(id, cell_icon, editor_class))

    let control_bar = document.getElementById(`controls-${id}`)
    control_bar.insertAdjacentHTML('beforebegin', `
<div class="btn-group btn-group-sm notebook-cell-buttons" role="group">
    <button id="pins-${id}" type="button" class="btn btn-secondary">
        Saved <span class="badge bg-pill">5</span>
    </button>
    <button id="history-${id}" type="button" class="btn btn-secondary">
        Recent <span class="badge bg-pill">10</span>
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

    const sqlDateSelectorModal = `
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
`
    cellBlock.insertAdjacentHTML('beforeend', sqlDateSelectorModal);


    // add the actions for the control buttons
    let play = document.getElementById(`play-${id}`);
    play.addEventListener("click", function() { temp_run_sql(id) }, false);
    let history = document.getElementById(`history-${id}`);
    history.addEventListener("click", function() { temp_run_sql(id) }, false);

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

function temp_run_sql(id) {
    data = [{
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 6981775,
        "tweet": "How one woman with a disability learned to love her body through dancing. https://t.co/sboNHm4fmC",
        "location": "New York, NY",
        "sentiment": 0.07142857142857142,
        "timestamp": "2020-01-04T02:40:06"
    }, {
        "userid": 612473,
        "username": "BBCNews",
        "user_verified": true,
        "followers": 10368450,
        "tweet": "Sunken chest syndrome: 'I'm being strangled inside ' https://t.co/C2EWUFT3Fk",
        "location": "London",
        "sentiment": -0.25,
        "timestamp": "2020-01-05T01:16:39"
    }, {
        "userid": 612473,
        "username": "BBCNews",
        "user_verified": true,
        "followers": 10368450,
        "tweet": "Australia fires: A visual guide to the bushfire crisis https://t.co/12WIyKOrCG",
        "location": "London",
        "sentiment": -0.3,
        "timestamp": "2020-01-05T01:16:39"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 6992817,
        "tweet": "Two people have been charged in the killing of a man whose laptop was stolen at a Starbucks in California, prompting him to chase the thief. https://t.co/1fYZoPZkSa",
        "location": "New York, NY",
        "sentiment": -0.2962962962962963,
        "timestamp": "2020-01-06T03:44:03"
    }, {
        "userid": 612473,
        "username": "BBCNews",
        "user_verified": true,
        "followers": 10386989,
        "tweet": "\"Be proud of who you are\"\nhttps://t.co/Feqzc0QQ2S",
        "location": "London",
        "sentiment": 0.3333333333333333,
        "timestamp": "2020-01-08T11:17:16"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7023324,
        "tweet": "DEVELOPING: President Trump to make a national address at 11 a.m. ET after Iran's missile attack last night on Iraqi bases that house US troops. https://t.co/xMYG0YCUtn",
        "location": "New York, NY",
        "sentiment": -0.038461538461538464,
        "timestamp": "2020-01-08T14:53:29"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7027110,
        "tweet": "A woman in Illinois has been charged with aggravated animal cruelty after hundreds of animal carcasses were found in shallow graves at a nonprofit animal sanctuary she founded. https://t.co/Bulf4e1pPA",
        "location": "New York, NY",
        "sentiment": -0.27586206896551724,
        "timestamp": "2020-01-09T02:26:04"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7028438,
        "tweet": "Man convicted of shooting a U.S. Border Patrol agent 9 years ago in a case that exposed \u201cFast and Furious\u201d federal gun operation is sentenced to life in prison. https://t.co/Q5hmD5TuAl",
        "location": "New York, NY",
        "sentiment": -0.36666666666666664,
        "timestamp": "2020-01-09T11:47:01"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7028252,
        "tweet": "Opinion | Kaitlin Menza: How Prince Harry 's and Meghan's bombshell pushes the monarchy in a new direction https://t.co/L1YCpT3CCy - @NBCNewsTHINK",
        "location": "New York, NY",
        "sentiment": 0,
        "timestamp": "2020-01-09T10:45:03"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7029987,
        "tweet": "The surveillance video taken from outside Jeffrey Epstein 's jail cell on the day of his first apparent suicide attempt has been permanently deleted because video from the wrong floor was saved due to a clerical error, federal prosecutors claim. https://t.co/EmYM6VmhTn",
        "location": "New York, NY",
        "sentiment": -0.1,
        "timestamp": "2020-01-09T19:23:03"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7031324,
        "tweet": "The FDA announces more recalls of heartburn medications that have been found to contain trace amounts of a substance that may be linked to cancer. https://t.co/gbH4ybuzVz",
        "location": "New York, NY",
        "sentiment": -0.038461538461538464,
        "timestamp": "2020-01-10T06:01:06"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7031963,
        "tweet": "Australian authorities urged nearly a quarter of a million people to evacuate their homes and prepared military backup as soaring temperatures and erratic winds were expected to fan deadly wildfires across the east coast. https://t.co/3XgoAKPBFv",
        "location": "New York, NY",
        "sentiment": 0,
        "timestamp": "2020-01-10T11:46:02"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7035751,
        "tweet": "NEW: Magnitude 6.0 earthquake hit Puerto Rico just before 8 a.m. ET Saturday morning, causing further damage as residents are reeling from series of strong quakes. https://t.co/H6tY26NwOo",
        "location": "New York, NY",
        "sentiment": -0.037037037037037035,
        "timestamp": "2020-01-11T14:42:25"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7038057,
        "tweet": "A Seattle officer was suspended after an investigation found that a lie the officer told a hit-and-run suspect contributed to the man's suicide. https://t.co/cAjWPHEz4y",
        "location": "New York, NY",
        "sentiment": -0.16666666666666666,
        "timestamp": "2020-01-12T07:11:04"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7041298,
        "tweet": " 'Jeopardy!' was thrust into the debate surrounding a longstanding geopolitical conflict in the Middle East on Friday with a question about the location of the Church of the Nativity. https://t.co/4G0VfMBoJp",
        "location": "New York, NY",
        "sentiment": -0.06666666666666667,
        "timestamp": "2020-01-13T07:37:04"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7041524,
        "tweet": "Two ZIP codes in Mooresville, North Carolina, have seen a higher than expected rate of thyroid cancer. Susan Wind, whose daughter was diagnosed in 2017, believes a connection is out there. https://t.co/Vhf1EOQ4bc",
        "location": "New York, NY",
        "sentiment": -0.03125,
        "timestamp": "2020-01-13T09:50:05"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7045214,
        "tweet": "It\u2019s a moment touted by the Census Bureau that leads the charge, which tries to get ahead of the many residents who leave following the spring thaw to fish and hunt. (3/6)",
        "location": "New York, NY",
        "sentiment": -0.09375,
        "timestamp": "2020-01-14T04:08:24"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7046156,
        "tweet": "US Secret Service says off-duty agent fatally shot a dog in New York City on Monday night. https://t.co/GYPC9FzXiz",
        "location": "New York, NY",
        "sentiment": 0,
        "timestamp": "2020-01-14T18:52:02"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7046295,
        "tweet": "On March 11, 2011, a huge tsunami slammed through the walls of Fukushima 's power plant. 3 nuclear reactors melted down, spewing radioactive particles into the air.\n\n9 years later, the area will help kick off the 2020 Summer Olympics. https://t.co/KdDKmSA3PV",
        "location": "New York, NY",
        "sentiment": 0.07692307692307693,
        "timestamp": "2020-01-14T19:36:05"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7046864,
        "tweet": "New video appears to show a second missile hitting Ukrainian plane in Iran. https://t.co/2kI9rjGWdU - @NBCNightlyNews",
        "location": "New York, NY",
        "sentiment": 0,
        "timestamp": "2020-01-15T00:35:05"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7046546,
        "tweet": "Baltimore's city council looks to join a growing wave of cities and states prohibiting discrimination based on hair texture and style. https://t.co/TPUPHQaObe",
        "location": "New York, NY",
        "sentiment": 0.09090909090909091,
        "timestamp": "2020-01-14T21:36:01"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7049432,
        "tweet": "NFL rookie Josh Jacobs, whose family was once homeless, surprises his dad with a house. https://t.co/cbINjU35LI",
        "location": "New York, NY",
        "sentiment": -0.125,
        "timestamp": "2020-01-15T21:53:06"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7050377,
        "tweet": "A Christian high school student in Kentucky was expelled after school administrators saw a photograph from her 15th birthday party in which she was wearing a rainbow sweater and smiling next to a rainbow birthday cake. https://t.co/rjw1LZU25Y",
        "location": "New York, NY",
        "sentiment": 0,
        "timestamp": "2020-01-16T07:20:03"
    }, {
        "userid": 14173315,
        "username": "NBCNews",
        "user_verified": true,
        "followers": 7050442,
        "tweet": "U.K. veteran says Prince Harry defended him from anti-gay soldiers. https://t.co/ilqkgkvvui - @NBCOUT",
        "location": "New York, NY",
        "sentiment": 0,
        "timestamp": "2020-01-16T08:41:07"
    }, {
        "userid": 612473,
        "username": "BBCNews",
        "user_verified": true,
        "followers": 10415949,
        "tweet": "Flybe to switch Newquay-Heathrow flights to Gatwick, in a change that could anger firms in the South West https://t.co/dgpnIVr917",
        "location": "London",
        "sentiment": -0.15789473684210525,
        "timestamp": "2020-01-16T16:10:25"
    }];
    data.columns = ["userid", "username", "user_verified", "followers", "tweet", "location", "sentiment", "timestamp"];
    resultTable = renderTable(data, 1, 10);
    resultHeader = ''
    resultFooter = `
    <div class="card d-flex flex-row justify-content-between notebook-cell-footer">
        <div>
            <button type="button" class="btn btn-sm btn-light">
                <i class="fa-fw fa-regular fa-floppy-disk"></i> Save
            </button>
            <button type="button" class="btn btn-sm btn-light">
                <i class="fa-fw fa-solid fa-right-to-bracket fa-rotate-90 "></i> Download
            </button>
        </div>
        <div class="align-middle">
            1 - 10 of Many (2000 available) 
            <button type="button" class="btn btn-sm btn-light">
                <i class="fa-fw fas fa-chevron-left"></i>
            </button>
            <button type="button" class="btn btn-sm btn-light">
                <i class="fa-fw fas fa-chevron-right"></i>
            </button>
        </div>
    </div>`

    document.getElementById(`result-cell-${id}`).innerHTML = resultHeader + "<div class='w-100 overflow-auto'>" + resultTable + "</div>" + resultFooter;
}


// add the new SQL Cell option
const newSqlCellOption = `<li><a class="dropdown-item" href="#" id="new-sql-cell"><i class="fas fa-fw fa-database"></i> SQL cell </a></li>`
document.getElementById("notebook-new-cell-selector").insertAdjacentHTML('beforeend', newSqlCellOption)
document.getElementById("new-sql-cell").addEventListener("click", function() { createNewCell("sql") }, false)
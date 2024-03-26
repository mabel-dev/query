// Apollo
// God of Light, Knowledge and Help (amongst other things)

const apollo_api = new APIAdapter('apollo');

document.getElementById("assistantButton").addEventListener("click", function () {
    let prompt = document.getElementById("assistantPrompt").value;
    let suggestion_container = document.getElementById("assistantSuggestions");

    apollo_api.get("v1/identify", null, { token: prompt }).then(data => {

        console.log(data);

    
        let type_suggestion = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Continue Exploring</h5>
                <p class="card-text">
                    ${data.token} is a ${data.class}
                    <br />
                    <code>${data.search}</code>
                    <br />
                    <button type="button" class="btn btn-tiny btn-primary" title="Load Query into Editor"><i class="fa-fw fa-solid fa-reply fa-rotate-90"></i></button>
                    <button type="button" class="btn btn-tiny btn-success" title="Run Query"><i class="fa-fw fa-solid fa-play"></i></button>
                </p>
            </div>
        </div>`;

        suggestion_container.innerHTML = type_suggestion;
    }

    ).catch(err => {
        suggestion_container.innerHTML = "";
        console.error(`Error occurred: ${err}`);
    }
    );
);


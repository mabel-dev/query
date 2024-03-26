// Apollo
// God of Light, Knowledge and Help (amongst other things)

const apollo_api = new APIAdapter('apollo');

document.getElementById("assistantButton").addEventListener("click", function () {
    let prompt = document.getElementById("assistantPrompt").textContent;

    apollo_api.get("/v1/identify", null, { token: prompt }).then(data =>

        console.log(data)

    ).catch(err => console.error(`Error occurred: ${err}`));
})





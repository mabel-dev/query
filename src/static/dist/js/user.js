function initUser() {

    let url = '/user'

    fetch(url, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            response.json().then(user => {
                document.getElementById("identity").innerText = user.identity;
            });
        });
}
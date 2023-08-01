let password = document.querySelector('#password')
let email = document.querySelector('#email')
let submitFormLogin = document.getElementById("formLogin");


submitFormLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Expression régulière pour vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value)) {
        // Si l'email n'est pas valide, afficher un message d'erreur ou prendre une autre action
        const messageAddress = document.querySelector("#message-address");
        messageAddress.style.display = "flex";
        return;

    } else {

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    })
        .then(reponse => reponse.json())
        .then(data => {
            let token = data.token
            localStorage.setItem("Token", token);
            if (token) {
                window.location.replace("index.html");
            } else {
                const messageLogin = document.querySelector(".message-login");
                messageLogin.style.display = "flex";
            }
        });
    }
});

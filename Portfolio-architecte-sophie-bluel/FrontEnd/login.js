let password = document.querySelector('#password')
let email = document.querySelector('#email')
let submitFormLogin = document.getElementById("form")


submitFormLogin.addEventListener("submit", async (event) => {                     // ecoute bouton login avec preventDefault pour attendre les instructions avant de lancer event
    event.preventDefault()

    fetch("http://localhost:5678/api/users/login", {                                // recup fetch login users avec methode post
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({                                                      // verification des input avec .value sur email et password
            email: email.value,
            password: password.value,
        }),
    })
        .then(reponse => reponse.json())
        .then(data => {
            let token = data.token
            localStorage.setItem("Token", token)                                  // stocker token dans le localStorage
            if (token) {                                                            // si token correspond redirection sur index sinon message erreur
                window.location.replace('index.html')
            } else {
                const messageLogin = document.querySelector(".message-login")
                messageLogin.style.display = "flex"
            }
        })
})

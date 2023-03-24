let myForm = document.querySelector("#myform");

myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            Login(data);
            localStorage.setItem("token", JSON.stringify({ data }));
        });
});

// Stockage du token

let resAPIlogIn = localStorage.getItem("token");
let tokenJson = JSON.parse(resAPIlogIn);
let token = tokenJson.data.token;

function Login(data) {
    if (data.token) {
        location.href = "./index.html";
    } else {
        let myError = document.getElementById("error");
        myError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        myError.style.color = "red";
    }
}

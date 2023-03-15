let myForm = document.querySelector("#myform");

myForm.addEventListener("submit", function (e) {
    let email = document.getElementById("email");

    let password = document.getElementById("password");

    if (password.value !== "S0phie") {
        let myError = document.getElementById("error");
        myError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        myError.style.color = "red";
        e.preventDefault();
    }
    if (email.value !== "sophie.bluel@test.tld") {
        let myError = document.getElementById("error");
        myError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        myError.style.color = "red";
        e.preventDefault();
    }
    if (email.value == "sophie.bluel@test.tld" && password.value == "S0phie") {
        e.preventDefault();
        location.href = "./index.html";
    }
});

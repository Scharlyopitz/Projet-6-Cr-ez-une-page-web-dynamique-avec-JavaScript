let myForm = document.querySelector("#myform");

myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // if (email.value == "sophie.bluel@test.tld" && password.value == "S0phie") {
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
            localStorage.setItem("token", JSON.stringify({ data }));
            location.href = "./index.html";
        });
    // } else {
    //     let myError = document.getElementById("error");
    //     myError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
    //     myError.style.color = "red";
    // }
});

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
            if (data.token) {
                location.href = "./index.html";
            } else {
                let myError = document.getElementById("error");

                myError.innerHTML =
                    "Erreur dans l’identifiant ou le mot de passe.";
                myError.classList.add("errorMessage");

                setTimeout(() => (myError.innerHTML = ""), 4000);

                setTimeout(
                    () => myError.classList.remove("errorMessage"),
                    4000
                );
            }
            localStorage.setItem("token", JSON.stringify({ data }));
        });
});

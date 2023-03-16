// **************************** Fonction d'ajout projet ****************************

export function ajoutListenerProjet() {
    const formulaire = document.querySelector("#form-ajtpht");
    formulaire.addEventListener("submit", function (event) {
        event.preventDefault();

        const projets = {
            file: parseInt(event.target.querySelector("[name=file]").value),
            titre: event.target.querySelector("[name=titre]").value,
            catégorie: event.target.querySelector("[name=category]").value,
        };
        const chargeUtile = JSON.stringify(projets);
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile,
        });
    });
}

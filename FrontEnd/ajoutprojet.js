// **************************** Fonction d'ajout projet ****************************

export function ajoutListenerProjet() {
    const formulaire = document.querySelector("#form-ajtpht");
    formulaire.addEventListener("submit", function (event) {
        event.preventDefault();

        const projects = {
            file: parseInt(event.target.querySelector("[name=file]").value),
            titre: event.target.querySelector("[name=titre]").value,
            catégorie: event.target.querySelector("[name=category]").value,
        };
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projects),
        });
    });
}

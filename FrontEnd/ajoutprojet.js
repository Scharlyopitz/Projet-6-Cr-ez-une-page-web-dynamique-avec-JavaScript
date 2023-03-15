export function ajoutProjet() {
    const validAjoutPhoto = document.querySelector("#sbmit-btn");

    validAjoutPhoto.addEventListener("click", function (event) {
        const id = event.target.dataset.id;
        fetch(`http://localhost:5678/api/users/${id}/login`);
    });
}

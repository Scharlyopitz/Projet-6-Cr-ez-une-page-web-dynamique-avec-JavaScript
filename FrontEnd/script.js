// ****************** Recherche des API ******************

// Recherche de l'API category

triCategory();

let categoryshow = [];

function triCategory() {
    fetch("http://localhost:5678/api/categories")
        .then((response) => response.json())
        .then((data) => (categoryshow = data))
        .then(renderCategory)
        .catch((err) => console.log(err));
}

// Recherche de l'API works

triArticles();

let workshow = [];

let work = [];

async function triArticles() {
    await fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((data) => (work = data))
        .catch((err) => console.log(err));
    workshow = work;
    render();
    modalRender();
}

// ***************** Affichage du rendu categorie *****************

function renderCategory() {
    const categoryContainer = `<button class="active">Tous</button>`;

    document.querySelector(".category_container").innerHTML = categoryContainer;

    categoryshow.forEach((element) => {
        const categoryContainer = `<button data-category="${element.name}">${element.name}</button>`;

        document.querySelector(".category_container").innerHTML +=
            categoryContainer;
    });

    // Ajout de la class "active" pour la couleur des boutons au "click" et affichage dynamique sur les boutons de trie

    const categoryBtn = document
        .querySelector(".category_container")
        .querySelectorAll("button");

    categoryBtn.forEach(function (element) {
        element.addEventListener("click", function () {
            categoryBtn.forEach(function (btn) {
                btn.classList.remove("active");
            });

            element.classList.add("active");
            workshow = work.filter(function (objet) {
                return objet.category.name === element.dataset.category;
            });

            document.querySelector(".gallery").innerHTML = "";
            if (element.dataset.category != null) {
                render();
            } else {
                triArticles();
            }
        });
    });
}

// ***************** Affichage du rendu des articles *****************

function render() {
    workshow.forEach((element) => {
        const domElement = `
        <figure data-id="${element.id}">
            <img src="${element.imageUrl}" alt="${element.title}">
            <figcaption>${element.title}</figcaption>
        </figure>`;
        document.querySelector(".gallery").innerHTML += domElement;
    });
}

// ***************** Mode Edition *****************

// Stockage du token

let resAPIlogIn = localStorage.getItem("token");

let tokenJson = JSON.parse(resAPIlogIn);

let token = tokenJson.data.token;

// Appartition du mode édition à la récupération du token

if (localStorage.getItem("token")) {
    document.getElementById("logIn").innerHTML = "logout";

    document.getElementById("logIn").style.fontWeight = "600";

    document.querySelector(".mode-edition").classList.add("unhide");

    document.querySelector("header").style.marginTop = "100px";
}

// Suppression du token au logOut

document.getElementById("logIn").addEventListener("click", () => {
    localStorage.removeItem("token");
});

// Ajout des butons du mode édition

const modif = `<i class="fa-regular fa-pen-to-square"></i>
<p>modifier</p>`;

document.querySelector(".modifier-btn").innerHTML += modif;

document.querySelector(".modifier-btn2").innerHTML += modif;

// Fonctionnement des boutons édition au click + suppression de la barre des catégories à son activation

const btn1 = document.querySelector(".modifier-btn");

const btn2 = document.querySelector(".modifier-btn2");

const categoryContainer = document.querySelector(".category_container");

const foncEdition = document.querySelector(".mode-edition").querySelector("p");

foncEdition.addEventListener("click", function () {
    btn1.classList.toggle("invisible");

    btn2.classList.toggle("invisible");

    categoryContainer.classList.toggle("invisible");
});

// ****************************** Affichage de la modal ******************************

function modalRender() {
    const modalShow = `
    <div class="modal-container">
        <div class="croix">
            <i id="btn-close" class="fa-sharp fa-solid fa-xmark"></i>
        </div>
        <div class="modal-title">Galerie Photo</div>
        <div class="modal-articles"></div>
        <div class="modal-btn">
            <button>Ajouter une photo</button>
            <span>Supprimer la galerie</span>
        </div>
    </div>`;
    document.querySelector(".modal").innerHTML = modalShow;

    workshow.forEach((element) => {
        const domModal = `<div class="article" data-id="${element.id}">
        <img
            src="${element.imageUrl}"
            alt=""
        />
        <p>éditer</p>
        <i data-id="${element.id}" class="fa-solid fa-trash-can"></i>
    </div>`;
        document.querySelector(".modal-articles").innerHTML += domModal;
    });

    // Boutons pour afficher / cacher la modal

    const btn = document.querySelector(".modifier-btn");

    const btn2 = document.querySelector(".modifier-btn2");

    const modal = document.querySelector(".modal");

    const body = document.querySelector("body");

    btn.addEventListener("click", function () {
        modal.style.display = "block";
        body.style.overflow = "hidden";
        return modalRender();
    });

    btn2.addEventListener("click", function () {
        modal.style.display = "block";
        body.style.overflow = "hidden";
        return modalRender();
    });

    const span = document.getElementById("btn-close");

    span.addEventListener("click", function () {
        modal.style.display = "none";
        body.style.overflow = "visible";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            body.style.overflow = "visible";
        }
    });

    // ************ Suppression des travaux dans l'API ************

    // Suppression des photos dans la modal

    const trash = document
        .querySelector(".modal-articles")
        .querySelectorAll("i");

    const article = document.querySelectorAll(".article");

    const galleryArtcile = document.querySelectorAll(".gallery figure");

    trash.forEach(function (element) {
        element.addEventListener("click", function () {
            let id = element.dataset.id;

            element.parentElement.remove();

            galleryArtcile.forEach((e) => {
                if (e.dataset.id == id) {
                    e.remove();
                }
            });

            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "*/*",
                },
            })
                .then((res) => console.log(res))
                .then((data) => console.log(data));
        });
    });

    // Suppression de la galerie

    const suprGallery = document
        .querySelector(".modal-btn")
        .querySelector("span");

    suprGallery.addEventListener("click", function () {
        article.forEach(function (e) {
            let id = e.dataset.id;

            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "*/*",
                },
            })
                .then((res) => res.json())
                .then((data) => console.log(data));
        });
    });

    // ***************** Bouton affichage modal "Ajout Photo" *****************

    const ajoutPht = document
        .querySelector(".modal-btn")
        .querySelector("button");

    ajoutPht.addEventListener("click", function () {
        document.querySelector(".modal-title").innerHTML = `Ajout Photo`;

        document.querySelector(".modal-btn").style.display = "none";

        const undertitle = `   
            <form  id="form-ajtpht" method="POST">
                <div class="modal-ajtpht">
                    <div id="file-image-container">
                        <img src="" id="image-upload">
                        <div hidden id="file-text">
                            <span>Supprimer la Photo</span>
                        </div>
                    </div> 
                    <span id="alert-image-size"></span> 
                    <i id="img-modal" class="fa-regular fa-image"></i>
                    <input type="file" id="file" name="file" accept="image/png, image/jpeg" >
                    <label class="ajtpht-btn" for="file">+ Ajouter photo</label>
                    <span id="textRequired">jpg, png : 4mo max</span>
                </div>
                <label for="titre">Titre</label>
                  <input type="text" name="titre" id="titre" >
                  <label for="category">Categorie</label>
                <select name="category" id="category" >
                    <option value="">-- Choisissez une catégorie --</option>
                </select>
                <span id="missing"></span>
                <div class="border-form">
                    <input type="submit" value="Valider" id="submit-btn"  />
                </div>
            </form>  `;

        document.querySelector(".croix").innerHTML += `
        <i id="arrow" class="fa-regular fa-arrow-left">
        </i><i id="btn-close2" class="fa-sharp fa-solid fa-xmark"></i>`;

        document.querySelector(".modal-articles").innerHTML = ``;

        document.querySelector(".modal-articles").innerHTML = undertitle;

        const btnclose = document.querySelector("#btn-close2");

        btnclose.addEventListener("click", function () {
            modal.style.display = "none";
            body.style.overflow = "visible";
        });

        // Ajout des categories avec API + bouton de retour en arrière

        categoryshow.forEach((e) => {
            const option = `<option  value="${e.id}">${e.name}</option>`;
            document.getElementById("category").innerHTML += option;
        });

        const arrow = document.getElementById("arrow");

        arrow.addEventListener("click", function () {
            return modalRender();
        });

        // ************ Elements du DOM pour l'aperçu de l'image de l'input file ************

        const imgUpload = document.querySelector("#image-upload");

        const imgModal = document.querySelector("#img-modal");

        const textRequiredAjoutPht = document.querySelector("#textRequired");

        const btnAjoutPht = document.querySelector(".ajtpht-btn");

        const inputFile = document.querySelector("#file");

        const imageFileContainer = document.querySelector(
            "#file-image-container"
        );

        const errorSizeImage = document.querySelector("#alert-image-size");

        // Fonction pour l'affichage / supression de l'image input file

        function imageInputFile() {
            inputFile.addEventListener("change", function () {
                const [file] = inputFile.files;

                if (file.size < 4000000) {
                    imgUpload.src = URL.createObjectURL(file);
                    imgUpload.style.display = "block";
                    imageFileContainer.style.display = "block";
                    btnAjoutPht.style.display = "none";
                    imgModal.style.display = "none";
                    textRequiredAjoutPht.style.display = "none";
                    errorSizeImage.innerHTML = "";
                } else {
                    errorSizeImage.innerHTML = `L'image ne doit pas dépasser 4Mo`;
                    errorSizeImage.style.color = "red";
                    inputFile.value = "";
                }
            });

            //  Suppression de la photo

            const deletePhoto = document.querySelector("#file-text");

            deletePhoto.addEventListener("click", function () {
                imgUpload.style.display = "";
                imageFileContainer.style.display = "";
                btnAjoutPht.style.display = "";
                imgModal.style.display = "";
                textRequiredAjoutPht.style.display = "";
                inputFile.value = "";
            });
        }

        imageInputFile();

        // ****** Elements du DOM pour le remplissage du formulaire ******

        const errorMissingForm = document.querySelector("#missing");

        const formulaire = document.querySelector("#form-ajtpht");

        const inputTitre = document.querySelector("#titre");

        const inputSelect = document.querySelector("#category");

        const btnValidationForm = document.querySelector("#submit-btn");

        // Fonction clear du formulaire à l'envoie

        function clearFields() {
            document.querySelector("#file").value = "";
            document.querySelector("#titre").value = "";
            document.querySelector("#category").value = "";
            btnValidationForm.style.background = "";
        }

        function clearPhotoFile() {
            imgUpload.style.display = "";
            imageFileContainer.style.display = "";
            btnAjoutPht.style.display = "";
            imgModal.style.display = "";
            textRequiredAjoutPht.style.display = "";
            inputFile.value = "";
        }

        // Ecouteur d'évènment pour la couleur du bouton du formulaire

        formulaire.addEventListener("input", function () {
            if (
                inputFile.value === "" ||
                inputTitre.value === "" ||
                inputSelect.value === ""
            ) {
                btnValidationForm.style.background = "";
            } else {
                btnValidationForm.style.background = "#1d6154";

                errorMissingForm.innerHTML = "";
            }
        });

        // ************ Ajout de l'article sur l'API en "POST" ************

        // Recherche élément du DOM pour category de formData

        formulaire.addEventListener("submit", function (e) {
            e.preventDefault();
            console.log(inputFile.value, inputTitre.value, inputSelect.value);

            // Traitement cas par cas pour les messages d'erreur

            if (inputFile.value === "") {
                errorMissingForm.innerHTML = "Veuillez ajouter une photo";
            } else if (inputTitre.value === "") {
                errorMissingForm.innerHTML = "Veuillez ajouter un titre";
            } else if (inputSelect.value === "") {
                errorMissingForm.innerHTML =
                    "Veuillez sélectionner une catégorie";
            }

            // Formdata pour l'envoie du formulaire avec image

            let formData = new FormData();

            formData.append("image", e.target.file.files[0]);

            formData.append("title", e.target.titre.value);

            formData.append("category", e.target.category.value);

            // Traitement du fetch une fois que tout le formulaire est rempli

            if (
                inputFile.value !== "" &&
                inputTitre.value !== "" &&
                inputSelect.value !== ""
            ) {
                clearPhotoFile();
                clearFields();
                fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        // Recherche des éléments pour l'ajout travaux

                        const urlParams = new URLSearchParams(data);

                        const imageUrl = urlParams.get("imageUrl");

                        const title = urlParams.get("title");

                        const Id = urlParams.get("id");

                        // Création de l'objet ajout travaux

                        const newWork = `
                        <figure data-id="${Id}">
                            <img src="${imageUrl}" alt="${title}">
                            <figcaption>${title}</figcaption>
                        </figure>`;
                        document.querySelector(".gallery").innerHTML += newWork;
                    })
                    .catch((error) => console.log(error));
            }
        });
    });
}

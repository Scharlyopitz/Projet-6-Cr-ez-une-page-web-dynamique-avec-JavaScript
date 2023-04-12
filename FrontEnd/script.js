// ****************** Recherche des API ******************

// Recherche de l'API pour les categories

displayCategory();

let categoryshow = [];

function displayCategory() {
    fetch("http://localhost:5678/api/categories")
        .then((response) => response.json())
        .then((data) => (categoryshow = data))
        .then(categoryRender)
        .catch((err) => console.log(err));
}

// Recherche de l'API pour les travaux

displayWork();

let workshow = [];

let work = [];

async function displayWork() {
    await fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((data) => (work = data))
        .catch((err) => console.log(err));
    workshow = work;
    workRender();
    modalRender();
}

// ***************** Affichage du rendu categorie *****************

function categoryRender() {
    document.querySelector(
        ".category_container"
    ).innerHTML = `<button id="Tous" class="active">Tous</button>`;

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
                workRender();
            } else {
                displayWork();
            }
        });
    });
}

// ***************** Affichage du rendu des articles *****************

function workRender() {
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

let resultApiLogin = localStorage.getItem("token");

let tokenJson = JSON.parse(resultApiLogin);

let token = tokenJson.data.token;

// Appartition du mode édition à la récupération du token

if (token) {
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

const modifBtn = `
<i class="fa-regular fa-pen-to-square"></i>
<p>modifier</p>`;

document.querySelector(".modifier-btn").innerHTML += modifBtn;

document.querySelector(".modifier-btn2").innerHTML += modifBtn;

// Fonctionnement des boutons édition au click + suppression de la barre des catégories à son activation

const modifBtn1 = document.querySelector(".modifier-btn");

const modifBtn2 = document.querySelector(".modifier-btn2");

const categoryContainer = document.querySelector(".category_container");

const foncEdition = document.querySelector(".mode-edition").querySelector("p");

foncEdition.addEventListener("click", function () {
    modifBtn1.classList.toggle("invisible");

    modifBtn2.classList.toggle("invisible");

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
        const workModal = `
        <div class="article" data-id="${element.id}">
        <img
            src="${element.imageUrl}"
            alt=""
        />
        <p>éditer</p>
        <i data-id="${element.id}" class="fa-solid fa-trash-can"></i>
    </div>`;
        document.querySelector(".modal-articles").innerHTML += workModal;
    });

    // Boutons pour afficher / cacher la modal

    const modal = document.querySelector(".modal");

    const body = document.querySelector("body");

    modifBtn1.addEventListener("click", function () {
        modal.style.display = "block";
        body.style.overflow = "hidden";
        return modalRender();
    });

    modifBtn2.addEventListener("click", function () {
        modal.style.display = "block";
        body.style.overflow = "hidden";
        return modalRender();
    });

    const closeBtn = document.getElementById("btn-close");

    closeBtn.addEventListener("click", function () {
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

    const galleryArticle = document.querySelectorAll(".gallery figure");

    trash.forEach(function (element) {
        element.addEventListener("click", function () {
            let id = element.dataset.id;

            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "*/*",
                },
            }).then((res) => {
                console.log(res);

                if (res.ok === true) {
                    // Suppression du projet dans la modal
                    element.parentElement.remove();

                    // Suppression du projet dans la gallerie
                    galleryArticle.forEach((e) => {
                        if (e.dataset.id == id) {
                            e.remove();
                        }
                    });

                    // console.log(workshow.filter(works => works ));
                }
            });
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

        const ajtPhtModal = `   
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

        document.querySelector(".modal-articles").innerHTML = ajtPhtModal;

        const btnClose = document.querySelector("#btn-close2");

        btnClose.addEventListener("click", function () {
            modal.style.display = "none";

            body.style.overflow = "visible";
        });

        // Ajout des categories sur l'input Select + bouton de retour en arrière

        categoryshow.forEach((e) => {
            const option = `<option  value="${e.id}" >${e.name}</option>`;

            document.getElementById("category").innerHTML += option;
        });

        const arrowBack = document.getElementById("arrow");

        arrowBack.addEventListener("click", function () {
            return modalRender();
        });

        // **** Recherche élements du DOM pour l'aperçu de l'image de l'input file ****

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

        function imageInputFileRender() {
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

                // Couleur du bouton submit à la suppression de l'image

                document.querySelector("#submit-btn").style.background = "";
            });
        }

        imageInputFileRender();

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

        // **** Ecouteur d'évènment pour la couleur du bouton du formulaire ****

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
                errorMissingForm.style.background = "";
            }
        });

        // ************ Ajout de l'article sur l'API en "POST" ************

        formulaire.addEventListener("submit", function (e) {
            e.preventDefault();

            // Traitement cas par cas pour les messages d'erreur

            if (inputFile.value === "") {
                errorMissingForm.innerHTML = "Veuillez ajouter une photo";
                errorMissingForm.style.background = "red";
            } else if (inputTitre.value === "") {
                errorMissingForm.innerHTML = "Veuillez ajouter un titre";
                errorMissingForm.style.background = "red";
            } else if (inputSelect.value === "") {
                errorMissingForm.innerHTML =
                    "Veuillez sélectionner une catégorie";
                errorMissingForm.style.background = "red";
            }

            // Formdata pour l'envoie du formulaire avec image

            let formData = new FormData();

            formData.append("image", e.target.file.files[0]);

            formData.append("title", e.target.titre.value);

            formData.append("category", e.target.category.value);

            // Prise des information de la catégorie pour l'ajout du nouveau projet

            const category = workshow[e.target.category.value - 1].category;

            // Traitement du fetch une fois que tout le formulaire est rempli

            if (
                inputFile.value !== "" &&
                inputTitre.value !== "" &&
                inputSelect.value !== ""
            ) {
                // Reset du formulaire

                clearPhotoFile();
                clearFields();

                // Ajout de la photo + titre sur l'API

                fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.id) {
                            // Recherche des éléments pour l'ajout travaux dynamique

                            const imageUrl = data.imageUrl;

                            const title = data.title;

                            const id = data.id;

                            // Injection des données du nouveau projet dans l'API

                            const newWork = {
                                id,
                                title,
                                imageUrl,
                                category,
                            };

                            workshow.push(newWork);

                            // Création du travail à poster dans la gallerie

                            document.querySelector(".gallery").innerHTML += `
                            <figure data-id="${id}">
                                <img src="${imageUrl}" alt="${title}">
                                <figcaption>${title}</figcaption>
                            </figure>`;

                            // Ajout du message pour l'ajout du projet avec succès

                            errorMissingForm.innerHTML =
                                "Ajout de la photo réussi !";

                            errorMissingForm.classList.add("succes");

                            setTimeout(
                                () =>
                                    errorMissingForm.classList.remove("succes"),
                                4000
                            );
                        } else {
                            // Ajout du message d'échec d'ajout du projet

                            errorMissingForm.innerHTML =
                                "Echec de l'ajout de la photo ";

                            errorMissingForm.classList.add("errorMessage");

                            setTimeout(
                                () =>
                                    errorMissingForm.classList.remove(
                                        "errorMessage"
                                    ),
                                4000
                            );
                        }
                    })
                    .catch((error) => console.log(error));
            }
        });
    });
}

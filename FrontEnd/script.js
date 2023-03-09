// Recherche de l'API category

let categoryshow = [];

let category = [];

async function triCategory() {
    await fetch("http://localhost:5678/api/categories")
        .then((response) => response.json())
        .then((data) => (category = data))
        .catch((err) => console.log(err));
    categoryshow = category;
    renderCategory();
}

triCategory();

function renderCategory() {
    const categoryContainer = `<button class="active">Tous</button>`;
    document.querySelector(".category_container").innerHTML = categoryContainer;
    categoryshow.forEach((element) => {
        const categoryContainer = `<button data-category="${element.name}">${element.name}</button>`;

        document.querySelector(".category_container").innerHTML +=
            categoryContainer;
    });

    // Ajout de la class "active" et affichage dynamique sur les boutons de trie

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

// Recherche de l'API works

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

triArticles();

function render() {
    workshow.forEach((element) => {
        const domElement = `<figure>
        <img src="${element.imageUrl}" alt="${element.title}">
        <figcaption>${element.title}</figcaption>
        </figure>`;
        document.querySelector(".gallery").innerHTML += domElement;
    });
}

// Ajout du mode édition

const edition = `
<i class="fa-regular fa-pen-to-square"></i>
<p>Mode édition</p>
<button>publier les changements</button>`;
document.querySelector(".mode-edition").innerHTML += edition;

// Ajout butons de édition

const modif = `<i class="fa-regular fa-pen-to-square"></i>
<p>modifier</p>`;
document.querySelector(".modifier-btn").innerHTML += modif;
document.querySelector(".modifier-btn2").innerHTML += modif;

// Fonctionnemnt bouton édition au click
const btn1 = document.querySelector(".modifier-btn");

const btn2 = document.querySelector(".modifier-btn2");

const categoryContainer = document.querySelector(".category_container");

const foncEdition = document.querySelector(".mode-edition").querySelector("p");

foncEdition.addEventListener("click", function () {
    btn1.classList.toggle("invisible");
    btn2.classList.toggle("invisible");
    categoryContainer.classList.toggle("invisible");
});

// Affichage de la modal

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
        const domModal = `<div class="article">
        <img
            src="${element.imageUrl}"
            alt=""
        />
        <p>éditer</p>
        <i data-image="${element.imageUrl}" class="fa-solid fa-trash-can"></i>
    </div>`;
        document.querySelector(".modal-articles").innerHTML += domModal;
    });
    const modal = document.querySelector(".modal");

    const btn = document.querySelector(".modifier-btn");

    const btn2 = document.querySelector(".modifier-btn2");

    const span = document.getElementById("btn-close");

    const croix = document.querySelector(".croix");

    const body = document.querySelector("body");

    btn.addEventListener("click", function () {
        modal.style.display = "block";
        body.style.overflow = "hidden";
    });

    btn2.addEventListener("click", function () {
        modal.style.display = "block";
        body.style.overflow = "hidden";
    });

    span.addEventListener("click", function () {
        modal.style.display = "none";
        body.style.overflow = "visible";
    });

    // bouton de suppression des photos

    const trash = document
        .querySelector(".modal-articles")
        .querySelectorAll("i");

    const article = document.querySelectorAll(".article");

    trash.forEach(function (element) {
        element.addEventListener("click", function () {
            article.forEach(function (btn) {
                btn.style.display = "none";
            });
        });
    });

    // Bouton de suppression de la galerie

    const suprGallery = document
        .querySelector(".modal-btn")
        .querySelector("span");

    suprGallery.addEventListener("click", function () {
        article.forEach(function (e) {
            e.style.display = "none";
        });
    });

    // Bouton d'ajout Photo

    const ajoutPht = document
        .querySelector(".modal-btn")
        .querySelector("button");

    ajoutPht.addEventListener("click", function () {
        const title = `Ajout Photo`;
        document.querySelector(".modal-title").innerHTML = title;

        const undertitle = `   <form action="" method="post">
                <div class="modal-ajtpht">
                    <img src="https://media.admagazine.fr/photos/62c2ec61c47462b71586dc89/master/w_960,c_limit/52031931610_d533238048_o.jpg" id="image-upload">
                    <i id="img-modal" class="fa-regular fa-image"></i>
                    <input type="file" id="file" required>
                    <label class="ajtpht-btn" for="file">+ Ajouter photo</label>
                    <span>jpg, png : 4mo max</span>
                </div>
                <label for="titre">Titre</label>
                  <input type="text" name="titre" id="titre" required>
                  <label for="category">Categorie</label>
                <select name="category" id="category" required>
                    <option value="">--Choisissez une catégorie--</option>
                </select>
            </form>  `;

        croix.innerHTML += `<i id="arrow" class="fa-regular fa-arrow-left">
        </i><i id="btn-close2" class="fa-sharp fa-solid fa-xmark"></i>`;

        const btnValider = `<input type="submit" value="Valider" id="btn-valider" />`;

        document.querySelector(".modal-btn").innerHTML = ``;

        document.querySelector(".modal-btn").innerHTML = btnValider;

        document.querySelector(".modal-articles").innerHTML = ``;

        document.querySelector(".modal-articles").innerHTML = undertitle;

        const btnclose = document.querySelector("#btn-close2");

        btnclose.addEventListener("click", function () {
            modal.style.display = "none";
            body.style.overflow = "visible";
        });

        categoryshow.forEach((e) => {
            const option = `<option value="${e.name}">${e.name}</option>`;
            document.getElementById("category").innerHTML += option;
        });

        const arrow = document.getElementById("arrow");

        arrow.addEventListener("click", function () {
            return modalRender();
        });

        const imgUpload = document.querySelector("#image-upload");

        const imgModal = document.querySelector("#img-modal");

        const spanModal = document
            .querySelector(".modal-ajtpht")
            .querySelector("span");

        const btnAjoutPht = document.querySelector(".ajtpht-btn");

        btnAjoutPht.addEventListener("click", function () {
            imgUpload.style.display = "block";
            btnAjoutPht.style.display = "none";
            imgModal.style.display = "none";
            spanModal.style.display = "none";
        });
    });
}

// LOGIN

// Construction LogIn

function loginRender() {
    const logIn = `
            <header>
                <h1>Sophie Bluel <span>Architecte d'inteérieur</span></h1>
                <nav>
                    <ul>
                        <li>projets</li>
                        <li>contact</li>
                        <li class="strong">login</li>
                        <li>
                            <img
                                src="./assets/icons/instagram.png"
                                alt="Instagram"
                            />
                        </li>
                    </ul>
                </nav>
            </header>
    
            <!-- création division pour la mise en page -->
            <div class="margin"></div>
    
            <section id="contact">
                <h2>Log In</h2>
                <form
                    action="http://localhost:5678/api/users/login"
                    method="post"
                    id="myform"
                >
                    <label for="email">E-mail</label>
                    <input type="email" name="email" id="email" required />
                    <label for="password">Mot de passe</label>
                    <input type="password" name="password" id="password" required />
                    <br />
                    <span id="error"></span>
                    <input type="submit" value="Se connecter" id="btn-connexion" />
                    <a href="#">Mot de passe oublié?</a>
                </form>
            </section>
    
            <footer>
                <nav>
                    <ul>
                        <li>Mentions Légales</li>
                    </ul>
                </nav>
            </footer>`;

    document.querySelector("body").innerHTML = logIn;

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
        if (
            email.value == "sophie.bluel@test.tld" &&
            password.value == "S0phie"
        ) {
            e.preventDefault();
            location.href = "./index.html";
        }
    });
}

const btnLogin = document.getElementById("logIn");

btnLogin.addEventListener("click", function () {
    return loginRender();
});

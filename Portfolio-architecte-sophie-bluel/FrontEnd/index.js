const gallery = document.querySelector(".gallery");
const filtres = document.querySelectorAll(".filtre");
const header = document.querySelector(".header")
const headerNav = document.querySelector(".header-nav")
const login = document.getElementById("connexion");
const titreModify = document.querySelector(".titre-modify")
const imgModify = document.querySelector(".img-modify")
const containerFiltre = document.querySelector('.container-filtre');

function importWorks() {
    fetch("http://localhost:5678/api/works")
        .then(reponse => reponse.json())
        .then(data => {
            works = data;
            genererWorks(works);
            displayModal(works)      
        });
}
importWorks();

function genererWorks(works) {
    gallery.innerHTML = "";

    works.forEach((work) => {
        const figure = document.createElement("figure");
        gallery.appendChild(figure);
        figure.classList = work.category.name
        figure.setAttribute("data-id", work.id)

        const img = document.createElement("img");
        img.src = work.imageUrl;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = work.title;
        figure.appendChild(figcaption);
    });
}

function filtrerWorks() {
    filtres.forEach(filtre => {
        const valeurFiltre = filtre.textContent;

        filtre.addEventListener("click", () => {
            if (valeurFiltre === "Tous") { worksFiltre = works }
            else { worksFiltre = works.filter((work) => valeurFiltre === work.category.name)}
            genererWorks(worksFiltre);
        });
    }) 
}
filtrerWorks();

const boutons = document.querySelectorAll('.filtre');
let bouton = document.querySelector('.filtre');
bouton.classList.add('filtre_selected')

boutons.forEach((bouton) => {                                       // pour chaque boutons filtre, ecoute du clic avec fonction pour chaque bouton filtre
    bouton.addEventListener("click", () => {                        // enlever filtre selectionné pour tous et en meme temps selectionner le filtre target
      boutons.forEach((bouton) => {
        bouton.classList.remove('filtre_selected');
      });
      bouton.classList.add('filtre_selected');
    });
  });


// quand utilisateur se connecte

let token = localStorage.getItem("Token");
if (token) {
    const editingBanner = document.createElement("div")
    header.prepend(editingBanner)
    editingBanner.classList = "editing-banner"
    editingBanner.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
                               <p class="text-edition">Mode édition</p>
                               <button class="changement">publier les changements</button>`

    imgModify.innerHTML = `<img src="./assets/images/sophie-bluel.png" alt="">
			                <a class="modify-image">
				                <i class="fa-regular fa-pen-to-square"></i>
				                <p>modifier</p>
			                </a>`

   titreModify.innerHTML = `<h2>Mes Projets</h2>
                            <a href="#modal1" class="modify js-modal">
                                <i class="fa-regular fa-pen-to-square"></i>
                                modifier
                            </a>
                            <aside id="modal1" class="modal" aria-hidden="true" role="dialog" aria-labelledby="titlemodal" style="display:none;">
				                <div class="modal-wrapper js-modal-stop">
					                <button class="js-modal-close btn-xmark"><i class="fa-solid fa-xmark fa-xl"></i></button>
					                <h3 id="tiltemodal">Galerie photo</h3>
					                <div class="gallery-modal"></div>
					                <input type="submit" value="Ajouter une photo">
					                <a href="#" class="sup-gallery">Supprimer la gallerie</a>
				                </div>
			                </aside>`

    containerFiltre.style.display = "none";                 
    login.innerHTML = "logout"                         // login en logout pour deconnexion
    login.addEventListener("click", () => {            // ecouter clic sur login devenu logout pour enlever token et revenir sur page de connexion
        localStorage.removeItem("Token")
        window.location.replace("login.html")
    })
};

// apparation fenetre modale
let modal = null

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

// recuperation et supp des works pour la modale

const galleryModal = document.querySelector(".gallery-modal")

function displayModal(works) {
    let imageModalHtml = ""
    works.forEach((work) => {
        imageModalHtml += `
            <div class="img-gallery-modal">    
                <img src="${work.imageUrl}">
                <i class="fa-regular fa-trash-can" data-id="${work.id}"></i>
                <i class="fa-solid fa-arrows-up-down-left-right"></i>
                <p>éditer</p>
            </div>    
        `;
    })
    galleryModal.innerHTML = imageModalHtml;

    const suppWork = document.querySelectorAll(".fa-trash-can")

    let deleteRequest = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    suppWork.forEach(trashcan => {
        trashcan.addEventListener("click", () => {
            const workId = trashcan.getAttribute("data-id")
            fetch(`http://localhost:5678/api/works/${workId}`, deleteRequest)
                .then(reponse => {
                    if (reponse.ok) {
                        trashcan.parentElement.remove()
                        const deletefigure = document.querySelector(`figure[data-id="${workId}"]`)
                        deletefigure.remove()
                    }
                })
        })
        const suppresionGalleryModal = document.querySelector(".sup-gallery")
        suppresionGalleryModal.addEventListener("click", () => {
            const workId = trashcan.getAttribute("data-id")
            fetch(`http://localhost:5678/api/works/${workId}`, deleteRequest)
            .then(reponse => {
                if (reponse.ok) {
                    trashcan.parentElement.remove()
                    const deletefigure = document.querySelector(`figure[data-id="${workId}"]`)
                    deletefigure.remove()
                }
            })
        })
    })
}




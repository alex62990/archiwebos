const gallery = document.querySelector(".gallery")
const filtres = document.querySelectorAll(".filtre")
const header = document.querySelector(".header")
const headerNav = document.querySelector(".header-nav")
const login = document.getElementById("connexion")
const containerFiltre = document.querySelector('.container-filtre')
const modal = document.querySelector(".modal")
const modalWrapper = document.querySelector(".modal-wrapper")

function importWorks() {
    fetch("http://localhost:5678/api/works")
        .then(reponse => reponse.json())
        .then(data => {
            works = data;
            genererWorks(works)   
            displayModal(works)   
        });
}
importWorks()

function genererWorks(works) {
    gallery.innerHTML = ""

    works.forEach((work) => {
        const figure = document.createElement("figure")
        gallery.appendChild(figure)
        figure.classList = work.category.name
        figure.setAttribute("data-id", work.id)

        const img = document.createElement("img")
        img.src = work.imageUrl
        figure.appendChild(img)

        const figcaption = document.createElement("figcaption")
        figcaption.innerHTML = work.title
        figure.appendChild(figcaption)
    })
}

function filtrerWorks() {
    filtres.forEach(filtre => {
        const valeurFiltre = filtre.textContent

        filtre.addEventListener("click", () => {
            if (valeurFiltre === "Tous") { worksFiltre = works }
            else { worksFiltre = works.filter((work) => valeurFiltre === work.category.name)}
            genererWorks(worksFiltre)
        })
    }) 
}
filtrerWorks()

const boutons = document.querySelectorAll('.filtre')
let bouton = document.querySelector('.filtre')
bouton.classList.add('filtre_selected')

boutons.forEach((bouton) => {                                       // pour chaque boutons filtre, ecoute du clic avec fonction pour chaque bouton filtre
    bouton.addEventListener("click", () => {                        // enlever filtre selectionné pour tous et en meme temps selectionner le filtre target
      boutons.forEach((bouton) => {
        bouton.classList.remove('filtre_selected')
      })
      bouton.classList.add('filtre_selected')
    })
  })

// connexion utilisateur
const modalButton = document.querySelector(".modal-button")

  let token = localStorage.getItem("Token")
  if (token) {
      const editingBanner = document.createElement("div")
      header.prepend(editingBanner)
      editingBanner.classList = "editing-banner"
      editingBanner.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
                                 <p class="text-edition">Mode édition</p>
                                 <button class="changement">publier les changements</button>`
    containerFiltre.style.display = "none"               
    login.innerHTML = "logout" 
    modalButton.style.display = "flex"
    login.addEventListener("click", () => {            
        localStorage.removeItem("Token")
        window.location.replace("login.html")
    }) 
}

// modale utilisateur

document.querySelectorAll(".modal-button").forEach(btn => {
    btn.addEventListener("click", () => openModalCloseModal())
})

function openModalCloseModal() {
    modal.style.display = "flex"
    modalWrapper.innerHTML = `
                                <button class="js-modal-close btn-xmark"><i class="fa-solid fa-xmark fa-xl"></i></button>
                                <h3 id="tiltemodal">Galerie photo</h3>
                                <div class="gallery-modal"></div>
                                <button class="js-modal btn-modal2">Ajouter une photo</button>
                                <button class="sup-gallery">Supprimer la gallerie</button>
                            `
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)


    const modalClose = document.querySelector(".js-modal-close")
    modalClose.addEventListener("click", () => closeModal())

        function closeModal() {
            modal.style.display = "none"
            modal.removeEventListener('click', closeModal)
            modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
            modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
        }
        
        window.addEventListener('keydown', function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                closeModal(e)
            }
        })

                const btnModal2 = document.querySelector(".btn-modal2")
                btnModal2.addEventListener("click", () => openModal2())

                function openModal2() {
                    modalWrapper.innerHTML = `
                                    <button class="js-modal-return btn-arrow-left"><i class="fa-solid fa-arrow-left fa-xl"></i></button>
                                    <button class="js-modal-close btn-xmark"><i class="fa-solid fa-xmark fa-xl"></i></button>
                                    <h3 id="tiltemodal">Ajout Photo</h3>
                                    <div class="ajout-photo">
                                        <div class="photo">
                                            <div class="insertion-photo">
                                                <i class="fa-regular fa-image fa-5x"></i>
                                            </div>
                                            <a href="#" class="btn-ajout-photo">+ Ajouter photo</a>
                                            <p class="dim-photo">jpg, png : 4mo max</p>
                                        </div>
                                        <label for="titre">Titre</label>
			                            <input type="text" name="titre" id="titre">
                                        <label for="categories">Catégories</label>
                                        <select name="categorie" id="categories">
                                            <option value=""></option>
                                            <option value="Objets">Objets</option>
                                            <option value="Appartements">Appartements</option>
                                            <option value="Hotels & restaurants">Hotels & restaurants</option>
                                    </div>
                                    <input type="submit" value="Valider">

                    `
                    const modalClose = document.querySelector(".js-modal-close")
                    modalClose.addEventListener("click", () => closeModal())

                    const arrowLeft = document.querySelector(".js-modal-return")
                    arrowLeft.addEventListener("click", () => openModalCloseModal())
                }
                
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

// recup des travaux et suppression dans la modale
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
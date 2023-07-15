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
               
        });
}
importWorks()

function categoriesImport() {
    fetch("http://localhost:5678/api/categories")
        .then((res) => res.json())
        .then((data) => {
            categories = data
        })
}
categoriesImport()

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
        galleryModal.innerHTML = imageModalHtml
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
    displayModal(works)

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

                function generateCategorie() {
                    let optionsHTML = ""
                    categories.forEach(category => {
                        optionsHTML += `<option value="${category.id}">${category.name}</option>`
                    })
                    return optionsHTML
                }

                function openModal2() {
                    modalWrapper.innerHTML = `
                                    <button class="js-modal-return btn-arrow-left"><i class="fa-solid fa-arrow-left fa-xl"></i></button>
                                    <button class="js-modal-close btn-xmark"><i class="fa-solid fa-xmark fa-xl"></i></button>
                                    <h3 id="tiltemodal">Ajout Photo</h3>
                                    <form action="" method="post" class="ajout-photo" enctype="multipart/form-data">
                                        <div class="photo-form">
                                            <div class="insertion-photo">
                                                <i class="fa-regular fa-image fa-5x"></i>
                                            </div>
                                            <img src="" class="img-selected"
                                            <div>    
                                                <label for="photo" class="btn-ajout-photo">+ Ajouter photo</label>
                                                <input type="file" accept=".png, .jpg" id="photo" name="photo">
                                                <p class="dim-photo">jpg, png : 4mo max</p>
                                            </div>    
                                        </div>
                                        <div>    
                                            <div class="champs-modal">    
                                                <label for="titre">Titre</label>
                                                <input type="text" name="titre" id="titre">
                                            </div>
                                            <div class="champs-modal">    
                                                <label for="categories">Catégories</label>
                                                <select name="categorie" id="categories">
                                                    <option value=""></option>
                                                    ${generateCategorie()}
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                    <button class="btn-submit-valider">Valider</button>
                                    <p class="form-invalide-message">Tous les champs doivent être remplis !</p>
                                    <p class="form-valide-message">Informations enregistrées !</p>
                                    <p class="request-invalide-message">Erreur lors de l'envoi !</p>                                    
                    `
                    const modalClose = document.querySelector(".js-modal-close")
                    modalClose.addEventListener("click", () => closeModal())

                    const arrowLeft = document.querySelector(".js-modal-return")
                    arrowLeft.addEventListener("click", () => openModalCloseModal())

                    const photoInput = document.getElementById("photo")
                    const titleInput = document.getElementById("titre")
                    const selectInput = document.getElementById("categories")
                    const submitWorkButton = document.querySelector(".btn-submit-valider")
                    const selectedImage = document.querySelector(".img-selected")
                    const formInvalideMessage = document.querySelector(".form-invalide-message")
                    const valideFormMessage = document.querySelector(".form-valide-message")
                    const requestInvalideMessage = document.querySelector(".request-invalide-message")

                    photoInput.addEventListener("change", () => {
                    const file = photoInput.files[0]
                    const reader = new FileReader()

                    reader.onload = (e) => {
                        selectedImage.src = e.target.result
                        const addImgForm = document.querySelector(".photo-form");
                        const formElements = addImgForm.querySelectorAll(".photo-form > *")

                    formElements.forEach((element) => {
                        element.style.display = "none"
                        })
                    selectedImage.style.display = "flex"
                    }
                    reader.readAsDataURL(file)
                    })

                function createNewWork() {
                    submitWorkButton.addEventListener("click", () => {
                        if (photoInput.value === '' || titleInput.value === '' || selectInput.value === '') {
                            formInvalideMessage.style.display = "block";
                            return;
                        }
                        
                        let formData = new FormData()

                        formData.append("image", photoInput.files[0])
                        formData.append("title", titleInput.value)
                        formData.append("category", selectInput.value)

                        let addRequest = {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            body: formData
                        }
                        fetch("http://localhost:5678/api/works", addRequest)
                            .then(reponse => {
                                if( reponse.ok) {
                                    formInvalideMessage.style.display = "none"
                                    valideFormMessage.style.display = "block"
                                    submitWorkButton.classList.add("active")
                                } else {
                                    formInvalideMessage.style.display = "none"
                                    requestInvalideMessage.style.display = "block"
                                }
                            })
                    })
                }
                createNewWork()
                
                }
                
}
const stopPropagation = function (e) {
    e.stopPropagation()
}




    
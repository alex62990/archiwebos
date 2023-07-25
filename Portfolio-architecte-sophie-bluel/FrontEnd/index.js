const gallery = document.querySelector(".gallery")
const filtres = document.querySelectorAll(".filtre")
const header = document.querySelector(".header")
const headerNav = document.querySelector(".header-nav")
const login = document.getElementById("connexion")
const containerFiltre = document.querySelector('.container-filtre')
const modal = document.querySelector(".modal")
const modalWrapper = document.querySelector(".modal-wrapper")

// importation des travaux

const importWorks = () => {   
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                works = data
                genererWorks(works)   
            })
}
importWorks()

// importation des catégories des travaux

const categoriesImport = () => {
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then((data) => {
            categories = data
        })
}
categoriesImport()

// fonction pour générer les travaux à partir de l'api

const genererWorks = works => {
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

// fonction pour créer les filtres 
const filtrerWorks = () => {
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

// fonction pour faire le tri

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


// connexion utilisateur et affichage des boutons de modales

const modalButton = document.querySelector(".modal-button")
const modalButtonImg = document.querySelector(".modal-button-img")

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
    modalButtonImg.style.display = "flex"
    login.addEventListener("click", () => {            
        localStorage.removeItem("Token")
        window.location.replace("login.html")
    }) 
}

// modale utilisateur

document.querySelectorAll(".modal-button").forEach(btn => {
    btn.addEventListener("click", () => openModalCloseModal())
})

const openModalCloseModal = () => {
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
    const displayModal = () => {
        let imageModalHtml = ""
        works.forEach((work) => {
            imageModalHtml += `
                <div class="img-gallery-modal">    
                    <img src="${work.imageUrl}">
                    <i class="fa-regular fa-trash-can" data-id="${work.id}"></i>
                    <i class="fa-solid fa-arrows-up-down-left-right"></i>
                    <p>éditer</p>
                </div>    
            `
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
                try {
                    fetch(`http://localhost:5678/api/works/${workId}`, deleteRequest)
                        .then(response => {
                            if (response.ok) {
                                trashcan.parentElement.remove()
                                const index = works.findIndex(work => work.id == workId)
                                works.splice(index, 1)
                                refreshProjects(works)
                                }
                            
                            if (response.status === 401) {
                                console.error("Unauthorized", response.statusText)
                            }

                            if (response.status === 500) {
                                console.error("Unexpected Behaviour", response.statusText)
                            }
                        })
                } catch (error) {
                    console.log(error)
                }              
            })

            const suppresionGalleryModal = document.querySelector(".sup-gallery")
            suppresionGalleryModal.addEventListener("click", () => {
                const workId = trashcan.getAttribute("data-id")
                try {
                    fetch(`http://localhost:5678/api/works/${workId}`, deleteRequest)
                        .then(response => {
                            if (response.ok) {
                                trashcan.parentElement.remove()
                                const index = works.findIndex(work => work.id == workId)
                                works.splice(index, 1)
                                refreshProjects(works)
                                }

                            if (response.status === 401) {
                                console.error("Unauthorized", response.statusText)
                            }

                            if (response.status === 500) {
                                console.error("Unexpected Behaviour", response.statusText)
                            }
                        })

                } catch (error) {
                    console.log(error)
                }              
            })
        })
    }
    displayModal()

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

                const generateCategorie = () => {
                    let optionsHTML = ""
                    categories.forEach(category => {
                        optionsHTML += `<option value="${category.id}">${category.name}</option>`
                    })
                    return optionsHTML
                }

                const openModal2 = () => {
                    modalWrapper.innerHTML = `
                                    <button class="js-modal-return btn-arrow-left"><i class="fa-solid fa-arrow-left fa-xl"></i></button>
                                    <button class="js-modal-close btn-xmark"><i class="fa-solid fa-xmark fa-xl"></i></button>
                                    <h3 id="tiltemodal">Ajout Photo</h3>
                                    <form id="formEnvoyer" action="" method="post" class="ajout-photo" enctype="multipart/form-data">
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
                                        <button type="submit" class="btn-submit-valider">Valider</button>
                                    </form>
                                    
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
                    const submitWorkButton = document.getElementById("formEnvoyer")
                    const btnEnvoyerForm = document.querySelector(".btn-submit-valider")
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

                    const createNewWork = () => {
                        submitWorkButton.addEventListener("submit", async (event) => {
                            event.preventDefault()
                            const max = 4 * 1024 * 1024
                            if (photoInput.files[0] === '' || titleInput.value === '' || selectInput.value === '') {
                                formInvalideMessage.style.display = "block"
                                return 
                                alert("taille de l'image trop importante")
                            } else if (photoInput.files[0].size > max) {
                            } else {
                            
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
                                    .then(async response => {
                                        console.log(response.status)
                                        if( response.status === 201) {
                                            formInvalideMessage.style.display = "none"
                                            valideFormMessage.style.display = "block"
                                            btnEnvoyerForm.classList.add("active")
                                            
                                            const reader = new FileReader()
                                            reader.onload =  e => {
                                                const dataURL = e.target.result
                                                const newImage = document.createElement("img")
                                                newImage.src = dataURL
                                                
                                                const newTitle = document.createElement("figcaption")
                                                newTitle.textContent = titleInput.value
                                                
                                                const newFigure = document.createElement("figure")
                                                newFigure.appendChild(newImage)
                                                newFigure.appendChild(newTitle)
                                                
                                                gallery.appendChild(newFigure) 
                                                
                                            }

                                            reader.readAsDataURL(photoInput.files[0])

                                            let newObjectToAdd =  await response.json()

                                            works.push(newObjectToAdd)

                                        } else {
                                            formInvalideMessage.style.display = "none"
                                            requestInvalideMessage.style.display = "block"
                                        }

                                        if (response.status === 400) {
                                            console.error("Bad Request", response.statusText)
                                        }

                                        if (response.status === 401) {
                                            console.error("Unauthorized", response.statusText)
                                        }

                                        if (response.status === 500) {
                                            console.error("Unexpected Error", response.statusText)
                                        }
                                    })
                            }
                        })
                    }
                    createNewWork()
                }
              
}

// fonction pour refresh les projets

const refreshProjects = works => {
    const containerGallery = document.querySelector(".gallery")
    containerGallery.innerHTML = ""

    // boucle pour creer et montrer les works dans la gallery
    for (const work of works) {
        const projectHTML = `<figure><img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption></figure>`
        containerGallery.insertAdjacentHTML("beforeend", projectHTML)
    }
}

const stopPropagation = e => {
    e.stopPropagation()
}




    
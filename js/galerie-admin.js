// Script pour la gestion de la galerie par l'administrateur

let currentPhotoData = null;

// Initialisation des événements une fois le DOM chargé
document.addEventListener("DOMContentLoaded", function () {
  initGalleryAdmin();
});

function initGalleryAdmin() {
  // Gestion des boutons d'édition
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const photoId = this.getAttribute("data-photo-id");
      const photoTitle = this.getAttribute("data-photo-title");
      const photoSrc = this.getAttribute("data-photo-src");

      openEditModal(photoId, photoTitle, photoSrc);
    });
  });

  // Gestion des boutons de suppression
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const photoId = this.getAttribute("data-photo-id");
      const photoTitle = this.getAttribute("data-photo-title");
      const photoSrc = this.getAttribute("data-photo-src");

      openDeleteModal(photoId, photoTitle, photoSrc);
    });
  });

  // Gestion du bouton "Ajouter une photo"
  const addButton = document.querySelector(
    'button[data-bs-target="#EditionPhotoModal"]'
  );
  if (addButton && !addButton.classList.contains("btn-edit")) {
    addButton.addEventListener("click", function () {
      openEditModal(null, "", ""); // Mode ajout
    });
  }

  // Gestion du bouton de sauvegarde dans la modale d'édition
  const saveButton = document.querySelector("#EditionPhotoModal .btn-primary");
  if (saveButton) {
    saveButton.addEventListener("click", savePhoto);
  }

  // Gestion du bouton de suppression dans la modale de suppression
  const confirmDeleteButton = document.querySelector(
    "#DeletePhotoModal .btn-danger"
  );
  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener("click", deletePhoto);
  }
}

function openEditModal(photoId, photoTitle, photoSrc) {
  currentPhotoData = {
    id: photoId,
    title: photoTitle,
    src: photoSrc,
  };

  // Remplir les champs du formulaire
  const titleInput = document.getElementById("NamePhotoInput");
  const imageInput = document.getElementById("ImageInput");

  if (titleInput) {
    titleInput.value = photoTitle || "";
  }

  // Réinitialiser le champ file
  if (imageInput) {
    imageInput.value = "";
  }

  // Changer le titre de la modale
  const modalTitle = document.getElementById("EditionPhotoModalLabel");
  if (modalTitle) {
    modalTitle.textContent = photoId
      ? "Modifier la photo"
      : "Ajouter une photo";
  }

  // Ouvrir la modale
  const modal = new bootstrap.Modal(
    document.getElementById("EditionPhotoModal")
  );
  modal.show();
}

function openDeleteModal(photoId, photoTitle, photoSrc) {
  currentPhotoData = {
    id: photoId,
    title: photoTitle,
    src: photoSrc,
  };

  // Mettre à jour le contenu de la modale de suppression
  const modalBody = document.querySelector("#DeletePhotoModal .modal-body");
  if (modalBody) {
    modalBody.innerHTML = `
            <div class="mb-3">
                <p><strong>Titre:</strong> ${photoTitle}</p>
                <img src="${photoSrc}" class="w-100 rounded" alt="${photoTitle}">
            </div>
            <div class="text-center">
                <button type="button" class="btn btn-danger" onclick="deletePhoto()">Supprimer</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            </div>
        `;
  }

  // Ouvrir la modale
  const modal = new bootstrap.Modal(
    document.getElementById("DeletePhotoModal")
  );
  modal.show();
}

function savePhoto() {
  const titleInput = document.getElementById("NamePhotoInput");
  const imageInput = document.getElementById("ImageInput");

  if (!titleInput) return;

  const newTitle = titleInput.value.trim();
  const newImageFile = imageInput?.files[0];

  if (!newTitle) {
    alert("Veuillez saisir un titre pour la photo.");
    return;
  }

  // Simulation de la sauvegarde (à remplacer par un appel API)
  if (currentPhotoData && currentPhotoData.id) {
    // Mode modification
    console.log("Modification de la photo:", {
      id: currentPhotoData.id,
      title: newTitle,
      file: newImageFile,
    });

    // Mettre à jour l'affichage
    updatePhotoDisplay(currentPhotoData.id, newTitle, newImageFile);
    alert("Photo modifiée avec succès !");
  } else {
    // Mode ajout
    console.log("Ajout d'une nouvelle photo:", {
      title: newTitle,
      file: newImageFile,
    });

    // Ajouter la nouvelle photo à la galerie
    addNewPhotoToGallery(newTitle, newImageFile);
    alert("Photo ajoutée avec succès !");
  }

  // Fermer la modale
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("EditionPhotoModal")
  );
  modal.hide();
}

function deletePhoto() {
  if (!currentPhotoData || !currentPhotoData.id) return;

  // Simulation de la suppression (à remplacer par un appel API)
  console.log("Suppression de la photo:", currentPhotoData);

  // Supprimer l'élément du DOM
  const photoElement = document
    .querySelector(`[data-photo-id="${currentPhotoData.id}"]`)
    .closest(".col");
  if (photoElement) {
    photoElement.remove();
    alert("Photo supprimée avec succès !");
  }

  // Fermer la modale
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("DeletePhotoModal")
  );
  modal.hide();
}

function updatePhotoDisplay(photoId, newTitle, newImageFile) {
  const photoContainer = document
    .querySelector(`[data-photo-id="${photoId}"]`)
    .closest(".col");
  if (!photoContainer) return;

  // Mettre à jour le titre
  const titleElement = photoContainer.querySelector(".titre-image");
  if (titleElement) {
    titleElement.textContent = newTitle;
  }

  // Mettre à jour les attributs des boutons
  const editButton = photoContainer.querySelector(".btn-edit");
  const deleteButton = photoContainer.querySelector(".btn-delete");

  if (editButton) {
    editButton.setAttribute("data-photo-title", newTitle);
  }
  if (deleteButton) {
    deleteButton.setAttribute("data-photo-title", newTitle);
  }

  // Si un nouveau fichier image est fourni, simuler la mise à jour
  if (newImageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgElement = photoContainer.querySelector("img");
      if (imgElement) {
        imgElement.src = e.target.result;
      }
    };
    reader.readAsDataURL(newImageFile);
  }
}

function addNewPhotoToGallery(title, imageFile) {
  if (!imageFile) {
    alert("Veuillez sélectionner une image.");
    return;
  }

  const galleryContainer = document.querySelector(
    ".row.row-cols-2.row-cols-lg-3"
  );
  if (!galleryContainer) return;

  // Générer un nouvel ID
  const newPhotoId = Date.now();

  // Créer le nouvel élément
  const newPhotoElement = document.createElement("div");
  newPhotoElement.className = "col p-3";

  const reader = new FileReader();
  reader.onload = function (e) {
    newPhotoElement.innerHTML = `
            <div class="image-card text-white">
                <img class="w-100 rounded" src="${e.target.result}" alt="${title}">
                <p class="titre-image">${title}</p>
                <div class="action-image-buttons" data-show="admin">
                    <button type="button" class="btn btn-outline-light btn-edit" data-photo-id="${newPhotoId}" data-photo-title="${title}" data-photo-src="${e.target.result}">
                        ✏️ Modifier</button>
                    <button type="button" class="btn btn-outline-light btn-delete" data-photo-id="${newPhotoId}" data-photo-title="${title}" data-photo-src="${e.target.result}">
                        🗑️ Supprimer</button>
                </div>
            </div>
        `;

    // Insérer avant le bouton "Réserver"
    const reserveButton =
      galleryContainer.parentNode.querySelector(".text-center a");
    galleryContainer.appendChild(newPhotoElement);

    // Réattacher les événements pour les nouveaux boutons
    initGalleryAdmin();

    // Appliquer les règles d'affichage pour les admin
    if (typeof showAndHideElementsForRoles === "function") {
      showAndHideElementsForRoles();
    }
  };
  reader.readAsDataURL(imageFile);
}

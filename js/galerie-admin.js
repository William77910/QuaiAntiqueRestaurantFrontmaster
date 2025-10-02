// Script pour la gestion de la galerie par l'administrateur
secureLog.debug("🖼️ Script galerie-admin.js chargé");

let currentPhotoData = null;

// Initialisation des événements une fois le DOM chargé
document.addEventListener("DOMContentLoaded", function () {
  secureLog.debug("🔧 Initialisation de la galerie admin");
  initGalleryAdminPage(); // ✅ CORRECTION: Appeler la fonction wrapper
});

// Fonction globale pour le router
window.initGalleryAdmin = initGalleryAdminPage; // ✅ CORRECTION: Pointer vers la bonne fonction

function initGalleryAdminCore() {
  secureLog.debug("🔄 initGalleryAdmin appelé");

  // Éviter les doublons d'initialisation
  if (window.galleryAdminInitialized) {
    secureLog.debug("⚠️ Galerie admin déjà initialisée, ignoré");
    return;
  }
  window.galleryAdminInitialized = true;

  // Gestion des boutons d'édition
  const editButtons = document.querySelectorAll(".btn-edit");
  secureLog.debug("📝 Boutons modifier trouvés:", editButtons.length);

  editButtons.forEach((button) => {
    // Vérifier si l'event listener n'est pas déjà attaché
    if (!button.hasAttribute("data-listener-attached")) {
      button.setAttribute("data-listener-attached", "true");
      button.addEventListener("click", function (e) {
        e.preventDefault();
        secureLog.debug("✏️ Clic sur bouton modifier");

        const photoId = this.getAttribute("data-photo-id");
        const photoTitle = this.getAttribute("data-photo-title");
        const photoSrc = this.getAttribute("data-photo-src");

        secureLog.debug("📊 Données photo:", { photoId, photoTitle, photoSrc });
        openEditModal(photoId, photoTitle, photoSrc);
      });
    }
  });

  // Gestion des boutons de suppression
  const deleteButtons = document.querySelectorAll(".btn-delete");
  secureLog.debug("🗑️ Boutons supprimer trouvés:", deleteButtons.length);

  deleteButtons.forEach((button) => {
    // Vérifier si l'event listener n'est pas déjà attaché
    if (!button.hasAttribute("data-listener-attached")) {
      button.setAttribute("data-listener-attached", "true");
      button.addEventListener("click", function (e) {
        e.preventDefault();
        secureLog.debug("🗑️ Clic sur bouton supprimer");

        const photoId = this.getAttribute("data-photo-id");
        const photoTitle = this.getAttribute("data-photo-title");
        const photoSrc = this.getAttribute("data-photo-src");

        secureLog.debug("📊 Données photo à supprimer:", {
          photoId,
          photoTitle,
          photoSrc,
        });
        openDeleteModal(photoId, photoTitle, photoSrc);
      });
    }
  });

  // Gestion du bouton "Ajouter une photo"
  const addButton = document.querySelector(
    'button[data-bs-target="#EditionPhotoModal"]'
  );
  if (
    addButton &&
    !addButton.classList.contains("btn-edit") &&
    !addButton.hasAttribute("data-listener-attached")
  ) {
    addButton.setAttribute("data-listener-attached", "true");
    addButton.addEventListener("click", function () {
      openEditModal(null, "", ""); // Mode ajout
    });
  }

  // Gestion du bouton de sauvegarde dans la modale d'édition
  const saveButton = document.querySelector("#EditionPhotoModal .btn-primary");
  if (saveButton && !saveButton.hasAttribute("data-listener-attached")) {
    saveButton.setAttribute("data-listener-attached", "true");
    saveButton.addEventListener("click", savePhoto);
  }

  // Gestion du bouton de suppression dans la modale de suppression
  const confirmDeleteButton = document.querySelector(
    "#DeletePhotoModal .btn-danger"
  );
  if (
    confirmDeleteButton &&
    !confirmDeleteButton.hasAttribute("data-listener-attached")
  ) {
    confirmDeleteButton.setAttribute("data-listener-attached", "true");
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
  secureLog.debug("🔓 Ouverture de la modale d'édition");
  const modalElement = document.getElementById("EditionPhotoModal");

  // Réutiliser l'instance existante ou en créer une nouvelle
  let modal = bootstrap.Modal.getInstance(modalElement);
  if (!modal) {
    modal = new bootstrap.Modal(modalElement);
  }

  modal.show();
  secureLog.debug("✅ Modale affichée");
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
  const modalElement = document.getElementById("DeletePhotoModal");

  // Réutiliser l'instance existante ou en créer une nouvelle
  let modal = bootstrap.Modal.getInstance(modalElement);
  if (!modal) {
    modal = new bootstrap.Modal(modalElement);
  }

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
  if (currentPhotoData?.id) {
    // Mode modification
    secureLog.debug("Modification de la photo:", {
      id: currentPhotoData.id,
      title: newTitle,
      file: newImageFile,
    });

    // Mettre à jour l'affichage
    updatePhotoDisplay(currentPhotoData.id, newTitle, newImageFile);
    alert("Photo modifiée avec succès !");
  } else {
    // Mode ajout
    secureLog.debug("Ajout d'une nouvelle photo:", {
      title: newTitle,
      file: newImageFile,
    });

    // Ajouter la nouvelle photo à la galerie
    addNewPhotoToGallery(newTitle, newImageFile);
    alert("Photo ajoutée avec succès !");
  }

  // Fermer la modale
  secureLog.debug("🔒 Fermeture de la modale d'édition");
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("EditionPhotoModal")
  );
  if (modal) {
    modal.hide();
    secureLog.debug("✅ Modale fermée");
  } else {
    secureLog.debug("⚠️ Instance de modale non trouvée");
  }
}

function deletePhoto() {
  if (!currentPhotoData?.id) return;

  // Simulation de la suppression (à remplacer par un appel API)
  secureLog.debug("Suppression de la photo ID:", currentPhotoData.id);

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
    const imageData = e.target?.result || "";
    newPhotoElement.innerHTML = `
            <div class="image-card text-white">
                <img class="w-100 rounded" src="${imageData}" alt="${title}">
                <p class="titre-image">${title}</p>
                <div class="action-image-buttons" data-show="admin">
                    <button type="button" class="btn btn-outline-light btn-edit" data-photo-id="${newPhotoId}" data-photo-title="${title}" data-photo-src="${imageData}">
                        ✏️ Modifier</button>
                    <button type="button" class="btn btn-outline-light btn-delete" data-photo-id="${newPhotoId}" data-photo-title="${title}" data-photo-src="${imageData}">
                        🗑️ Supprimer</button>
                </div>
            </div>
        `;

    // Insérer la nouvelle photo dans la galerie
    galleryContainer.appendChild(newPhotoElement);

    // Attacher les événements uniquement aux nouveaux boutons
    attachEventListenersToNewPhoto(newPhotoElement);

    // Appliquer les règles d'affichage pour les admin
    if (typeof showAndHideElementsForRoles === "function") {
      showAndHideElementsForRoles();
    }
  };
  reader.readAsDataURL(imageFile);
}

// Fonction pour attacher les événements uniquement aux nouveaux éléments
function attachEventListenersToNewPhoto(photoElement) {
  const editButton = photoElement.querySelector(".btn-edit");
  const deleteButton = photoElement.querySelector(".btn-delete");

  if (editButton) {
    editButton.addEventListener("click", function (e) {
      e.preventDefault();
      secureLog.debug("✏️ Clic sur bouton modifier (nouveau)");

      const photoId = this.getAttribute("data-photo-id");
      const photoTitle = this.getAttribute("data-photo-title");
      const photoSrc = this.getAttribute("data-photo-src");

      secureLog.debug("📊 Données photo:", { photoId, photoTitle, photoSrc });
      openEditModal(photoId, photoTitle, photoSrc);
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", function (e) {
      e.preventDefault();
      secureLog.debug("🗑️ Clic sur bouton supprimer (nouveau)");

      const photoId = this.getAttribute("data-photo-id");
      const photoTitle = this.getAttribute("data-photo-title");
      const photoSrc = this.getAttribute("data-photo-src");

      secureLog.debug("📊 Données photo:", { photoId, photoTitle, photoSrc });
      openDeleteModal(photoId, photoTitle, photoSrc);
    });
  }
}

// 🚀 INITIALISATION ROBUSTE POUR LE ROUTER
function initGalleryAdminPage() {
  secureLog.debug("🔧 initGalleryAdminPage appelé");

  // Réinitialiser le flag pour permettre une nouvelle initialisation
  window.galleryAdminInitialized = false;

  // Supprimer les anciens attributs de listeners pour permettre la réinitialisation
  document
    .querySelectorAll(
      '.btn-edit, .btn-delete, #EditionPhotoModal .btn-primary, #DeletePhotoModal .btn-danger, button[data-bs-target="#EditionPhotoModal"]'
    )
    .forEach((btn) => {
      btn.removeAttribute("data-listener-attached");
    });

  // Vérifier si nous sommes sur la page galerie
  const isGalleryPage =
    window.location.pathname === "/galerie" ||
    document.body.innerHTML.includes("Galerie") ||
    document.querySelector(".image-card");

  if (isGalleryPage) {
    secureLog.debug("✅ Page galerie détectée, initialisation...");
    initGalleryAdminCore(); // ✅ CORRECTION: Appeler la vraie fonction d'initialisation
  } else {
    secureLog.debug("❌ Pas sur la page galerie");
  }
}

// Fonction globale pour le router (remplace la fonction existante)
window.initGalleryAdmin = initGalleryAdminPage;

// Initialisation robuste avec fallbacks
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGalleryAdminPage);
} else {
  secureLog.debug("🔄 DOM déjà chargé pour galerie, initialisation immédiate");
  setTimeout(initGalleryAdminPage, 100);
}

// Gestion administrative de la carte du restaurant

let sectionCounter = 4; // Compteur pour les nouveaux IDs (on a déjà 3 sections)

// Initialisation des fonctionnalités d'administration
function initCarteAdmin() {
  console.log("Initialisation de la gestion administrative de la carte...");

  // Gestionnaires d'événements pour les boutons d'ajout
  const btnAddSection = document.getElementById("btn-add-section");
  if (btnAddSection) {
    btnAddSection.addEventListener("click", openAddSectionModal);
  }

  // Gestionnaires d'événements pour les boutons de modification
  const editButtons = document.querySelectorAll(".btn-edit-section");
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section-id");
      const sectionTitle = this.getAttribute("data-section-title");
      const sectionDescription = this.getAttribute("data-section-description");
      const sectionImage = this.getAttribute("data-section-image");
      openEditSectionModal(
        sectionId,
        sectionTitle,
        sectionDescription,
        sectionImage
      );
    });
  });

  // Gestionnaires d'événements pour les boutons de suppression
  const deleteButtons = document.querySelectorAll(".btn-delete-section");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section-id");
      const sectionTitle = this.getAttribute("data-section-title");
      openDeleteSectionModal(sectionId, sectionTitle);
    });
  });

  // Gestionnaire pour l'aperçu d'image
  const imageInput = document.getElementById("sectionImageFile");
  if (imageInput) {
    imageInput.addEventListener("change", previewSectionImage);
  }

  // Gestionnaire pour la sauvegarde
  const saveSectionBtn = document.getElementById("saveSectionBtn");
  if (saveSectionBtn) {
    saveSectionBtn.addEventListener("click", saveSection);
  }

  // Gestionnaire pour la confirmation de suppression
  const confirmDeleteBtn = document.getElementById("confirmDeleteSectionBtn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", confirmDeleteSection);
  }
}

// Ouvrir la modal d'ajout de section
function openAddSectionModal() {
  console.log("Ouverture de la modal d'ajout de section");

  // Réinitialiser le formulaire
  document.getElementById("sectionForm").reset();
  document.getElementById("sectionId").value = "";
  document.getElementById("sectionImagePreview").classList.add("d-none");

  // Changer le titre de la modal
  document.getElementById("sectionModalLabel").textContent =
    "Ajouter une section";

  // Valeurs par défaut
  document.getElementById("sectionTextColor").value = "text-dark";
  document.getElementById("sectionImageLeft").checked = false;

  // Ouvrir la modal
  const modal = new bootstrap.Modal(document.getElementById("sectionModal"));
  modal.show();
}

// Ouvrir la modal de modification de section
function openEditSectionModal(sectionId, title, description, imageSrc) {
  console.log(
    "Ouverture de la modal de modification pour la section:",
    sectionId
  );

  // Remplir le formulaire avec les données existantes
  document.getElementById("sectionId").value = sectionId;
  document.getElementById("sectionTitle").value = title;
  document.getElementById("sectionDescription").value = description;

  // Aperçu de l'image existante
  if (imageSrc) {
    const preview = document.getElementById("sectionImagePreview");
    preview.src = imageSrc;
    preview.classList.remove("d-none");
  }

  // Détecter les paramètres de la section existante
  const sectionElement = document.querySelector(
    `[data-section-id="${sectionId}"]`
  );
  if (sectionElement) {
    // Détecter la couleur de fond
    const backgroundClasses = [
      "bg-primary",
      "bg-black",
      "bg-secondary",
      "bg-success",
      "bg-warning",
      "bg-danger",
    ];
    let backgroundClass = "";
    backgroundClasses.forEach((cls) => {
      if (sectionElement.classList.contains(cls)) {
        backgroundClass = cls;
      }
    });
    document.getElementById("sectionBackground").value = backgroundClass;

    // Détecter la couleur du texte
    const textClasses = ["text-dark", "text-white", "text-primary"];
    let textClass = "text-dark";
    textClasses.forEach((cls) => {
      if (sectionElement.classList.contains(cls)) {
        textClass = cls;
      }
    });
    document.getElementById("sectionTextColor").value = textClass;

    // Détecter la position de l'image (vérifier l'ordre des colonnes)
    const container = sectionElement.querySelector(".row");
    const firstCol = container.querySelector(".col");
    const hasImageFirst = firstCol.querySelector("img") !== null;
    document.getElementById("sectionImageLeft").checked = hasImageFirst;
  }

  // Changer le titre de la modal
  document.getElementById("sectionModalLabel").textContent =
    "Modifier la section";

  // Ouvrir la modal
  const modal = new bootstrap.Modal(document.getElementById("sectionModal"));
  modal.show();
}

// Ouvrir la modal de suppression de section
function openDeleteSectionModal(sectionId, title) {
  console.log(
    "Ouverture de la modal de suppression pour la section:",
    sectionId
  );

  document.getElementById("deleteSectionTitle").textContent = title;
  document
    .getElementById("confirmDeleteSectionBtn")
    .setAttribute("data-section-id", sectionId);

  const modal = new bootstrap.Modal(
    document.getElementById("deleteSectionModal")
  );
  modal.show();
}

// Aperçu de l'image sélectionnée
function previewSectionImage() {
  const file = this.files[0];
  const preview = document.getElementById("sectionImagePreview");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
  } else {
    preview.classList.add("d-none");
  }
}

// Sauvegarder une section (ajout ou modification)
function saveSection() {
  console.log("Sauvegarde de la section...");

  const sectionId = document.getElementById("sectionId").value;
  const title = document.getElementById("sectionTitle").value.trim();
  const description = document
    .getElementById("sectionDescription")
    .value.trim();
  const backgroundClass = document.getElementById("sectionBackground").value;
  const textClass = document.getElementById("sectionTextColor").value;
  const imageLeft = document.getElementById("sectionImageLeft").checked;
  const imageFile = document.getElementById("sectionImageFile").files[0];

  // Validation
  if (!title || !description) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  if (sectionId) {
    // Modification d'une section existante
    updateSection(
      sectionId,
      title,
      description,
      backgroundClass,
      textClass,
      imageLeft,
      imageFile
    );
  } else {
    // Ajout d'une nouvelle section
    addNewSection(
      title,
      description,
      backgroundClass,
      textClass,
      imageLeft,
      imageFile
    );
  }

  // Fermer la modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("sectionModal")
  );
  modal.hide();
}

// Ajouter une nouvelle section
function addNewSection(
  title,
  description,
  backgroundClass,
  textClass,
  imageLeft,
  imageFile
) {
  console.log("Ajout d'une nouvelle section:", title);

  const newSectionId = sectionCounter++;
  let imageSrc = "../images/food.jpg"; // Image par défaut

  // Si une image est fournie, la traiter
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageSrc = e.target.result;
      createSectionHTML(
        newSectionId,
        title,
        description,
        backgroundClass,
        textClass,
        imageLeft,
        imageSrc
      );
    };
    reader.readAsDataURL(imageFile);
  } else {
    createSectionHTML(
      newSectionId,
      title,
      description,
      backgroundClass,
      textClass,
      imageLeft,
      imageSrc
    );
  }
}

// Créer le HTML pour une nouvelle section
function createSectionHTML(
  sectionId,
  title,
  description,
  backgroundClass,
  textClass,
  imageLeft,
  imageSrc
) {
  const sectionContainer = document.querySelector("section");

  // Déterminer les classes CSS
  const articleClasses = ["menu-section"];
  if (backgroundClass) articleClasses.push(backgroundClass);
  if (textClass) articleClasses.push(textClass);

  // Déterminer la couleur des boutons d'administration
  let buttonClass = "btn-outline-primary";
  if (backgroundClass === "bg-black" || textClass === "text-white") {
    buttonClass = "btn-outline-light";
  }

  // Créer l'HTML de la section
  const sectionHTML = `
    <article class="${articleClasses.join(" ")}" data-section-id="${sectionId}">
        <div class="container p-4 position-relative">
            <!-- Boutons d'administration -->
            <div class="admin-controls position-absolute" style="top: 10px; right: 10px;" data-show="admin">
                <button type="button" class="btn btn-sm ${buttonClass} btn-edit-section" 
                        data-section-id="${sectionId}" 
                        data-section-title="${title}"
                        data-section-description="${description}"
                        data-section-image="${imageSrc}">
                    ✏️ Modifier
                </button>
                <button type="button" class="btn btn-sm ${buttonClass} btn-delete-section" 
                        data-section-id="${sectionId}" 
                        data-section-title="${title}">
                    🗑️ Supprimer
                </button>
            </div>
            
            <h2 class="text-center section-title" style="color: ${
              textClass === "text-white"
                ? "white"
                : textClass === "text-primary"
                ? "var(--bs-primary)"
                : "inherit"
            }">${title}</h2>
            <div class="row row-cols-2 align-items-center">
                ${
                  imageLeft
                    ? `
                <div class="col">
                    <img class="w-100 rounded section-image" src="${imageSrc}" alt="${title}" />
                </div>
                <div class="col">
                    <p class="text-justify section-description">${description}</p>
                </div>
                `
                    : `
                <div class="col">
                    <p class="text-justify section-description">${description}</p>
                </div>
                <div class="col">
                    <img class="w-100 rounded section-image" src="${imageSrc}" alt="${title}" />
                </div>
                `
                }
            </div>
        </div>
    </article>`;

  // Insérer la nouvelle section avant le bouton d'ajout
  const addButtonContainer = document.querySelector('[data-show="admin"]');
  const addButtonParent = addButtonContainer.parentElement;
  addButtonParent.insertAdjacentHTML("beforebegin", sectionHTML);

  // Réattacher les gestionnaires d'événements pour la nouvelle section
  attachSectionEventListeners(sectionId);

  // Mettre à jour l'affichage selon le rôle
  if (typeof showAndHideElementsForRoles === "function") {
    showAndHideElementsForRoles();
  }

  alert("Nouvelle section ajoutée avec succès !");
}

// Mettre à jour une section existante
function updateSection(
  sectionId,
  title,
  description,
  backgroundClass,
  textClass,
  imageLeft,
  imageFile
) {
  console.log("Mise à jour de la section:", sectionId);

  const sectionElement = document.querySelector(
    `[data-section-id="${sectionId}"]`
  );
  if (!sectionElement) {
    alert("Section introuvable !");
    return;
  }

  // Mettre à jour les classes CSS
  const articleClasses = ["menu-section"];
  if (backgroundClass) articleClasses.push(backgroundClass);
  if (textClass) articleClasses.push(textClass);

  // Supprimer les anciennes classes de couleur
  const oldClasses = [
    "bg-primary",
    "bg-black",
    "bg-secondary",
    "bg-success",
    "bg-warning",
    "bg-danger",
    "text-dark",
    "text-white",
    "text-primary",
  ];
  oldClasses.forEach((cls) => sectionElement.classList.remove(cls));

  // Ajouter les nouvelles classes
  articleClasses.forEach((cls) => {
    if (cls !== "menu-section") {
      sectionElement.classList.add(cls);
    }
  });

  // Mettre à jour le titre
  const titleElement = sectionElement.querySelector(".section-title");
  titleElement.textContent = title;
  titleElement.style.color =
    textClass === "text-white"
      ? "white"
      : textClass === "text-primary"
      ? "var(--bs-primary)"
      : "inherit";

  // Mettre à jour la description
  const descriptionElement = sectionElement.querySelector(
    ".section-description"
  );
  descriptionElement.textContent = description;

  // Mettre à jour l'image si fournie
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageElement = sectionElement.querySelector(".section-image");
      imageElement.src = e.target.result;
      imageElement.alt = title;

      // Mettre à jour les data attributes des boutons
      updateSectionButtonsData(sectionId, title, description, e.target.result);
    };
    reader.readAsDataURL(imageFile);
  } else {
    // Juste mettre à jour les data attributes
    const currentImage = sectionElement.querySelector(".section-image").src;
    updateSectionButtonsData(sectionId, title, description, currentImage);
  }

  // Réorganiser les colonnes si nécessaire
  const rowElement = sectionElement.querySelector(".row");
  const cols = rowElement.querySelectorAll(".col");
  const imageCol = Array.from(cols).find((col) => col.querySelector("img"));
  const textCol = Array.from(cols).find((col) => col.querySelector("p"));

  if (imageLeft && imageCol !== cols[0]) {
    // Mettre l'image à gauche
    rowElement.insertBefore(imageCol, textCol);
  } else if (!imageLeft && textCol !== cols[0]) {
    // Mettre le texte à gauche
    rowElement.insertBefore(textCol, imageCol);
  }

  // Mettre à jour la couleur des boutons d'administration
  const buttons = sectionElement.querySelectorAll(".admin-controls button");
  let buttonClass = "btn-outline-primary";
  if (backgroundClass === "bg-black" || textClass === "text-white") {
    buttonClass = "btn-outline-light";
  }

  buttons.forEach((button) => {
    button.className = button.className.replace(/btn-outline-\w+/, buttonClass);
  });

  alert("Section mise à jour avec succès !");
}

// Mettre à jour les data attributes des boutons
function updateSectionButtonsData(sectionId, title, description, imageSrc) {
  const editButton = document.querySelector(
    `[data-section-id="${sectionId}"].btn-edit-section`
  );
  if (editButton) {
    editButton.setAttribute("data-section-title", title);
    editButton.setAttribute("data-section-description", description);
    editButton.setAttribute("data-section-image", imageSrc);
  }

  const deleteButton = document.querySelector(
    `[data-section-id="${sectionId}"].btn-delete-section`
  );
  if (deleteButton) {
    deleteButton.setAttribute("data-section-title", title);
  }
}

// Attacher les gestionnaires d'événements pour une section
function attachSectionEventListeners(sectionId) {
  const editButton = document.querySelector(
    `[data-section-id="${sectionId}"].btn-edit-section`
  );
  if (editButton) {
    editButton.addEventListener("click", function () {
      const title = this.getAttribute("data-section-title");
      const description = this.getAttribute("data-section-description");
      const image = this.getAttribute("data-section-image");
      openEditSectionModal(sectionId, title, description, image);
    });
  }

  const deleteButton = document.querySelector(
    `[data-section-id="${sectionId}"].btn-delete-section`
  );
  if (deleteButton) {
    deleteButton.addEventListener("click", function () {
      const title = this.getAttribute("data-section-title");
      openDeleteSectionModal(sectionId, title);
    });
  }
}

// Confirmer la suppression d'une section
function confirmDeleteSection() {
  const sectionId = this.getAttribute("data-section-id");
  console.log("Suppression de la section:", sectionId);

  const sectionElement = document.querySelector(
    `[data-section-id="${sectionId}"]`
  );
  if (sectionElement) {
    sectionElement.remove();
    alert("Section supprimée avec succès !");
  } else {
    alert("Section introuvable !");
  }

  // Fermer la modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("deleteSectionModal")
  );
  modal.hide();
}

// Initialiser lors du chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  // Vérifier si nous sommes sur la page carte
  if (
    window.location.pathname === "/carte" ||
    document.body.innerHTML.includes("Le plat du jour")
  ) {
    initCarteAdmin();
  }
});

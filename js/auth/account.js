// Gestion de la page Mon compte
console.log("🏠 Script account.js chargé");

// Variable pour éviter la double initialisation
let accountPageInitialized = false;

// Attendre que le DOM soit chargé ET initialiser immédiatement
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initializeAccountPage, 100); // Petit délai pour s'assurer que le HTML est rendu
});

// Fonction publique pour initialiser depuis le router
window.initializeAccountPage = initializeAccountPage;

function initializeAccountPage() {
  if (accountPageInitialized) {
    console.log("⚠️ Page account déjà initialisée, abandon");
    return;
  }

  console.log("🔧 Initialisation de la page account");

  // Attendre un peu plus que le contenu soit complètement chargé
  setTimeout(() => {
    const form = document.querySelector("form");
    const modifyButton = document.getElementById("modifyInfoBtn");
    const deleteButton = document.getElementById("deleteAccountBtn");

    console.log("🔍 Recherche des éléments:");
    console.log("- Form trouvé:", !!form);
    console.log("- Bouton modifier trouvé:", !!modifyButton);
    console.log("- Bouton supprimer trouvé:", !!deleteButton);

    if (form) {
      // Empêcher la soumission par défaut du formulaire
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("📝 Soumission du formulaire interceptée");
      });
    }

    // Ajouter les gestionnaires d'événements pour les boutons
    if (modifyButton) {
      console.log("✅ Bouton modifier trouvé, ajout du listener");
      modifyButton.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("🔄 Clic sur modifier informations");
        showModifyConfirmationModal();
      });
    } else {
      console.error("❌ Bouton modifier non trouvé - ID: modifyInfoBtn");
    }

    if (deleteButton) {
      console.log("✅ Bouton supprimer trouvé, ajout du listener");
      deleteButton.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("🗑️ Clic sur supprimer compte");
        showDeleteConfirmationModal();
      });
    } else {
      console.error("❌ Bouton supprimer non trouvé - ID: deleteAccountBtn");
    }

    // Charger les informations du compte utilisateur
    loadUserInformation();

    // Créer les modales de confirmation
    createConfirmationModals();

    accountPageInitialized = true;
    console.log("✅ Page account initialisée avec succès");
  }, 200);
}

function loadUserInformation() {
  // Récupérer l'email de l'utilisateur depuis sessionStorage
  const userEmail = sessionStorage.getItem("currentUserEmail");

  if (userEmail) {
    // 🚨 SÉCURITÉ: Ne jamais logger l'email complet
    console.log("📧 Chargement des informations utilisateur...");

    // Simuler le chargement des données utilisateur
    // Dans une vraie app, ceci serait un appel API
    const userData = getUserData(userEmail);

    if (userData) {
      populateForm(userData);
    }
  }
}

function getUserData(email) {
  // Simulation des données utilisateur (normalement depuis une base de données)
  const users = {
    "admin@quaiantique.com": {
      nom: "Michant",
      prenom: "Arnaud",
      allergies: "Aucune",
      nbConvives: 2,
    },
    "client1@test.com": {
      nom: "Dupont",
      prenom: "Jean",
      allergies: "Fruits de mer",
      nbConvives: 4,
    },
    "client2@test.com": {
      nom: "Martin",
      prenom: "Sophie",
      allergies: "Arachides, Gluten",
      nbConvives: 3,
    },
    "client3@test.com": {
      nom: "Durand",
      prenom: "Pierre",
      allergies: "Lactose",
      nbConvives: 2,
    },
  };

  return (
    users[email] || {
      nom: "Utilisateur",
      prenom: "Test",
      allergies: "",
      nbConvives: 2,
    }
  );
}

function populateForm(userData) {
  // Remplir les champs du formulaire avec les données utilisateur
  const nomInput = document.getElementById("NomInput");
  const prenomInput = document.getElementById("PrenomInput");
  const allergieInput = document.getElementById("AllergieInput");
  const nbConvivesInput = document.getElementById("NbConvivesInput");

  if (nomInput) nomInput.value = userData.nom;
  if (prenomInput) prenomInput.value = userData.prenom;
  if (allergieInput) allergieInput.value = userData.allergies;
  if (nbConvivesInput) nbConvivesInput.value = userData.nbConvives;
}

function createConfirmationModals() {
  // Créer la modale de confirmation pour modification
  const modifyModalHTML = `
    <div class="modal fade" id="modifyConfirmationModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">🔄 Confirmer la modification</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir modifier vos informations personnelles ?</p>
            <div id="modifyPreview" class="border p-3 bg-light rounded">
              <!-- Aperçu des modifications -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" id="confirmModifyBtn" class="btn btn-primary">✅ Confirmer les modifications</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Créer la modale de confirmation pour suppression
  const deleteModalHTML = `
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">⚠️ SUPPRESSION DÉFINITIVE</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger">
              <strong>⚠️ ATTENTION : Cette action est irréversible !</strong>
            </div>
            <p>La suppression de votre compte entraînera :</p>
            <ul>
              <li>🗑️ Suppression de toutes vos données personnelles</li>
              <li>❌ Annulation de toutes vos réservations</li>
              <li>🚫 Perte définitive de votre historique</li>
            </ul>
            <div class="mt-3">
              <label for="deleteConfirmInput" class="form-label">
                <strong>Pour confirmer, tapez "SUPPRIMER" :</strong>
              </label>
              <input type="text" id="deleteConfirmInput" class="form-control" placeholder="Tapez SUPPRIMER">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" id="confirmDeleteBtn" class="btn btn-danger" disabled>🗑️ Supprimer définitivement</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Ajouter les modales au DOM
  document.body.insertAdjacentHTML("beforeend", modifyModalHTML);
  document.body.insertAdjacentHTML("beforeend", deleteModalHTML);

  // Ajouter les gestionnaires d'événements
  setupModalEventListeners();
}

function setupModalEventListeners() {
  // Gestionnaire pour le bouton de confirmation de modification
  const confirmModifyBtn = document.getElementById("confirmModifyBtn");
  if (confirmModifyBtn) {
    confirmModifyBtn.addEventListener("click", function () {
      console.log("✅ Clic sur confirmer modifications");

      try {
        handleModifyInformation();
        // Fermer la modale de manière sécurisée
        closeModal("modifyConfirmationModal");
      } catch (error) {
        console.error("❌ Erreur lors de la confirmation:", error);
        // Fermer la modale même en cas d'erreur
        closeModal("modifyConfirmationModal");
      }
    });
  }

  // Gestionnaire pour le bouton de confirmation de suppression
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const deleteConfirmInput = document.getElementById("deleteConfirmInput");

  if (deleteConfirmInput) {
    deleteConfirmInput.addEventListener("input", function () {
      const isValid = this.value === "SUPPRIMER";
      confirmDeleteBtn.disabled = !isValid;
      confirmDeleteBtn.className = isValid
        ? "btn btn-danger"
        : "btn btn-outline-danger";
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", function () {
      console.log("🗑️ Clic sur confirmer suppression");

      try {
        handleDeleteAccount();
        // Fermer la modale de manière sécurisée
        closeModal("deleteConfirmationModal");
      } catch (error) {
        console.error("❌ Erreur lors de la suppression:", error);
        // Fermer la modale même en cas d'erreur
        closeModal("deleteConfirmationModal");
      }
    });
  }

  // ✅ CORRECTION : Gestionnaires pour les boutons Annuler et boutons de fermeture
  // Remplacer les data-bs-dismiss="modal" par des gestionnaires manuels
  setupCancelButtonsListeners();
}

// Nouvelle fonction pour gérer tous les boutons d'annulation et de fermeture
function setupCancelButtonsListeners() {
  // Attendre un peu pour que les modales soient dans le DOM
  setTimeout(() => {
    // Gestionnaires pour tous les boutons avec data-bs-dismiss="modal"
    const dismissButtons = document.querySelectorAll(
      '[data-bs-dismiss="modal"]'
    );
    dismissButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Trouver la modale parente
        const modal = this.closest(".modal");
        if (modal) {
          const modalId = modal.id;
          console.log("🚫 Clic sur annuler/fermer pour modal:", modalId);
          closeModal(modalId);
        }
      });

      // Supprimer l'attribut data-bs-dismiss pour éviter les conflits
      button.removeAttribute("data-bs-dismiss");
    });

    console.log(
      "✅ Gestionnaires d'annulation configurés pour",
      dismissButtons.length,
      "boutons"
    );
  }, 100);
}

// Fonction simplifiée pour ouvrir les modales (évite Bootstrap qui peut figer)
function showModal(modalId) {
  try {
    console.log("🔄 Ouverture du modal:", modalId);

    const modalElement = document.getElementById(modalId);
    if (!modalElement) {
      console.log("❌ Modal non trouvé:", modalId);
      return;
    }

    // Créer le backdrop avec clic pour fermer
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";
    backdrop.onclick = () => closeModal(modalId);
    document.body.appendChild(backdrop);

    // Affichage manuel directe (plus fiable)
    modalElement.style.display = "block";
    modalElement.classList.add("show");
    modalElement.setAttribute("aria-hidden", "false");
    modalElement.setAttribute("aria-modal", "true");
    modalElement.setAttribute("role", "dialog");
    modalElement.removeAttribute("tabindex");

    // Bloquer le scroll du body
    document.body.classList.add("modal-open");

    // Gestion de la touche Échap
    const escHandler = (e) => {
      if (e.key === "Escape") {
        closeModal(modalId);
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);

    console.log("✅ Modal ouvert:", modalId);
  } catch (error) {
    console.error("❌ Erreur lors de l'ouverture du modal:", error);
  }
}

// Fonction simplifiée pour fermer les modales (évite Bootstrap qui peut figer)
function closeModal(modalId) {
  try {
    console.log("🔄 Fermeture du modal:", modalId);

    const modalElement = document.getElementById(modalId);
    if (!modalElement) {
      console.log("❌ Modal non trouvé:", modalId);
      return;
    }

    // Fermeture manuelle directe (plus fiable)
    modalElement.classList.remove("show");
    modalElement.style.display = "none";
    modalElement.setAttribute("aria-hidden", "true");
    modalElement.removeAttribute("aria-modal");
    modalElement.setAttribute("tabindex", "-1");

    // Supprimer tous les backdrops
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());

    // Restaurer le scroll du body
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    console.log("✅ Modal fermé:", modalId);
  } catch (error) {
    console.error("❌ Erreur lors de la fermeture du modal:", error);
  }
}

function showModifyConfirmationModal() {
  // Récupérer les valeurs actuelles
  const nom = document.getElementById("NomInput")?.value || "";
  const prenom = document.getElementById("PrenomInput")?.value || "";
  const allergies = document.getElementById("AllergieInput")?.value || "Aucune";
  const nbConvives = document.getElementById("NbConvivesInput")?.value || "0";

  // Validation préalable
  if (!nom.trim() || !prenom.trim()) {
    showAlert("❌ Erreur", "Le nom et le prénom sont obligatoires.", "danger");
    return;
  }

  if (nbConvives < 1 || nbConvives > 20) {
    showAlert(
      "❌ Erreur",
      "Le nombre de convives doit être entre 1 et 20.",
      "danger"
    );
    return;
  }

  // Créer l'aperçu des modifications
  const previewHTML = `
    <h6>📝 Nouvelles informations :</h6>
    <ul class="list-unstyled">
      <li><strong>Nom :</strong> ${nom}</li>
      <li><strong>Prénom :</strong> ${prenom}</li>
      <li><strong>Allergies :</strong> ${allergies}</li>
      <li><strong>Convives habituels :</strong> ${nbConvives}</li>
    </ul>
  `;

  document.getElementById("modifyPreview").innerHTML = previewHTML;

  // Affichage manuel du modal (évite Bootstrap qui peut figer)
  showModal("modifyConfirmationModal");
}

function showDeleteConfirmationModal() {
  // Réinitialiser le champ de confirmation
  const deleteConfirmInput = document.getElementById("deleteConfirmInput");
  if (deleteConfirmInput) {
    deleteConfirmInput.value = "";
  }

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.className = "btn btn-outline-danger";
  }

  // Affichage manuel du modal (évite Bootstrap qui peut figer)
  showModal("deleteConfirmationModal");
}

function handleModifyInformation() {
  console.log("💾 Début de la sauvegarde des informations");

  try {
    // Récupérer les valeurs du formulaire
    const nom = document.getElementById("NomInput")?.value;
    const prenom = document.getElementById("PrenomInput")?.value;
    const allergies = document.getElementById("AllergieInput")?.value;
    const nbConvives = document.getElementById("NbConvivesInput")?.value;

    console.log("📝 Données récupérées:", {
      nom,
      prenom,
      allergies,
      nbConvives: parseInt(nbConvives),
    });

    // Afficher immédiatement le message de succès
    showAlert(
      "✅ Succès",
      "Vos informations ont été mises à jour avec succès !",
      "success"
    );

    // Mettre à jour les données en local (simulation)
    updateUserData(nom, prenom, allergies, nbConvives);

    console.log("✅ Sauvegarde terminée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde:", error);
    showAlert(
      "❌ Erreur",
      "Une erreur s'est produite lors de la sauvegarde.",
      "danger"
    );
  }
}

function handleDeleteAccount() {
  // La confirmation se fait maintenant via la modale
  console.log("�️ Processus de suppression confirmé via modale");

  // Procéder à la suppression
  deleteUserAccount();
}

function deleteUserAccount() {
  // 🚨 SÉCURITÉ: Ne jamais logger l'email complet
  console.log("🗑️ Suppression du compte en cours...");

  // Afficher un message de traitement
  showAlert(
    "⏳ Traitement",
    "Suppression de votre compte en cours...",
    "warning"
  );

  // Simuler la suppression (normalement un appel API)
  setTimeout(() => {
    // Nettoyer toutes les données locales
    clearUserData();

    // Message final avec modale de confirmation
    showFinalDeleteConfirmation();

    // Redirection après 4 secondes
    setTimeout(() => {
      // Déconnecter l'utilisateur
      signout();
      // Rediriger vers l'accueil
      navigateTo("/");
    }, 4000);
  }, 2000);
}

function showFinalDeleteConfirmation() {
  // Créer une modale de confirmation finale
  const finalModalHTML = `
    <div class="modal fade" id="finalDeleteModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-success">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">✅ Compte supprimé avec succès</h5>
          </div>
          <div class="modal-body text-center">
            <div class="mb-3">
              <i class="display-1 text-success">✅</i>
            </div>
            <h6>Votre compte a été supprimé définitivement</h6>
            <p class="text-muted">Vous allez être redirigé vers la page d'accueil dans quelques secondes...</p>
            
            <div class="progress mt-3">
              <div id="redirectProgress" class="progress-bar bg-success" role="progressbar" style="width: 0%"></div>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-primary" onclick="navigateTo('/')">
              🏠 Aller à l'accueil maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Ajouter la modale au DOM
  document.body.insertAdjacentHTML("beforeend", finalModalHTML);

  // Affichage manuel du modal (évite Bootstrap qui peut figer)
  showModal("finalDeleteModal");

  // Animer la barre de progression
  let progress = 0;
  const progressBar = document.getElementById("redirectProgress");
  const interval = setInterval(() => {
    progress += 2.5; // 100% en 4 secondes (100/40 = 2.5)
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
    }
  }, 100);
}

function updateUserData(nom, prenom, allergies, nbConvives) {
  // Simuler la mise à jour des données utilisateur
  const userEmail = sessionStorage.getItem("currentUserEmail");
  console.log(`📝 Mise à jour des données pour ${userEmail}:`, {
    nom,
    prenom,
    allergies,
    nbConvives,
  });

  // Dans une vraie application, ceci serait sauvegardé en base de données
}

function clearUserData() {
  // Nettoyer les données de session
  sessionStorage.removeItem("currentUserEmail");
  sessionStorage.removeItem("redirectAfterLogin");

  // Supprimer les cookies d'authentification
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  console.log("🧹 Données utilisateur nettoyées");
}

function showAlert(title, message, type = "info") {
  // Créer une alerte Bootstrap dynamique
  const alertContainer = document.createElement("div");
  alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertContainer.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; max-width: 400px;";

  alertContainer.innerHTML = `
        <strong>${title}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  document.body.appendChild(alertContainer);

  // Supprimer automatiquement après 5 secondes
  setTimeout(() => {
    if (alertContainer?.parentNode) {
      alertContainer.remove();
    }
  }, 5000);
}

// Fonction utilitaire pour la déconnexion (réutilise la fonction existante)
function signout() {
  // Supprimer les cookies
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Nettoyer sessionStorage
  sessionStorage.clear();

  // Mettre à jour l'indicateur utilisateur
  if (typeof updateCurrentUserIndicator === "function") {
    updateCurrentUserIndicator();
  }

  // Masquer les éléments selon les rôles
  if (typeof showAndHideElementsForRoles === "function") {
    showAndHideElementsForRoles();
  }

  console.log("👋 Utilisateur déconnecté depuis la page account");
}

console.log("✅ Script account.js initialisé avec succès");

// Fonction de test pour déboguer les boutons
window.testAccountButtons = function () {
  console.log("🧪 Test des boutons account:");
  const modifyBtn = document.getElementById("modifyInfoBtn");
  const deleteBtn = document.getElementById("deleteAccountBtn");

  console.log("- Bouton modifier:", !!modifyBtn);
  console.log("- Bouton supprimer:", !!deleteBtn);

  if (modifyBtn) {
    console.log("🔄 Test clic bouton modifier");
    modifyBtn.click();
  }

  if (deleteBtn) {
    console.log("🗑️ Test clic bouton supprimer");
    deleteBtn.click();
  }
};

// Fonction pour réinitialiser complètement la page
window.reinitializeAccountPage = function () {
  accountPageInitialized = false;
  initializeAccountPage();
};

// Fonctions globales pour les onclick des boutons (solution de secours)
window.handleModifyClick = function () {
  console.log("🔄 Clic sur modifier (onclick)");

  // S'assurer que les modales sont créées
  if (!document.getElementById("modifyConfirmationModal")) {
    createConfirmationModals();
  }

  showModifyConfirmationModal();
};

window.handleDeleteClick = function () {
  console.log("🗑️ Clic sur supprimer (onclick)");

  // S'assurer que les modales sont créées
  if (!document.getElementById("deleteConfirmationModal")) {
    createConfirmationModals();
  }

  showDeleteConfirmationModal();
};

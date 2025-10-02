// Gestion des réservations avec différenciation client/admin

// Données simulées de réservations (normalement récupérées depuis une base de données)
const reservationsData = [
  {
    id: 1,
    userId: "test@email.com",
    userName: "John Doe",
    date: "2025-10-15",
    time: "19:30",
    guests: 4,
    allergies: "Arachides",
    service: "soir",
    status: "confirmée",
  },
  {
    id: 2,
    userId: "test@email.com",
    userName: "John Doe",
    date: "2025-10-20",
    time: "12:00",
    guests: 2,
    allergies: "Aucune",
    service: "midi",
    status: "confirmée",
  },
  {
    id: 3,
    userId: "client2@email.com",
    userName: "Marie Martin",
    date: "2025-10-18",
    time: "20:00",
    guests: 6,
    allergies: "Fruits de mer",
    service: "soir",
    status: "en attente",
  },
  {
    id: 4,
    userId: "admin@email.com",
    userName: "Admin Système",
    date: "2025-10-25",
    time: "19:45",
    guests: 3,
    allergies: "Aucune",
    service: "soir",
    status: "confirmée",
  },
  {
    id: 5,
    userId: "client3@email.com",
    userName: "Pierre Dupont",
    date: "2025-10-12",
    time: "12:30",
    guests: 5,
    allergies: "Gluten",
    service: "midi",
    status: "annulée",
  },
];

// Fonction pour obtenir l'email de l'utilisateur connecté (simulation basée sur les cookies)
function getCurrentUserEmail() {
  // En production, ceci devrait être récupéré depuis le token JWT décodé
  // Pour la simulation, on utilise les emails de test du système de connexion
  const role = getRole();

  // Vérifier s'il y a un email stocké temporairement (pour les tests)
  const storedEmail = sessionStorage.getItem("currentUserEmail");
  if (storedEmail) {
    return storedEmail;
  }

  // Emails par défaut selon le rôle
  if (role === "admin") {
    return "admin@email.com";
  } else if (role === "client") {
    return "test@email.com"; // Email par défaut pour les clients de test
  }
  return null;
}

// Fonction pour filtrer les réservations selon le rôle de l'utilisateur
function getFilteredReservations() {
  const userRole = getRole();
  const userEmail = getCurrentUserEmail();

  if (!userRole || !userEmail) {
    return [];
  }

  if (userRole === "admin") {
    // L'administrateur voit toutes les réservations
    secureLog.debug(
      "✅ Mode admin - Retour de toutes les réservations:",
      reservationsData.length
    );
    return reservationsData;
  } else if (userRole === "client") {
    // Le client ne voit que ses propres réservations
    const clientReservations = reservationsData.filter(
      (reservation) => reservation.userId === userEmail
    );
    secureLog.debug(
      "✅ Mode client - Réservations filtrées:",
      clientReservations.length
    );
    return clientReservations;
  }

  secureLog.debug("❌ Rôle non reconnu, retour tableau vide");
  return [];
}

// Fonction pour formater la date en français
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Fonction pour générer les boutons d'actions client
function getClientActionButtons(reservation) {
  const canModify =
    canModifyReservation(reservation.date, reservation.time) &&
    reservation.status !== "annulée";

  if (canModify) {
    return `
      <button type="button" class="btn btn-outline-primary btn-edit-client-reservation" 
              data-reservation-id="${reservation.id}" title="Modifier">
          ✏️
      </button>
      <button type="button" class="btn btn-outline-warning btn-cancel-client-reservation" 
              data-reservation-id="${reservation.id}" title="Annuler">
          ❌
      </button>
    `;
  } else {
    return `
      <button type="button" class="btn btn-outline-secondary btn-contact-restaurant" 
              data-reservation-id="${reservation.id}" 
              data-action="modify" title="Contacter le restaurant">
          ✏️
      </button>
      <button type="button" class="btn btn-outline-secondary btn-contact-restaurant" 
              data-reservation-id="${reservation.id}" 
              data-action="cancel" title="Contacter le restaurant">
          ❌
      </button>
    `;
  }
}

// Fonction pour obtenir la classe CSS selon le statut
function getStatusClass(status) {
  switch (status) {
    case "confirmée":
      return "text-success";
    case "en attente":
      return "text-warning";
    case "annulée":
      return "text-danger";
    default:
      return "text-secondary";
  }
}

// Fonction pour vérifier si une réservation peut être modifiée/annulée (24h avant)
function canModifyReservation(reservationDate, reservationTime) {
  const now = new Date();
  const reservationDateTime = new Date(`${reservationDate}T${reservationTime}`);
  const timeDiff = reservationDateTime.getTime() - now.getTime();
  const hoursUntilReservation = timeDiff / (1000 * 3600); // Convertir en heures

  return hoursUntilReservation >= 24;
}

// Fonction pour générer le HTML d'une réservation
function generateReservationHTML(reservation, isAdmin = false) {
  const statusClass = getStatusClass(reservation.status);
  const formattedDate = formatDate(reservation.date);

  return `
        <div class="reservation-item border rounded mb-3 p-3" data-reservation-id="${
          reservation.id
        }">
            <div class="row align-items-center">
                <div class="col-md-3">
                    <h6 class="mb-1">📅 ${formattedDate}</h6>
                    <small class="text-muted">⏰ ${reservation.time} (${
    reservation.service
  })</small>
                </div>
                <div class="col-md-2">
                    <span class="badge bg-primary">👥 ${
                      reservation.guests
                    } personne${reservation.guests > 1 ? "s" : ""}</span>
                </div>
                <div class="col-md-3">
                    <small class="text-muted">🚫 Allergies: ${
                      reservation.allergies
                    }</small>
                </div>
                <div class="col-md-2">
                    <span class="badge ${statusClass.replace(
                      "text-",
                      "bg-"
                    )}">${reservation.status.toUpperCase()}</span>
                </div>
                <div class="col-md-2">
                    ${
                      isAdmin
                        ? `
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-primary btn-edit-reservation" 
                                    data-reservation-id="${reservation.id}" title="Modifier">
                                ✏️
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-delete-reservation" 
                                    data-reservation-id="${reservation.id}" title="Supprimer">
                                🗑️
                            </button>
                        </div>
                    `
                        : `
                        <div class="btn-group btn-group-sm" role="group">
                            ${getClientActionButtons(reservation)}
                            <button type="button" class="btn btn-outline-info btn-view-reservation" 
                                    data-reservation-id="${
                                      reservation.id
                                    }" title="Détails">
                                👁️
                            </button>
                        </div>
                    `
                    }
                </div>
            </div>
            ${
              isAdmin
                ? `
                <div class="row mt-2">
                    <div class="col-12">
                        <small class="text-muted">
                            👤 Client: <strong>${reservation.userName}</strong> (${reservation.userId})
                        </small>
                    </div>
                </div>
            `
                : ""
            }
        </div>
    `;
}

// Fonction pour afficher les réservations
function displayReservations() {
  secureLog.debug("🔄 Affichage des réservations...");

  const reservationsContainer = document.querySelector(".allreservations");
  const loadingElement = document.getElementById("loading-reservations");

  if (!reservationsContainer) {
    console.error("❌ Container des réservations non trouvé");
    return;
  }

  // 🔍 DEBUGGING : Vérifier les données utilisateur
  const userRole = getRole();
  const userEmail = getCurrentUserEmail();

  // Afficher l'indicateur de chargement
  if (loadingElement) {
    loadingElement.style.display = "block";
  }

  // Simuler un délai de chargement (dans une vraie app, ce serait un appel API)
  setTimeout(() => {
    // Masquer l'indicateur de chargement
    if (loadingElement) {
      loadingElement.style.display = "none";
    }

    renderReservations();
  }, 500);
}

// Fonction pour effectuer le rendu des réservations
function renderReservations() {
  const reservationsContainer = document.querySelector(".allreservations");

  const userRole = getRole();
  const isAdmin = userRole === "admin";
  const filteredReservations = getFilteredReservations();

  // Mettre à jour le titre selon le rôle
  const titleElement = document.querySelector(".hero-scene-content h1");
  if (titleElement) {
    if (isAdmin) {
      titleElement.innerHTML =
        '🏪 Toutes les réservations <small class="text-muted">(Administrateur)</small>';
    } else {
      titleElement.textContent = "📋 Vos réservations";
    }
  }

  // Vider et reconstruire le contenu
  reservationsContainer.innerHTML = "";

  if (filteredReservations.length === 0) {
    reservationsContainer.innerHTML = `
            <div class="text-center py-5">
                <h4 class="text-muted">Aucune réservation trouvée</h4>
                <p class="text-muted">
                    ${
                      isAdmin
                        ? "Aucune réservation dans le système."
                        : "Vous n'avez pas encore de réservation."
                    }
                </p>
                <a href="/reserver" class="btn btn-primary" onclick="route(event)">
                    ➕ Faire une réservation
                </a>
            </div>
        `;
    return;
  }

  // Trier les réservations par date (plus récentes en premier)
  filteredReservations.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Générer le HTML pour chaque réservation
  let reservationsHTML = "";
  filteredReservations.forEach((reservation) => {
    reservationsHTML += generateReservationHTML(reservation, isAdmin);
  });

  reservationsContainer.innerHTML = `
        <div class="mb-4">
            <div class="row">
                <div class="col-md-6">
                    <h4>${
                      isAdmin
                        ? "📊 Gestion des réservations"
                        : "📋 Mes réservations"
                    }</h4>
                    <p class="text-muted">
                        ${filteredReservations.length} réservation${
    filteredReservations.length > 1 ? "s" : ""
  } 
                        ${isAdmin ? "au total" : "trouvée(s)"}
                    </p>
                </div>
                <div class="col-md-6 text-end">
                    ${
                      isAdmin
                        ? `
                        <button type="button" class="btn btn-success btn-sm me-2" id="btn-export-reservations">
                            📊 Exporter
                        </button>
                        <button type="button" class="btn btn-info btn-sm" id="btn-refresh-reservations">
                            🔄 Actualiser
                        </button>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
        ${reservationsHTML}
    `;

  // Attacher les gestionnaires d'événements
  attachReservationEventListeners(isAdmin);

  secureLog.debug(
    `${filteredReservations.length} réservations affichées pour ${userRole}`
  );
}

// Fonction pour attacher les gestionnaires d'événements
function attachReservationEventListeners(isAdmin) {
  if (isAdmin) {
    // Gestionnaires pour l'administrateur
    const editButtons = document.querySelectorAll(".btn-edit-reservation");
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const reservationId = parseInt(
          this.getAttribute("data-reservation-id")
        );
        editReservation(reservationId);
      });
    });

    const deleteButtons = document.querySelectorAll(".btn-delete-reservation");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const reservationId = parseInt(
          this.getAttribute("data-reservation-id")
        );
        deleteReservation(reservationId);
      });
    });

    const exportButton = document.getElementById("btn-export-reservations");
    if (exportButton) {
      exportButton.addEventListener("click", exportReservations);
    }

    const refreshButton = document.getElementById("btn-refresh-reservations");
    if (refreshButton) {
      refreshButton.addEventListener("click", displayReservations);
    }
  } else {
    // Gestionnaires pour les clients
    const viewButtons = document.querySelectorAll(".btn-view-reservation");
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const reservationId = parseInt(
          this.getAttribute("data-reservation-id")
        );
        viewReservationDetails(reservationId);
      });
    });

    // Gestionnaires pour modifier une réservation (clients)
    const editClientButtons = document.querySelectorAll(
      ".btn-edit-client-reservation"
    );
    editClientButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const reservationId = parseInt(
          this.getAttribute("data-reservation-id")
        );
        editClientReservation(reservationId);
      });
    });

    // Gestionnaires pour annuler une réservation (clients)
    const cancelClientButtons = document.querySelectorAll(
      ".btn-cancel-client-reservation"
    );
    cancelClientButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const reservationId = parseInt(
          this.getAttribute("data-reservation-id")
        );
        cancelClientReservation(reservationId);
      });
    });

    // Gestionnaires pour contacter le restaurant (après 24h)
    const contactButtons = document.querySelectorAll(".btn-contact-restaurant");
    contactButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const reservationId = parseInt(
          this.getAttribute("data-reservation-id")
        );
        const action = this.getAttribute("data-action");
        showContactRestaurantModal(reservationId, action);
      });
    });
  }
}

// Fonction pour voir les détails d'une réservation (client)
function viewReservationDetails(reservationId) {
  const reservation = reservationsData.find((r) => r.id === reservationId);
  if (!reservation) {
    alert("Réservation non trouvée");
    return;
  }

  const formattedDate = formatDate(reservation.date);

  alert(
    `📋 Détails de votre réservation\n\n` +
      `📅 Date: ${formattedDate}\n` +
      `⏰ Heure: ${reservation.time} (${reservation.service})\n` +
      `👥 Nombre de personnes: ${reservation.guests}\n` +
      `🚫 Allergies: ${reservation.allergies}\n` +
      `📊 Statut: ${reservation.status}\n\n` +
      `Pour toute modification, contactez le restaurant.`
  );
}

// Fonction pour modifier une réservation (admin)
function editReservation(reservationId) {
  const reservation = reservationsData.find((r) => r.id === reservationId);
  if (!reservation) {
    alert("Réservation non trouvée");
    return;
  }

  const newStatus = prompt(
    `Modifier le statut de la réservation de ${reservation.userName}:\n\n` +
      `Statut actuel: ${reservation.status}\n\n` +
      `Nouveaux statuts possibles:\n` +
      `- confirmée\n` +
      `- en attente\n` +
      `- annulée\n\n` +
      `Entrez le nouveau statut:`,
    reservation.status
  );

  if (newStatus && ["confirmée", "en attente", "annulée"].includes(newStatus)) {
    reservation.status = newStatus;
    alert(`Statut mis à jour avec succès !`);
    displayReservations(); // Actualiser l'affichage
  } else if (newStatus !== null) {
    alert(
      "Statut invalide. Veuillez choisir: confirmée, en attente, ou annulée"
    );
  }
}

// Fonction pour supprimer une réservation (admin)
function deleteReservation(reservationId) {
  const reservation = reservationsData.find((r) => r.id === reservationId);
  if (!reservation) {
    alert("Réservation non trouvée");
    return;
  }

  const confirmDelete = confirm(
    `⚠️ Supprimer la réservation ?\n\n` +
      `Client: ${reservation.userName}\n` +
      `Date: ${formatDate(reservation.date)}\n` +
      `Heure: ${reservation.time}\n\n` +
      `Cette action est irréversible.`
  );

  if (confirmDelete) {
    const index = reservationsData.findIndex((r) => r.id === reservationId);
    if (index > -1) {
      reservationsData.splice(index, 1);
      alert("Réservation supprimée avec succès !");
      displayReservations(); // Actualiser l'affichage
    }
  }
}

// Fonction pour exporter les réservations (admin)
function exportReservations() {
  const reservations = getFilteredReservations();
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent +=
    "ID,Client,Email,Date,Heure,Service,Personnes,Allergies,Statut\n";

  reservations.forEach((reservation) => {
    const row = [
      reservation.id,
      reservation.userName,
      reservation.userId,
      reservation.date,
      reservation.time,
      reservation.service,
      reservation.guests,
      reservation.allergies,
      reservation.status,
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `reservations-${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert(`${reservations.length} réservations exportées !`);
}

// Fonction pour modifier une réservation (clients)
function editClientReservation(reservationId) {
  const reservation = reservationsData.find((r) => r.id === reservationId);
  if (!reservation) {
    alert("Réservation non trouvée");
    return;
  }

  // Rediriger vers le formulaire de réservation en mode édition
  // Stocker les données de la réservation à modifier
  sessionStorage.setItem("editingReservation", JSON.stringify(reservation));

  // Rediriger vers la page de réservation
  if (typeof window.navigateTo === "function") {
    window.navigateTo("/reserver");
  } else if (typeof navigateTo === "function") {
    navigateTo("/reserver");
  } else {
    // Fallback
    window.location.href = "/reserver";
  }
}

// Fonction pour annuler une réservation (clients)
function cancelClientReservation(reservationId) {
  const reservation = reservationsData.find((r) => r.id === reservationId);
  if (!reservation) {
    alert("Réservation non trouvée");
    return;
  }

  const formattedDate = formatDate(reservation.date);

  const confirmCancel = confirm(
    `⚠️ Annulation de réservation\n\n` +
      `Êtes-vous sûr(e) de vouloir annuler votre réservation ?\n\n` +
      `📅 Date: ${formattedDate}\n` +
      `⏰ Heure: ${reservation.time}\n` +
      `👥 ${reservation.guests} personne(s)\n\n` +
      `Cette action est irréversible.`
  );

  if (confirmCancel) {
    // Mettre à jour le statut de la réservation
    reservation.status = "annulée";

    alert(
      `✅ Réservation annulée avec succès !\n\n` +
        `Votre réservation du ${formattedDate} à ${reservation.time} a été annulée.\n\n` +
        `Un email de confirmation vous sera envoyé sous peu.`
    );

    // Rafraîchir l'affichage
    displayReservations();
  }
}

// Fonction pour afficher la modal de contact du restaurant
function showContactRestaurantModal(reservationId, action) {
  const reservation = reservationsData.find((r) => r.id === reservationId);
  if (!reservation) {
    alert("Réservation non trouvée");
    return;
  }

  const formattedDate = formatDate(reservation.date);
  const actionText = action === "modify" ? "modifier" : "annuler";
  const actionEmoji = action === "modify" ? "✏️" : "❌";

  // Créer une modal Bootstrap
  const modalHTML = `
    <div class="modal fade" id="contactRestaurantModal" tabindex="-1" aria-labelledby="contactRestaurantModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="contactRestaurantModalLabel">
              ${actionEmoji} ${
    actionText.charAt(0).toUpperCase() + actionText.slice(1)
  } votre réservation
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning" role="alert">
              <h6><i class="fas fa-clock"></i> Délai de modification dépassé</h6>
              <p class="mb-2">Il n'est plus possible de ${actionText} votre réservation en ligne car il reste moins de 24 heures avant la date prévue.</p>
            </div>
            
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">📋 Détails de votre réservation :</h6>
                <ul class="list-unstyled mb-0">
                  <li><strong>📅 Date :</strong> ${formattedDate}</li>
                  <li><strong>⏰ Heure :</strong> ${reservation.time} (${
    reservation.service
  })</li>
                  <li><strong>👥 Personnes :</strong> ${reservation.guests}</li>
                  <li><strong>🚫 Allergies :</strong> ${
                    reservation.allergies
                  }</li>
                </ul>
              </div>
            </div>

            <div class="mt-3">
              <h6>📞 Pour ${actionText} cette réservation, veuillez contacter directement le restaurant :</h6>
              <div class="d-grid gap-2">
                <a href="tel:+33123456789" class="btn btn-success">
                  <i class="fas fa-phone"></i> Appeler le restaurant
                  <br><small>+33 1 23 45 67 89</small>
                </a>
                <a href="mailto:contact@quai-antique.fr?subject=Demande de ${actionText} de réservation - ${formattedDate}&body=Bonjour,%0A%0AJe souhaite ${actionText} ma réservation suivante :%0A- Date : ${formattedDate}%0A- Heure : ${
    reservation.time
  }%0A- Nombre de personnes : ${
    reservation.guests
  }%0A%0AMerci de me confirmer la prise en compte de cette demande.%0A%0ACordialement" 
                   class="btn btn-primary">
                  <i class="fas fa-envelope"></i> Envoyer un email
                  <br><small>contact@quai-antique.fr</small>
                </a>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Supprimer toute modal existante
  const existingModal = document.getElementById("contactRestaurantModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Ajouter la modal au DOM
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Afficher la modal
  const modal = new bootstrap.Modal(
    document.getElementById("contactRestaurantModal")
  );
  modal.show();

  // Supprimer la modal du DOM quand elle est fermée
  document
    .getElementById("contactRestaurantModal")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });
}

// Initialisation au chargement de la page
// 🚀 INITIALISATION ROBUSTE
function initializeReservationsPage() {
  secureLog.debug("🔧 Tentative d'initialisation des réservations...");

  // Vérifier si nous sommes sur la page des réservations
  const isReservationsPage =
    window.location.pathname === "/allResa" ||
    document.body.innerHTML.includes("Vos réservations") ||
    document.querySelector(".allreservations");

  if (isReservationsPage) {
    secureLog.debug(
      "✅ Page réservations détectée, lancement de displayReservations"
    );
    displayReservations();
  } else {
    secureLog.debug("❌ Pas sur la page réservations");
  }
}

// Méthode 1: DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeReservationsPage);

// Méthode 2: Si DOM déjà chargé
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeReservationsPage);
} else {
  // DOM déjà chargé
  secureLog.debug("🔄 DOM déjà chargé, initialisation immédiate");
  setTimeout(initializeReservationsPage, 100);
}

// Méthode 3: Fonction globale pour le router
window.initializeReservationsPage = initializeReservationsPage;

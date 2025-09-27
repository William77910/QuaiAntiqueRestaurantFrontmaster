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

  console.log("🔍 getFilteredReservations - Rôle:", userRole);
  console.log("🔍 getFilteredReservations - Email:", userEmail);

  if (!userRole || !userEmail) {
    console.log("❌ Rôle ou email manquant, retour tableau vide");
    return [];
  }

  if (userRole === "admin") {
    // L'administrateur voit toutes les réservations
    console.log(
      "✅ Mode admin - Retour de toutes les réservations:",
      reservationsData.length
    );
    return reservationsData;
  } else if (userRole === "client") {
    // Le client ne voit que ses propres réservations
    const clientReservations = reservationsData.filter(
      (reservation) => reservation.userId === userEmail
    );
    console.log(
      "✅ Mode client - Réservations filtrées:",
      clientReservations.length
    );
    return clientReservations;
  }

  console.log("❌ Rôle non reconnu, retour tableau vide");
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
                        <button type="button" class="btn btn-sm btn-outline-secondary btn-view-reservation" 
                                data-reservation-id="${reservation.id}">
                            👁️ Détails
                        </button>
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
  console.log("🔄 Affichage des réservations...");

  const reservationsContainer = document.querySelector(".allreservations");
  const loadingElement = document.getElementById("loading-reservations");

  if (!reservationsContainer) {
    console.error("❌ Container des réservations non trouvé");
    return;
  }

  // 🔍 DEBUGGING : Vérifier les données utilisateur
  const userRole = getRole();
  const userEmail = getCurrentUserEmail();
  console.log("🔍 DEBUG - Rôle utilisateur:", userRole);
  console.log("🔍 DEBUG - Email utilisateur:", userEmail);
  console.log(
    "🔍 DEBUG - Total réservations disponibles:",
    reservationsData.length
  );

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
                <a href="/reserver" class="btn btn-primary" onclick="route()">
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

  console.log(
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

// Initialisation au chargement de la page
// 🚀 INITIALISATION ROBUSTE
function initializeReservationsPage() {
  console.log("🔧 Tentative d'initialisation des réservations...");

  // Vérifier si nous sommes sur la page des réservations
  const isReservationsPage =
    window.location.pathname === "/allResa" ||
    document.body.innerHTML.includes("Vos réservations") ||
    document.querySelector(".allreservations");

  if (isReservationsPage) {
    console.log(
      "✅ Page réservations détectée, lancement de displayReservations"
    );
    displayReservations();
  } else {
    console.log("❌ Pas sur la page réservations");
  }
}

// Méthode 1: DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeReservationsPage);

// Méthode 2: Si DOM déjà chargé
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeReservationsPage);
} else {
  // DOM déjà chargé
  console.log("🔄 DOM déjà chargé, initialisation immédiate");
  setTimeout(initializeReservationsPage, 100);
}

// Méthode 3: Fonction globale pour le router
window.initializeReservationsPage = initializeReservationsPage;

// Gestion de la page de réservation

// Référence aux données de réservations (définie dans reservations-manager.js)
// Cette variable est partagée globalement
if (typeof reservationsData === "undefined") {
  console.warn(
    "reservationsData non définie - certaines fonctionnalités peuvent être limitées"
  );
}

// Fonction pour vérifier si on est en mode édition
function isEditMode() {
  return sessionStorage.getItem("editingReservation") !== null;
}

// Fonction pour récupérer les données de la réservation à modifier
function getEditingReservation() {
  const reservationData = sessionStorage.getItem("editingReservation");
  return reservationData ? JSON.parse(reservationData) : null;
}

// Fonction pour remplir le formulaire avec les données de la réservation à modifier
function prefillEditForm() {
  const reservation = getEditingReservation();
  if (!reservation) return;

  // Mettre à jour le titre de la page
  const titleElement = document.querySelector(".hero-scene-content h1");
  if (titleElement) {
    titleElement.textContent = "Modifier votre réservation";
  }

  // Pré-remplir les champs
  const nomInput = document.getElementById("NomInput");
  const prenomInput = document.getElementById("PrenomInput");
  const selectDate = document.getElementById("selectDate");
  const selectHour = document.getElementById("selectHour");
  const guestsInput = document.getElementById("GuestsInput");
  const allergiesInput = document.getElementById("AllergiesInput");
  const midiRadio = document.getElementById("midiRadio");
  const soirRadio = document.getElementById("soirRadio");

  if (nomInput) nomInput.value = reservation.userName.split(" ")[1] || "";
  if (prenomInput) prenomInput.value = reservation.userName.split(" ")[0] || "";
  if (selectDate) selectDate.value = reservation.date;
  if (guestsInput) guestsInput.value = reservation.guests;
  if (allergiesInput) allergiesInput.value = reservation.allergies;

  // Sélectionner le service
  if (reservation.service === "midi" && midiRadio) {
    midiRadio.checked = true;
  } else if (reservation.service === "soir" && soirRadio) {
    soirRadio.checked = true;
  }

  // Mettre à jour les heures disponibles puis sélectionner l'heure
  updateAvailableHours();
  setTimeout(() => {
    if (selectHour) {
      selectHour.value = reservation.time;
    }
  }, 100);

  // Changer le texte du bouton
  const submitButton = document.getElementById("submit-btn");
  if (submitButton) {
    submitButton.textContent = "✏️ Modifier la réservation";
  }

  // Ajouter un bouton d'annulation
  const buttonContainer = submitButton?.parentElement;
  if (buttonContainer && !document.getElementById("cancel-edit-btn")) {
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.id = "cancel-edit-btn";
    cancelButton.className = "btn btn-secondary ms-2";
    cancelButton.textContent = "❌ Annuler la modification";
    cancelButton.addEventListener("click", cancelEdit);
    buttonContainer.appendChild(cancelButton);
  }
}

// Fonction pour annuler le mode édition
function cancelEdit() {
  sessionStorage.removeItem("editingReservation");
  window.location.hash = "#/allResa";
  route();
}

// Fonction pour obtenir les informations de l'utilisateur connecté
function getUserInfo() {
  const role = getRole();
  // En production, ces informations viendraient du token JWT ou d'une API
  if (role === "admin") {
    return {
      nom: "Administrateur",
      prenom: "Système",
      email: "admin@email.com",
    };
  } else if (role === "client") {
    return {
      nom: "Doe",
      prenom: "John",
      email: "test@email.com",
    };
  }
  return null;
}

// Fonction pour pré-remplir le formulaire avec les informations utilisateur
function prefillUserInfo() {
  const userInfo = getUserInfo();
  if (!userInfo) return;

  const nomInput = document.getElementById("NomInput");
  const prenomInput = document.getElementById("PrenomInput");

  if (nomInput) nomInput.value = userInfo.nom;
  if (prenomInput) prenomInput.value = userInfo.prenom;
}

// Fonction pour gérer les heures disponibles selon le service
function updateAvailableHours() {
  const selectHour = document.getElementById("selectHour");
  const midiRadio = document.getElementById("midiRadio");
  const soirRadio = document.getElementById("soirRadio");

  if (!selectHour || !midiRadio || !soirRadio) return;

  const updateHours = () => {
    selectHour.innerHTML = "";

    if (midiRadio.checked) {
      // Heures du midi
      const midiHours = [
        "11:30",
        "11:45",
        "12:00",
        "12:15",
        "12:30",
        "12:45",
        "13:00",
        "13:15",
        "13:30",
      ];
      midiHours.forEach((hour) => {
        const option = document.createElement("option");
        option.value = hour;
        option.textContent = hour;
        selectHour.appendChild(option);
      });
    } else if (soirRadio.checked) {
      // Heures du soir
      const soirHours = [
        "19:00",
        "19:15",
        "19:30",
        "19:45",
        "20:00",
        "20:15",
        "20:30",
        "20:45",
        "21:00",
        "21:15",
      ];
      soirHours.forEach((hour) => {
        const option = document.createElement("option");
        option.value = hour;
        option.textContent = hour;
        selectHour.appendChild(option);
      });
    }
  };

  // Écouter les changements de service
  midiRadio.addEventListener("change", () => {
    updateHours();
    // Vérifier le délai après changement d'heure
    setTimeout(() => validateReservationTimingWarning(), 100);
  });
  soirRadio.addEventListener("change", () => {
    updateHours();
    // Vérifier le délai après changement d'heure
    setTimeout(() => validateReservationTimingWarning(), 100);
  });

  // Écouter les changements d'heure
  selectHour.addEventListener("change", validateReservationTimingWarning);

  // Initialiser avec le service sélectionné
  updateHours();
}

// Fonction pour valider la date sélectionnée
function validateDate() {
  const dateInput = document.getElementById("DateInput");
  if (!dateInput) return;

  dateInput.addEventListener("change", function () {
    const selectedDate = new Date(this.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("⚠️ Vous ne pouvez pas réserver pour une date passée.");
      this.value = "";
      return;
    }

    // Vérifier que ce n'est pas trop loin dans le futur (ex: max 3 mois)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    if (selectedDate > maxDate) {
      alert(
        "⚠️ Les réservations ne sont acceptées que jusqu'à 3 mois à l'avance."
      );
      this.value = "";
      return;
    }

    // Vérifier si c'est un dimanche (restaurant fermé)
    if (selectedDate.getDay() === 0) {
      alert(
        "⚠️ Le restaurant est fermé le dimanche. Veuillez choisir une autre date."
      );
      this.value = "";
      return;
    }

    // Vérifier le délai de 24h après changement de date
    setTimeout(() => validateReservationTimingWarning(), 100);
  });

  // Définir la date minimum selon le mode
  if (isEditMode()) {
    // En mode édition, permettre de sélectionner à partir d'aujourd'hui
    // (la validation des 24h se fera lors de la soumission)
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    dateInput.setAttribute("min", todayString);
  } else {
    // En mode création, minimum demain (24h)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split("T")[0];
    dateInput.setAttribute("min", tomorrowString);
  }

  // Définir la date maximum (3 mois)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split("T")[0];
  dateInput.setAttribute("max", maxDateString);
}

// Fonction pour afficher un avertissement visuel lors de la sélection (sans bloquer)
function validateReservationTimingWarning() {
  const dateInput = document.getElementById("DateInput");
  const selectHour = document.getElementById("selectHour");

  if (!dateInput || !selectHour || !dateInput.value || !selectHour.value) {
    removeTimingWarning();
    return;
  }

  const selectedDate = dateInput.value;
  const selectedTime = selectHour.value;

  const now = new Date();
  const reservationDateTime = new Date(`${selectedDate}T${selectedTime}`);
  const timeDiff = reservationDateTime.getTime() - now.getTime();
  const hoursUntilReservation = timeDiff / (1000 * 3600);

  if (hoursUntilReservation < 24) {
    showTimingWarning();
  } else {
    removeTimingWarning();
  }
}

// Fonction pour afficher l'avertissement de délai
function showTimingWarning() {
  // Vérifier si l'avertissement existe déjà
  if (document.getElementById("timing-warning")) return;

  const isEdit = isEditMode();
  const warningHTML = `
    <div id="timing-warning" class="alert alert-warning mt-3" role="alert">
      <h6><i class="fas fa-clock"></i> ⚠️ ${
        isEdit ? "Modification" : "Réservation"
      } de dernière minute</h6>
      <p class="mb-2">${
        isEdit
          ? "Les modifications de réservation"
          : "Les réservations en ligne"
      } ne sont possibles qu'au minimum 24 heures à l'avance.</p>
      <p class="mb-0"><strong>Pour cette ${
        isEdit ? "modification" : "réservation"
      }, vous devrez contacter directement le restaurant.</strong></p>
    </div>
  `;

  // Trouver où insérer l'avertissement (après les champs de date/heure)
  const formContainer = document.querySelector("form");
  if (formContainer) {
    // Insérer après le sélecteur d'heure
    const selectHour = document.getElementById("selectHour");
    if (selectHour) {
      const parentDiv = selectHour.closest(".mb-3") || selectHour.parentElement;
      parentDiv.insertAdjacentHTML("afterend", warningHTML);
    }
  }
}

// Fonction pour supprimer l'avertissement de délai
function removeTimingWarning() {
  const warning = document.getElementById("timing-warning");
  if (warning) {
    warning.remove();
  }
}

// Fonction pour vérifier si une réservation respecte le délai de 24h
function validateReservationTiming() {
  const dateInput = document.getElementById("DateInput");
  const selectHour = document.getElementById("selectHour");

  if (!dateInput || !selectHour || !dateInput.value || !selectHour.value) {
    return true; // Si les champs ne sont pas remplis, la validation générale s'en occupera
  }

  const selectedDate = dateInput.value;
  const selectedTime = selectHour.value;

  const now = new Date();
  const reservationDateTime = new Date(`${selectedDate}T${selectedTime}`);
  const timeDiff = reservationDateTime.getTime() - now.getTime();
  const hoursUntilReservation = timeDiff / (1000 * 3600); // Convertir en heures

  if (hoursUntilReservation < 24) {
    showContactRestaurantForBooking(selectedDate, selectedTime);
    return false;
  }

  return true;
}

// Fonction pour afficher la modal de contact pour une nouvelle réservation ou modification
// Fonction pour créer le contenu de la carte de réservation actuelle (mode édition)
function createCurrentReservationCard(editingReservation) {
  return `
    <div class="card mb-3">
      <div class="card-body">
        <h6 class="card-title">📋 Réservation actuelle :</h6>
        <ul class="list-unstyled mb-0">
          <li><strong>📅 Date actuelle :</strong> ${new Date(
            editingReservation.date
          ).toLocaleDateString("fr-FR")}</li>
          <li><strong>⏰ Heure actuelle :</strong> ${
            editingReservation.time
          }</li>
          <li><strong>👥 Personnes :</strong> ${editingReservation.guests}</li>
        </ul>
      </div>
    </div>
  `;
}

// Fonction pour créer le contenu de la carte de demande
function createRequestCard(isEdit, formattedDate, selectedTime) {
  return `
    <div class="card">
      <div class="card-body">
        <h6 class="card-title">📋 ${
          isEdit ? "Modification souhaitée" : "Votre demande de réservation"
        } :</h6>
        <ul class="list-unstyled mb-0">
          <li><strong>📅 ${
            isEdit ? "Nouvelle date" : "Date souhaitée"
          } :</strong> ${formattedDate}</li>
          <li><strong>⏰ ${
            isEdit ? "Nouvelle heure" : "Heure souhaitée"
          } :</strong> ${selectedTime}</li>
        </ul>
      </div>
    </div>
  `;
}

// Fonction pour créer l'URL de l'email
function createEmailUrl(
  isEdit,
  formattedDate,
  selectedTime,
  editingReservation
) {
  const subject = `Demande de ${
    isEdit ? "modification" : "réservation"
  } de dernière minute - ${formattedDate}`;

  let body = `Bonjour,%0A%0AJe souhaite ${
    isEdit
      ? "modifier ma réservation existante"
      : "effectuer une réservation de dernière minute"
  } :%0A`;

  if (isEdit) {
    body += `- Réservation actuelle : ${new Date(
      editingReservation.date
    ).toLocaleDateString("fr-FR")} à ${editingReservation.time} pour ${
      editingReservation.guests
    } personne(s)%0A`;
  }

  body += `- ${isEdit ? "Nouvelle date" : "Date"} : ${formattedDate}%0A`;
  body += `- ${isEdit ? "Nouvelle heure" : "Heure"} : ${selectedTime}%0A`;
  body += `- Nombre de personnes : ${
    isEdit ? editingReservation.guests : "[à préciser]"
  }%0A%0A`;
  body += `Merci de me confirmer ${
    isEdit ? "cette modification" : "la disponibilité"
  }.%0A%0ACordialement`;

  return `mailto:contact@quai-antique.fr?subject=${subject}&body=${body}`;
}

// Fonction pour créer les boutons de contact
function createContactButtons(
  isEdit,
  formattedDate,
  selectedTime,
  editingReservation
) {
  const emailUrl = createEmailUrl(
    isEdit,
    formattedDate,
    selectedTime,
    editingReservation
  );

  return `
    <div class="d-grid gap-2">
      <a href="tel:+33123456789" class="btn btn-success">
        <i class="fas fa-phone"></i> Appeler le restaurant
        <br><small>+33 1 23 45 67 89</small>
      </a>
      <a href="${emailUrl}" class="btn btn-primary">
        <i class="fas fa-envelope"></i> Envoyer un email
        <br><small>contact@quai-antique.fr</small>
      </a>
    </div>
  `;
}

// Fonction pour créer le contenu du footer de la modal
function createModalFooter(isEdit) {
  let footer =
    '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>';

  if (isEdit) {
    footer += `
      <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" onclick="cancelEdit()">
        Retourner à mes réservations
      </button>
    `;
  }

  return footer;
}

// Fonction pour créer le contenu complet de la modal
function createModalContent(
  isEdit,
  editingReservation,
  formattedDate,
  selectedTime
) {
  const currentReservationCard = isEdit
    ? createCurrentReservationCard(editingReservation)
    : "";
  const requestCard = createRequestCard(isEdit, formattedDate, selectedTime);
  const contactButtons = createContactButtons(
    isEdit,
    formattedDate,
    selectedTime,
    editingReservation
  );
  const modalFooter = createModalFooter(isEdit);

  return `
    <div class="modal fade" id="contactRestaurantBookingModal" tabindex="-1" aria-labelledby="contactRestaurantBookingModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="contactRestaurantBookingModalLabel">
              📞 ${isEdit ? "Modification" : "Réservation"} de dernière minute
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info" role="alert">
              <h6><i class="fas fa-clock"></i> Délai ${
                isEdit ? "de modification" : "de réservation"
              } non respecté</h6>
              <p class="mb-2">${
                isEdit
                  ? "Les modifications de réservation"
                  : "Les réservations en ligne"
              } ne sont possibles qu'au minimum 24 heures à l'avance.</p>
            </div>
            
            ${currentReservationCard}
            ${requestCard}

            <div class="mt-3">
              <h6>📞 Pour cette ${
                isEdit ? "modification" : "réservation"
              } de dernière minute, contactez directement le restaurant :</h6>
              ${contactButtons}
            </div>
            
            <div class="mt-3">
              <small class="text-muted">
                <i class="fas fa-info-circle"></i> 
                Pour vos prochaines ${
                  isEdit ? "modifications" : "réservations"
                }, pensez à ${
    isEdit ? "modifier" : "réserver"
  } au moins 24h à l'avance pour pouvoir utiliser le formulaire en ligne.
              </small>
            </div>
          </div>
          <div class="modal-footer">
            ${modalFooter}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Fonction pour nettoyer les champs du formulaire
function resetFormFields(isEdit) {
  if (!isEdit) {
    const dateInput = document.getElementById("DateInput");
    const selectHour = document.getElementById("selectHour");
    if (dateInput) dateInput.value = "";
    if (selectHour) selectHour.value = "";
  }
}

// Fonction principale simplifiée
function showContactRestaurantForBooking(selectedDate, selectedTime) {
  const formattedDate = new Date(selectedDate).toLocaleDateString("fr-FR");
  const isEdit = isEditMode();
  const editingReservation = getEditingReservation();

  // Créer le contenu de la modal
  const modalHTML = createModalContent(
    isEdit,
    editingReservation,
    formattedDate,
    selectedTime
  );

  // Supprimer toute modal existante
  const existingModal = document.getElementById(
    "contactRestaurantBookingModal"
  );
  if (existingModal) {
    existingModal.remove();
  }

  // Ajouter la modal au DOM
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Afficher la modal
  const modal = new bootstrap.Modal(
    document.getElementById("contactRestaurantBookingModal")
  );
  modal.show();

  // Supprimer la modal du DOM quand elle est fermée
  document
    .getElementById("contactRestaurantBookingModal")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });

  // Réinitialiser les champs du formulaire
  resetFormFields(isEdit);
}

// Fonction pour valider le nombre de convives
function validateGuests() {
  const guestsInput = document.getElementById("NbConvivesInput");
  if (!guestsInput) return;

  guestsInput.addEventListener("input", function () {
    const guests = parseInt(this.value);

    if (guests < 1) {
      this.setCustomValidity(
        "Le nombre de convives doit être d'au moins 1 personne."
      );
    } else if (guests > 12) {
      this.setCustomValidity(
        "Pour plus de 12 personnes, veuillez nous contacter directement."
      );
    } else {
      this.setCustomValidity("");
    }
  });

  // Limiter les valeurs
  guestsInput.setAttribute("min", "1");
  guestsInput.setAttribute("max", "12");
}

// Fonction pour gérer la soumission du formulaire
function setupFormSubmission() {
  const form = document.querySelector("form");
  if (!form) return;

  // Ajouter un bouton de soumission s'il n'existe pas
  let submitButton = form.querySelector(
    'button[type="submit"], input[type="submit"]'
  );
  if (!submitButton) {
    submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "btn btn-success btn-lg";
    submitButton.innerHTML = "✅ Confirmer la réservation";
    form.appendChild(submitButton);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Récupérer les données du formulaire
    const formData = {
      nom: document.getElementById("NomInput")?.value,
      prenom: document.getElementById("PrenomInput")?.value,
      allergies: document.getElementById("AllergieInput")?.value || "Aucune",
      guests: document.getElementById("NbConvivesInput")?.value,
      date: document.getElementById("DateInput")?.value,
      time: document.getElementById("selectHour")?.value,
      service: document.getElementById("midiRadio")?.checked ? "midi" : "soir",
    };

    // Validation
    if (!formData.date) {
      alert("⚠️ Veuillez sélectionner une date.");
      return;
    }

    if (!formData.guests || formData.guests < 1) {
      alert("⚠️ Veuillez indiquer le nombre de convives.");
      return;
    }

    // Vérifier le délai de 24h (pour nouvelle réservation ET modification)
    if (!validateReservationTiming()) {
      return; // La fonction validateReservationTiming affiche déjà la modal
    }

    // Simuler l'envoi de la réservation
    submitReservation(formData);
  });
}

// Fonction pour soumettre la réservation
function submitReservation(formData) {
  // Vérifier si on est en mode édition
  const editingReservation = getEditingReservation();
  const isEdit = editingReservation !== null;

  // Désactiver le bouton de soumission
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = isEdit
      ? "⏳ Modification en cours..."
      : "⏳ Envoi en cours...";
  }

  // Simuler un appel API
  setTimeout(() => {
    if (isEdit) {
      // Mode modification
      // Mettre à jour la réservation dans les données simulées
      const reservationIndex = reservationsData.findIndex(
        (r) => r.id === editingReservation.id
      );
      if (reservationIndex !== -1) {
        reservationsData[reservationIndex] = {
          ...reservationsData[reservationIndex],
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          allergies: formData.allergies,
          service: formData.service,
          userName: `${formData.firstName} ${formData.lastName}`,
        };
      }

      // 🚨 SÉCURITÉ: Ne jamais logger les données complètes du formulaire
      console.log("Réservation modifiée avec succès");

      alert(
        `✅ Réservation modifiée avec succès !\n\n` +
          `📅 Nouvelle date: ${new Date(formData.date).toLocaleDateString(
            "fr-FR"
          )}\n` +
          `⏰ Nouvelle heure: ${formData.time} (${formData.service})\n` +
          `👥 Personnes: ${formData.guests}\n` +
          `🚫 Allergies: ${formData.allergies}\n\n` +
          `Vous recevrez un email de confirmation de la modification sous peu.`
      );

      // Nettoyer le mode édition
      sessionStorage.removeItem("editingReservation");
    } else {
      // Mode création (comportement original)
      // 🚨 SÉCURITÉ: Ne jamais logger les données complètes du formulaire
      console.log("Réservation soumise avec succès");

      alert(
        `✅ Réservation confirmée !\n\n` +
          `📅 Date: ${new Date(formData.date).toLocaleDateString("fr-FR")}\n` +
          `⏰ Heure: ${formData.time} (${formData.service})\n` +
          `👥 Personnes: ${formData.guests}\n` +
          `🚫 Allergies: ${formData.allergies}\n\n` +
          `Vous recevrez un email de confirmation sous peu.`
      );
    }

    // Rediriger vers la liste des réservations
    if (typeof window.navigateTo === "function") {
      window.navigateTo("/allResa");
    } else {
      window.location.href = "/allResa";
    }
  }, 1000);
}

// Fonction d'initialisation
function initReservationForm() {
  console.log("Initialisation du formulaire de réservation...");

  // Vérifier si l'utilisateur est connecté
  if (!isConnected()) {
    console.error("Utilisateur non connecté - redirection nécessaire");
    return;
  }

  // Vérifier si on est en mode édition
  if (isEditMode()) {
    console.log("Mode édition détecté");
    prefillEditForm();
  } else {
    // Mode création normal
    prefillUserInfo();
  }

  // Initialiser les fonctionnalités
  updateAvailableHours();
  validateDate();
  validateGuests();
  setupFormSubmission();

  console.log("Formulaire de réservation initialisé avec succès");
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  // Vérifier si nous sommes sur la page de réservation
  if (
    window.location.pathname === "/reserver" ||
    document.body.innerHTML.includes("Réservation")
  ) {
    initReservationForm();
  }
});

// Initialiser dès que possible si la page est déjà chargée
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReservationForm);
} else {
  // DOM déjà chargé
  setTimeout(initReservationForm, 100);
}

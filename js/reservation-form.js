// Gestion de la page de réservation

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
  midiRadio.addEventListener("change", updateHours);
  soirRadio.addEventListener("change", updateHours);

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
  });

  // Définir la date minimum (aujourd'hui)
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  dateInput.setAttribute("min", todayString);

  // Définir la date maximum (3 mois)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split("T")[0];
  dateInput.setAttribute("max", maxDateString);
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

    // Simuler l'envoi de la réservation
    submitReservation(formData);
  });
}

// Fonction pour soumettre la réservation
function submitReservation(formData) {
  // Désactiver le bouton de soumission
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = "⏳ Envoi en cours...";
  }

  // Simuler un appel API
  setTimeout(() => {
    // En production, ceci serait un vrai appel API
    console.log("Réservation soumise:", formData);

    alert(
      `✅ Réservation confirmée !\n\n` +
        `📅 Date: ${new Date(formData.date).toLocaleDateString("fr-FR")}\n` +
        `⏰ Heure: ${formData.time} (${formData.service})\n` +
        `👥 Personnes: ${formData.guests}\n` +
        `🚫 Allergies: ${formData.allergies}\n\n` +
        `Vous recevrez un email de confirmation sous peu.`
    );

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

  // Initialiser les fonctionnalités
  prefillUserInfo();
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

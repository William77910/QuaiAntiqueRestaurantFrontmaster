console.log("🔑 Script signin.js chargé");

// Attendre que le DOM soit prêt avant d'accéder aux éléments
let mailInput, passwordInput, btnSignin;

// Initialiser les éléments une fois le DOM prêt
function initializeSigninElements() {
  mailInput = document.getElementById("EmailInput"); // Récupérer l'input email
  passwordInput = document.getElementById("PasswordInput"); // Récupérer l'input password
  btnSignin = document.getElementById("btnSignin"); // Récupérer le bouton de connexion

  console.log("🔍 Éléments signin trouvés:");
  console.log("- Email input:", !!mailInput);
  console.log("- Password input:", !!passwordInput);
  console.log("- Signin button:", !!btnSignin);

  if (btnSignin) {
    btnSignin.addEventListener("click", checkCredentials); // Ajouter un écouteur d'événement au bouton de connexion
    console.log("✅ Event listener ajouté au bouton signin");
  } else {
    console.error("❌ Bouton signin non trouvé !");
  }
}

// Initialiser dès que possible avec plusieurs tentatives
setTimeout(initializeSigninElements, 100);
setTimeout(initializeSigninElements, 500);
setTimeout(initializeSigninElements, 1000);

// Debug: vérifier si les éléments sont présents toutes les secondes
setInterval(() => {
  const btn = document.getElementById("btnSignin");
  if (!btn) {
    console.warn("⚠️ Bouton signin toujours introuvable");
  }
}, 2000);

// Vérifier si l'utilisateur a été redirigé depuis une tentative de réservation
document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("redirectFromReservation") === "true") {
    // Afficher un message informatif
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-info alert-dismissible fade show";
    alertDiv.innerHTML = `
      <strong>Connexion requise !</strong> Vous devez vous connecter pour accéder aux réservations.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Insérer l'alerte au début du formulaire
    const form = document.querySelector("form");
    if (form) {
      form.insertBefore(alertDiv, form.firstChild);
    }

    // Supprimer l'indicateur de redirection
    sessionStorage.removeItem("redirectFromReservation");
  }
});
// Fonction pour vérifier les identifiants de l'utilisateur

function checkCredentials(event) {
  if (event) event.preventDefault(); // Empêcher le comportement par défaut du formulaire

  console.log("🔐 Tentative de connexion...");
  console.log("📧 Email saisi:", mailInput.value);
  console.log("🔑 Mot de passe saisi:", passwordInput.value);

  // ici il faut appeler l'API pour vérifier les credentials en BDD

  // Utilisateurs de test avec leurs informations
  const testUsers = {
    "test@email.com": { password: "123", role: "client", name: "John Doe" },
    "admin@email.com": {
      password: "admin",
      role: "admin",
      name: "Administrateur",
    },
    "client2@email.com": {
      password: "marie",
      role: "client",
      name: "Marie Martin",
    },
    "client3@email.com": {
      password: "pierre",
      role: "client",
      name: "Pierre Dupont",
    },
  };

  const user = testUsers[mailInput.value];
  console.log("👤 Utilisateur trouvé:", user);

  if (user && passwordInput.value === user.password) {
    // Si les identifiants sont corrects
    console.log("✅ Connexion réussie pour:", user.name, "| Rôle:", user.role);
    alert(`Bienvenue ${user.name} !`);

    // Stocker l'email de l'utilisateur pour le filtrage des réservations
    sessionStorage.setItem("currentUserEmail", mailInput.value);
    console.log("💾 Email stocké dans sessionStorage:", mailInput.value);

    // Ici, vous pouvez stocker le token JWT dans le localStorage ou le sessionStorage
    // il faudra récupérer le vrai token
    const token = "mvorjavoja^vohjvôirvjn^rovn";
    setToken(token); // Appeler la fonction pour stocker le token
    console.log("🎫 Token stocké:", token);

    // Définir le rôle selon l'utilisateur
    setCookie(RoleCookieName, user.role, 7); // 7 jours de validité
    console.log("👥 Rôle défini:", user.role);

    // Vérification immédiate des cookies
    console.log("🔍 Vérification des cookies:");
    console.log("- Token récupéré:", getToken());
    console.log("- Rôle récupéré:", getRole());
    console.log("- Utilisateur connecté?", isConnected());

    // Vérifier s'il y a une page de destination spécifique après connexion
    const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
    sessionStorage.removeItem("redirectAfterLogin"); // Nettoyer le storage
    console.log("🔄 Redirection vers:", redirectTo);

    // Redirection vers la page appropriée en utilisant le système de routage SPA
    if (typeof window.navigateTo === "function") {
      window.navigateTo(redirectTo);
    } else {
      // Fallback si la fonction n'est pas disponible
      window.location.replace(redirectTo);
    }
  } else {
    console.log("❌ Échec de connexion");
    console.log("- Utilisateur trouvé?", !!user);
    if (user) {
      console.log(
        "- Mot de passe correct?",
        passwordInput.value === user.password
      );
      console.log("- Mot de passe attendu:", user.password);
    }
    mailInput.classList.add("is-invalid"); // Ajouter la classe is-invalid à l'input email
    passwordInput.classList.add("is-invalid"); // Ajouter la classe is-invalid à l'input password
  }
}

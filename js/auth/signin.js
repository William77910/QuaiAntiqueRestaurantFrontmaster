const mailInput = document.getElementById("EmailInput"); // Récupérer l'input email
const passwordInput = document.getElementById("PasswordInput"); // Récupérer l'input password
const btnSignin = document.getElementById("btnSignin"); // Récupérer le bouton de connexion

btnSignin.addEventListener("click", checkCredentials); // Ajouter un écouteur d'événement au bouton de connexion

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

  // ici il faut appeler l'API pour vérifier les credentials en BDD

  // Utilisateurs de test avec leurs informations
  const testUsers = {
    "test@email.com": { password: "123", role: "client", name: "John Doe" },
    "admin@email.com": { password: "admin", role: "admin", name: "Administrateur" },
    "client2@email.com": { password: "marie", role: "client", name: "Marie Martin" },
    "client3@email.com": { password: "pierre", role: "client", name: "Pierre Dupont" }
  };
  
  const user = testUsers[mailInput.value];
  
  if (user && passwordInput.value === user.password) {
    // Si les identifiants sont corrects
    alert(`Bienvenue ${user.name} !`);

    // Stocker l'email de l'utilisateur pour le filtrage des réservations
    sessionStorage.setItem('currentUserEmail', mailInput.value);

    // Ici, vous pouvez stocker le token JWT dans le localStorage ou le sessionStorage
    // il faudra récupérer le vrai token
    const token = "mvorjavoja^vohjvôirvjn^rovn";
    setToken(token); // Appeler la fonction pour stocker le token

    // Définir le rôle selon l'utilisateur
    setCookie(RoleCookieName, user.role, 7); // 7 jours de validité

    // Vérifier s'il y a une page de destination spécifique après connexion
    const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
    sessionStorage.removeItem("redirectAfterLogin"); // Nettoyer le storage

    // Redirection vers la page appropriée en utilisant le système de routage SPA
    if (typeof window.navigateTo === "function") {
      window.navigateTo(redirectTo);
    } else {
      // Fallback si la fonction n'est pas disponible
      window.location.replace(redirectTo);
    }
  } else {
    mailInput.classList.add("is-invalid"); // Ajouter la classe is-invalid à l'input email
    passwordInput.classList.add("is-invalid"); // Ajouter la classe is-invalid à l'input password
  }
}

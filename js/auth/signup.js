// Implétemter le JS de ma page

const inputNom = document.getElementById("NomInput"); // Récupérer l'élément input pour le nom
const inputPrenom = document.getElementById("PrenomInput"); // Récupérer l'élément input pour le prénom
const inputEmail = document.getElementById("EmailInput"); // Récupérer l'élément input pour l'email
const inputPassword = document.getElementById("PasswordInput"); // Récupérer l'élément input pour le mot de passe
const inputValidatePassword = document.getElementById("ValidatePasswordInput"); // Récupérer l'élément input pour la confirmation du mot de passe
const btnValidation = document.getElementById("btn-validation-inscription");

inputNom.addEventListener("keyup", validateForm); // Ajouter un écouteur d'événement pour la validation du formulaire
inputPrenom.addEventListener("keyup", validateForm); // Ajouter un écouteur d'événement pour la validation du formulaire
inputEmail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);
inputValidatePassword.addEventListener("keyup", validateForm);

// Fonction pour valider le formulaire
// Cette fonction est appelée lorsque l'utilisateur tape dans les champs de saisie
function validateForm() {
  const nomOk = validateRequired(inputNom); // Valider le champ requis
  const prenomOk = validateRequired(inputPrenom);
  const emailOk = validateEmail(inputEmail);
  const passwordOk = validatePassword(inputPassword); // Valider le mot de passe
  const passwordConfirmOk = validateComfirmationPassword(
    inputPassword,
    inputValidatePassword
  ); // Valider la confirmation du mot de passe

  if (nomOk && prenomOk && emailOk && passwordOk && passwordConfirmOk) {
    // Vérifier si tous les champs requis sont valides
    btnValidation.disabled = false;
    // Activer le bouton de validation si le formulaire est valide
  } else {
    btnValidation.disabled = true;
    // Désactiver le bouton de validation si le formulaire n'est pas valide
  }
}

function validateComfirmationPassword(inputPassword, inputvalidatePassword) {
  if (inputPassword.value == inputvalidatePassword.value) {
    // Vérifier si le mot de passe et la confirmation du mot de passe correspondent
    inputvalidatePassword.classList.add("is-valid"); // Ajouter la classe "is-valid" pour indiquer que le champ est valide
    inputvalidatePassword.classList.remove("is-invalid"); // Supprimer la classe "is-invalid" si elle existe
    return true;
  } else {
    inputvalidatePassword.classList.add("is-invalid"); // Ajouter la classe "is-invalid" pour indiquer que le champ est invalide
    inputvalidatePassword.classList.remove("is-valid"); // Supprimer la classe "is-valid" si elle existe
    return false;
  }
}

function validatePassword(input) {
  // Définir mon regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/; // Regex pour valider le mot de passe
  const passwordlUser = input.value; // Récupérer la valeur de l'input pawword
  if (passwordlUser.match(passwordRegex)) {
    // Vérifier si le password correspond au regex
    // C'est ok
    input.classList.add("is-valid"); // Ajouter la classe "is-valid" pour indiquer que le champ est valide
    input.classList.remove("is-invalid"); // Supprimer la classe "is-invalid" si elle existe
    return true;
  } else {
    // Afficher un message d'erreur
    input.classList.remove("is-valid"); // Supprimer la classe "is-valid" si elle existe
    input.classList.add("is-invalid"); // Ajouter la classe "is-invalid" pour indiquer que le champ est invalide
    return false;
  }
}

function validateEmail(input) {
  // Définir mon regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pour valider l'email
  const emailUser = input.value; // Récupérer la valeur de l'input email
  if (emailUser.match(emailRegex)) {
    // Vérifier si l'email correspond au regex
    // C'est ok
    input.classList.add("is-valid"); // Ajouter la classe "is-valid" pour indiquer que le champ est valide
    input.classList.remove("is-invalid"); // Supprimer la classe "is-invalid" si elle existe
    return true;
  } else {
    // Afficher un message d'erreur
    input.classList.remove("is-valid"); // Supprimer la classe "is-valid" si elle existe
    input.classList.add("is-invalid"); // Ajouter la classe "is-invalid" pour indiquer que le champ est invalide
    return false;
  }
}

function validateRequired(input) {
  if (input.value != "") {
    // Vérifier si le champ n'est pas vide
    // C'est ok
    input.classList.add("is-valid"); // Ajouter la classe "is-valid" pour indiquer que le champ est valide
    input.classList.remove("is-invalid"); // Supprimer la classe "is-invalid" si elle existe
    return true;
  } else {
    // Afficher un message d'erreur
    input.classList.remove("is-valid"); // Supprimer la classe "is-valid" si elle existe
    input.classList.add("is-invalid"); // Ajouter la classe "is-invalid" pour indiquer que le champ est invalide
    return false;
  }
}

// Ajouter un gestionnaire d'événement pour la soumission du formulaire
btnValidation.addEventListener("click", inscrireUtilisateur);

function inscrireUtilisateur(event) {
  event.preventDefault(); // Empêcher le comportement par défaut du formulaire

  // Récupérer les valeurs des champs
  const dataForm = {
    nom: inputNom.value,
    prenom: inputPrenom.value,
    email: inputEmail.value,
    password: inputPassword.value,
  };

  // Simuler l'inscription (à remplacer par un appel API réel)
  console.log("Données d'inscription:", dataForm);

  // Afficher un message de succès
  alert(
    "Inscription réussie ! Vous allez être redirigé vers la page d'accueil."
  );

  // Redirection vers la page d'accueil en utilisant le système de routage SPA
  if (typeof window.navigateTo === "function") {
    window.navigateTo("/");
  } else {
    // Fallback si la fonction n'est pas disponible
    window.location.replace("/");
  }
}

const tokenCookieName = "accesstoken"; // Nom du cookie pour le token d'accès (est: tokenCookieName)
const RoleCookieName = "role"; // Nom du cookie pour le rôle

// Fonction pour initialiser le bouton de déconnexion
function initSignoutButton() {
  const signoutBtn = document.getElementById("signout-btn");
  if (signoutBtn) {
    signoutBtn.addEventListener("click", signout);
  }
}

// Initialiser le bouton de déconnexion au chargement
initSignoutButton();

function getRole() {
  return getCookie(RoleCookieName); // Récupérer le rôle de l'utilisateur
}

function signout() {
  eraseCookie(tokenCookieName); // Supprimer le cookie du token d'accès
  eraseCookie(RoleCookieName); // Supprimer le cookie du rôle
  sessionStorage.removeItem("currentUserEmail"); // Supprimer l'email stocké
  sessionStorage.clear(); // Nettoyer tout le sessionStorage

  alert("Vous êtes déconnecté !"); // Alerte de déconnexion

  // Redirection vers la page d'accueil en utilisant le système de routage SPA
  if (typeof window.navigateTo === "function") {
    window.navigateTo("/");
  } else {
    // Fallback si la fonction n'est pas disponible
    window.location.replace("/");
  }
}

function setToken(token) {
  setCookie(tokenCookieName, token, 7); // 7 jours de validité
}

function getToken() {
  return getCookie(tokenCookieName); // Récupérer le token
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (const cookie of ca) {
    let c = cookie;
    while (c.startsWith(" ")) c = c.substring(1, c.length);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function isConnected() {
  const token = getToken();
  return token != null && token != undefined;
}

/* type d'utilisateur
disconnected
connected (admin ou client)
    - admin
    - client
*/
function showAndHideElementsForRoles() {
  const userConnected = isConnected(); // Vérifier si l'utilisateur est connecté
  const role = getRole(); // Récupérer le rôle de l'utilisateur

  let allElementsToEdit = document.querySelectorAll("[data-show]"); // Sélectionner tous les éléments à afficher/masquer

  allElementsToEdit.forEach((element) => {
    // Parcourir chaque élément
    // Réinitialiser l'affichage de l'élément
    element.classList.remove("d-none");

    switch (
      element.dataset.show // Vérifier le rôle de l'utilisateur
    ) {
      case "disconnected":
        if (userConnected) {
          element.classList.add("d-none"); // Masquer l'élément (d-none = display none)
        }
        break;
      case "connected":
        if (!userConnected) {
          // Vérifier si l'utilisateur est connecté
          element.classList.add("d-none"); // Masquer l'élément
        }
        break;
      case "admin":
        if (!userConnected || role != "admin") {
          // Vérifier si l'utilisateur est admin
          element.classList.add("d-none"); // Masquer l'élément
        }
        break;
      case "client":
        if (!userConnected || role != "client") {
          // Vérifier si l'utilisateur est client
          element.classList.add("d-none"); // Masquer l'élément
        }
        break;
    }
  });

  // Mettre à jour l'indicateur de l'utilisateur connecté
  updateCurrentUserIndicator();
}

// Fonction pour mettre à jour l'indicateur de l'utilisateur connecté
function updateCurrentUserIndicator() {
  const userInfo = document.getElementById("current-user-info");
  if (!userInfo) return;

  const userConnected = isConnected();
  const userRole = getRole();

  if (!userConnected) {
    userInfo.innerHTML = '<span class="badge bg-secondary">Non connecté</span>';
    return;
  }

  // Récupérer l'email de l'utilisateur
  const userEmail =
    sessionStorage.getItem("currentUserEmail") || "utilisateur@email.com";

  // Définir la couleur du badge selon le rôle
  let badgeClass = "bg-primary";
  let roleText = "Client";
  let icon = "👤";

  if (userRole === "admin") {
    badgeClass = "bg-success";
    roleText = "Administrateur";
    icon = "🔧";
  }

  userInfo.innerHTML = `
    <span class="badge ${badgeClass}">
      ${icon} ${roleText}
    </span><br>
    <small class="text-muted">${userEmail}</small>
  `;
}

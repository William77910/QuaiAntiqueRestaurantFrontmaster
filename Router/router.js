import Route from "./route.js"; // Importation de la classe Route
import { allRoutes, websiteName } from "./allRoutes.js"; // Importation des routes et du nom du site

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  // Récupération de l'URL actuelle
  let currentRoute = null; // Initialisation de la route actuelle à null

  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    // Parcours de toutes les routes
    if (element.url == url) {
      // Vérification si l'URL correspond à la route
      currentRoute = element; // Si oui, on l'assigne à la route actuelle
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return route404;
  }
};

// Fonction pour vérifier les autorisations d'accès
const checkRouteAuthorization = (route) => {
  const allRolesArrays = route.authorize;
  const path = window.location.pathname;

  if (allRolesArrays.length === 0) {
    return true; // Accessible à tous
  }

  if (allRolesArrays.includes("disconnected")) {
    // Page réservée aux utilisateurs déconnectés
    const connected = isConnected();
    if (connected) {
      redirectToHome();
      return false;
    }
  } else {
    // Page réservée aux utilisateurs connectés
    const connected = isConnected();
    if (!connected) {
      // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page de réservation,
      // le rediriger vers la page de connexion avec un paramètre
      if (path === "/reserver" || path === "/allResa") {
        sessionStorage.setItem("redirectFromReservation", "true");
        sessionStorage.setItem("redirectAfterLogin", path);
      }
      redirectToSignin();
      return false;
    }

    // Vérifier si le rôle de l'utilisateur est autorisé
    const userRole = getRole();
    if (!allRolesArrays.includes(userRole)) {
      // Si l'utilisateur n'a pas le bon rôle, rediriger vers l'accueil
      redirectToHome();
      return false;
    }
  }

  return true;
}; // Fonction pour rediriger vers la page d'accueil
const redirectToHome = () => {
  if (typeof window.navigateTo === "function") {
    window.navigateTo("/");
  } else {
    window.location.replace("/");
  }
};

// Fonction pour rediriger vers la page de connexion
const redirectToSignin = () => {
  if (typeof window.navigateTo === "function") {
    window.navigateTo("/signin");
  } else {
    window.location.replace("/signin");
  }
};

// Fonction pour supprimer les anciens scripts de page
const removeOldPageScripts = () => {
  const existingPageScripts = document.querySelectorAll(
    "script[data-page-script]"
  );
  existingPageScripts.forEach((script) => script.remove());
};

// Fonction pour initialiser les pages spécifiques
const initializeSpecificPages = (pathJS) => {
  if (
    pathJS.includes("account.js") &&
    typeof window.initializeAccountPage === "function"
  ) {
    setTimeout(window.initializeAccountPage, 100);
  }

  if (
    pathJS.includes("reservations-manager.js") &&
    typeof window.initializeReservationsPage === "function"
  ) {
    setTimeout(window.initializeReservationsPage, 100);
  }

  if (
    pathJS.includes("galerie-admin.js") &&
    typeof window.initGalleryAdmin === "function"
  ) {
    setTimeout(window.initGalleryAdmin, 100);
  }

  if (
    pathJS.includes("carte-admin.js") &&
    typeof window.initCarteAdmin === "function"
  ) {
    setTimeout(window.initCarteAdmin, 100);
  }
};

// Fonction pour charger le script JavaScript d'une page
const loadPageScript = (pathJS) => {
  const scriptTag = document.createElement("script");
  scriptTag.setAttribute("type", "text/javascript");
  scriptTag.setAttribute("src", pathJS);
  scriptTag.setAttribute("data-page-script", "true");

  scriptTag.onload = function () {
    initializeSpecificPages(pathJS);
  };

  document.querySelector("body").appendChild(scriptTag);
};

// Fonction pour charger le contenu de la page

const LoadContentPage = async () => {
  const path = window.location.pathname;

  const actualRoute = getRouteByUrl(path);

  // Vérification des autorisations
  if (!checkRouteAuthorization(actualRoute)) {
    return; // Arrêter l'exécution si non autorisé
  }

  try {
    // Récupération du contenu HTML
    const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
    // Ajout du contenu HTML à l'élément avec l'ID "main-page"
    document.getElementById("main-page").innerHTML = html;

    // Supprimer les anciens scripts
    removeOldPageScripts();

    // Charger le script JavaScript si spécifié
    if (actualRoute.pathJS !== "") {
      loadPageScript(actualRoute.pathJS);
    }
    // Mise à jour du titre et des éléments de l'interface
    document.title = actualRoute.title + " - " + websiteName;
    showAndHideElementsForRoles();

    if (typeof initSignoutButton === "function") {
      initSignoutButton();
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la page:", error);
  }
}; // Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event.preventDefault();
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", event.currentTarget.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

// Fonction wrapper pour les appels onclick avec événement
const route = (clickEvent) => {
  // Si l'événement est passé, l'utiliser directement
  if (clickEvent) {
    routeEvent(clickEvent);
  } else {
    console.error("Aucun événement fourni pour la navigation");
  }
};
// Fonction pour naviguer programmatiquement vers une route
const navigateTo = (url) => {
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", url);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction route (wrapper) pour les onclick
window.route = route;
// Assignation de la fonction routeEvent pour les addEventListener
window.routeEvent = routeEvent;
// Assignation de la fonction navigateTo à la propriété navigateTo de la fenêtre
window.navigateTo = navigateTo;
// Chargement du contenu de la page au chargement initial
LoadContentPage();

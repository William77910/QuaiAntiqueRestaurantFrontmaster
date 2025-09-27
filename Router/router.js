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

// Fonction pour charger le contenu de la page

const LoadContentPage = async () => {
  // Récupération de l'URL actuelle
  const path = window.location.pathname; // Récupération du chemin de l'URL
  const actualRoute = getRouteByUrl(path); // Récupération de la route correspondante

  // Vérification des autorisations d'accès à la page
  const allRolesArrays = actualRoute.authorize; // Récupération des rôles autorisés

  if (allRolesArrays.length > 0) {
    // Vérification des autorisations
    if (allRolesArrays.includes("disconnected")) {
      // Vérification si l'utilisateur est déconnecté
      if (isConnected()) {
        // Si l'utilisateur est connecté, redirection vers la page d'accueil
        if (typeof window.navigateTo === "function") {
          window.navigateTo("/");
        } else {
          window.location.replace("/");
        }
        return; // Arrêter l'exécution
      }
    } else {
      const roleUser = getRole(); // Récupération du rôle de l'utilisateur
      if (!allRolesArrays.includes(roleUser)) {
        // Vérification si le rôle de l'utilisateur est autorisé

        // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page de réservation,
        // le rediriger vers la page de connexion avec un paramètre
        if (!isConnected() && (path === "/reserver" || path === "/allResa")) {
          // Stocker temporairement l'information de redirection
          sessionStorage.setItem("redirectFromReservation", "true");
          sessionStorage.setItem("redirectAfterLogin", path);
          if (typeof window.navigateTo === "function") {
            window.navigateTo("/signin");
          } else {
            window.location.replace("/signin");
          }
        } else {
          // Sinon, redirection vers la page d'accueil
          if (typeof window.navigateTo === "function") {
            window.navigateTo("/");
          } else {
            window.location.replace("/");
          }
        }
        return; // Arrêter l'exécution
      }
    }
  }

  // Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text()); // Récupération du contenu HTML

  // Ajout du contenu HTML à l'élément avec l'ID "main-page"
  document.getElementById("main-page").innerHTML = html; // Ajout du contenu HTML à l'élément avec l'ID "main-page"

  // Supprimer les anciens scripts de page pour éviter les conflits
  const existingPageScripts = document.querySelectorAll(
    "script[data-page-script]"
  );
  existingPageScripts.forEach((script) => script.remove());

  // Ajout du contenu JavaScript
  if (actualRoute.pathJS != "") {
    // Vérification si un fichier JavaScript est spécifié
    // Création d'une balise script
    const scriptTag = document.createElement("script"); // Création d'une balise script
    scriptTag.setAttribute("type", "text/javascript"); // Définition du type de la balise script
    scriptTag.setAttribute("src", actualRoute.pathJS); // Définition de la source du script
    scriptTag.setAttribute("data-page-script", "true"); // Marqueur pour identifier les scripts de page

    // Ajouter un événement de chargement pour initialiser la page si nécessaire
    scriptTag.onload = function () {
      // Appeler l'initialisation spécifique pour la page account
      if (
        actualRoute.pathJS.includes("account.js") &&
        typeof window.initializeAccountPage === "function"
      ) {
        console.log("🔄 Appel de l'initialisation account depuis le router");
        setTimeout(window.initializeAccountPage, 100);
      }

      // Appeler l'initialisation spécifique pour la page des réservations
      if (
        actualRoute.pathJS.includes("reservations-manager.js") &&
        typeof window.initializeReservationsPage === "function"
      ) {
        console.log(
          "🔄 Appel de l'initialisation réservations depuis le router"
        );
        setTimeout(window.initializeReservationsPage, 100);
      }
    };

    // Ajout de la balise script au corps du document
    document.querySelector("body").appendChild(scriptTag); // Ajout de la balise script au corps du document
  }

  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName; // Mise à jour du titre de la page avec le nom du site
  // Afficher ou masquer les éléments en fonction du rôle
  showAndHideElementsForRoles(); // Fonction pour afficher ou masquer les éléments en fonction du rôle de l'utilisateur
  // Réinitialiser le bouton de déconnexion
  if (typeof initSignoutButton === "function") {
    initSignoutButton();
  }
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", event.target.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
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
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Assignation de la fonction navigateTo à la propriété navigateTo de la fenêtre
window.navigateTo = navigateTo;
// Chargement du contenu de la page au chargement initial
LoadContentPage();

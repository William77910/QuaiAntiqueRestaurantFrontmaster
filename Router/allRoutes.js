import Route from "./route.js";
//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/galerie", "La galerie", "/pages/galerie.html", []),
    new Route("/carte", "La carte", "/pages/carte.html", []),
    new Route("/signin", "Connexion", "/pages/authentification/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "Inscription", "/pages/authentification/signup.html", ["disconnected"], "/js/auth/signup.js"),
    new Route("/account", "Mon compte", "/pages/authentification/account.html", ["client", "admin"]),
    new Route("/editPassword", "Changement de mot de passe", "/pages/authentification/editPassword.html", ["client", "admin"]),
    new Route("/allResa", "Vos réservations", "/pages/reservations/allResa.html", ["client", "admin"]),
    new Route("/reserver", "Réserver", "/pages/reservations/reserver.html", ["client"]),];
//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";
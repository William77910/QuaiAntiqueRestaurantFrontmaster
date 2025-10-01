export default class Route {
  constructor(url, title, pathHtml, authorize, pathJS = "") {
    this.url = url;
    this.title = title;
    this.pathHtml = pathHtml;
    this.pathJS = pathJS;
    this.authorize = authorize;
  }

  // Méthode pour vérifier si un rôle est autorisé à accéder à cette route
  isAuthorized(userRole) {
    if (this.authorize.length === 0) return true; // Accessible à tous
    return this.authorize.includes(userRole);
  }
}

/*
[] -> Tout le monde peut y accéder
["disconnected"] -> Réserver aux utilisateurs déconnecté 
["client"] -> Réserver aux utilisateurs avec le rôle client 
["admin"] -> Réserver aux utilisateurs avec le rôle admin 
["admin", "client"] -> Réserver aux utilisateurs avec le rôle client OU admin
*/

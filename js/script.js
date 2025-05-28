
const tokenCookieName = "accesstoken";                          // Nom du cookie pour le token d'accès (est: tokenCookieName)
const signoutBtn = document.getElementById("signout-btn");      // Récupérer le bouton de déconnexion
const RoleCookieName = "role";                                  // Nom du cookie pour le rôle

signoutBtn.addEventListener("click", signout);                  // Ajouter un écouteur d'événement au bouton de déconnexion

function getRole(){
    return getCookie(RoleCookieName);                           // Récupérer le rôle de l'utilisateur
}


function signout(){
    eraseCookie(tokenCookieName);                               // Supprimer le cookie du token d'accès
    alert("Vous êtes déconnecté !");                            // Alerte de déconnexion
    eraseCookie(RoleCookieName);                                // Supprimer le cookie du rôle
    window.location.replace("/");                               // Rediriger vers la page d'accueil
}

function setToken(token){
    setCookie(tokenCookieName, token, 7);                       // 7 jours de validité
}

function getToken(){
    return getCookie(tokenCookieName);                          // Récupérer le token
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isConnected(){
    if(getToken() == null || getToken() == undefined){
        return false;                                                  // L'utilisateur n'est pas connecté
    }
    else{
        return true;                                                   // L'utilisateur est connecté
    }
}

if(isConnected()){
    alert("Je suis connecté");
}
else{
    alert("Je ne suis pas connecté");
}


/* type d'utilisateur
disconnected
connected (admin ou client)
    - admin
    - client
*/
function showAndHideElementsForRoles(){
    const userConnected = isConnected();                              // Vérifier si l'utilisateur est connecté
    const role = getRole();                                           // Récupérer le rôle de l'utilisateur

    let allElementsToEdit = document.querySelectorAll('[data-show]'); // Sélectionner tous les éléments à afficher/masquer

    allElementsToEdit.forEach(element =>{                             // Parcourir chaque élément
        switch(element.dataset.show){                                 // Vérifier le rôle de l'utilisateur
            case 'disconnected':
                if(userConnected){
                    element.classList.add("d-none");                  // Masquer l'élément (d-none = display none)
                }
                break;
            case 'connected':
                if(!userConnected){                                   // Vérifier si l'utilisateur est connecté
                    element.classList.add("d-none");                  // Masquer l'élément
                }
                break;
            case 'admin':
                if(!userConnected || role != "admin"){               // Vérifier si l'utilisateur est admin
                    element.classList.add("d-none");                 // Masquer l'élément
                }
                break;
            case 'client':
                if(!userConnected || role != "client"){             // Vérifier si l'utilisateur est client
                    element.classList.add("d-none");                // Masquer l'élément
                }
                break;
            }
        })
    }
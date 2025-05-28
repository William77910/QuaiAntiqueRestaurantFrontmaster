const mailInput = document.getElementById("EmailInput");            // Récupérer l'input email
const passwordInput = document.getElementById("PasswordInput");     // Récupérer l'input password
const btnSignin = document.getElementById("btnSignin");             // Récupérer le bouton de connexion

btnSignin.addEventListener("click", checkCredentials);              // Ajouter un écouteur d'événement au bouton de connexion
// Fonction pour vérifier les identifiants de l'utilisateur

function checkCredentials(){
    // ici il faut appeler l'API pour vérifier les credentials en BDD

    if(mailInput.value == "test@email.com" && passwordInput.value == "123"){
        // Si les identifiants sont corrects, rediriger vers la page d'accueil
        alert("Vous êtes connecté !");

        // Ici, vous pouvez stocker le token JWT dans le localStorage ou le sessionStorage
        // il faudra récupérer le vrai token
        const token = "mvorjavoja^vohjvôirvjn^rovn"
        setToken(token);                                           // Appeler la fonction pour stocker le token
        // placer ce token en cookie

        setCookie(RoleCookieName, "admin", 7);                     // 7 jours de validité
        window.location.replace("/");                              // Rediriger vers la page d'accueil
    }
    else{
        mailInput.classList.add("is-invalid");                    // Ajouter la classe is-invalid à l'input email
        passwordInput.classList.add("is-invalid");                // Ajouter la classe is-invalid à l'input password
    }
}
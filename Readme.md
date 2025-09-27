
LES INFORMATIONS CI-SDESSOUS SNT FICTIVES, LE SITE N4EST PAS TERMINE.

# Bienvenue sur le Quai Antique

Le Quai Antique est un restaurant gastronomique fictif, ayant pour site web : https:/

## Spécifications Techniques

**Technologie**

- PHP >= 8
- Composer >= 2
- Framework : Symfony
- Base de donnée : mySql 5.7

**Front**

- HTML5 (Twig)
- SCSS
- Bootstrap
- Javascript
**Back**

- Minimum PHP 8.0
- Symfony 6.2
- mySql 5.7

## Installation Locale

Pour installer le projet en local, suivez les étapes ci-dessous :

1. Clonez le dépôt :

```bash
git clone git@github.com:william77910/Quai-Antique.git
```

2. Installez les dépendances PHP avec Composer :

```bash
composer install
```

3. Installez les dépendances Node.js avec npm :

```bash
npm install
```

4. La base de données se trouve dans le fichier `.env.local` (me contacter pour y avoir accès), vous n’avez donc pas besoin de la créer.

5. Pour configurer le serveur SMTP, remplissez vos identifiants et mot de passe (par exemple ceux de Mailtrap) dans le fichier `.env.local` .

6. Utilisant Webpack Encore, il faut construire les assets avec npm :

```bash
npm run build
```

7. Installez les assets d’EasyAdmin :

```bash
php bin/console assets:install --symlink public
```

8. Démarrez le serveur local avec Symfony CLI :

```bash
symfony serve -d
```

9. Pour déployer le site complètement en local, vous aurez besoin d’un serveur local tel que MAMP, XAMPP ou WAMP. Démarrez ce serveur pour accéder au site sur votre machine.

## Création Administrateur

Pour créer un compte administrateur, suivez les étapes ci-dessous :

1. Ouvrez le fichier `src/Controller/UserController ` et décommentez la route `/administrateur` ainsi que la fonction associée.

2. Remplissez vos informations :
   **Attention à certaines restrictions**

   - Mot de passe : 14 caractères contenant des chiffres, des majuscules, des minuscules et des caractères spéciaux
   - Numéro de téléphone : format +33625122512

3. Accédez à l’URL https://127.0.0.1:8000/administrateur pour créer votre compte.

4. Vous pouvez maintenant vous connecter à l’URL https://127.0.0.1:8000/connexion et expérimenter votre expérience en tant qu’administrateur.

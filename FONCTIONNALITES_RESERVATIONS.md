# 🔄 Fonctionnalités de Modification et Annulation des Réservations

## ✅ Nouvelles fonctionnalités ajoutées

### 📋 Pour les clients connectés

#### **Modification de réservation (≥ 24h avant)**

- ✏️ Bouton "Modifier" disponible si > 24h avant la date de réservation
- Redirection vers le formulaire de réservation pré-rempli
- Validation et mise à jour des données
- Confirmation de modification

#### **Annulation de réservation (≥ 24h avant)**

- ❌ Bouton "Annuler" disponible si > 24h avant la date de réservation
- Demande de confirmation avant annulation
- Mise à jour du statut en "annulée"
- Message de confirmation

#### **Contact restaurant (< 24h avant)**

- 🔒 Boutons "Modifier" et "Annuler" remplacés par des boutons de contact
- Modal d'information expliquant le délai dépassé
- Liens directs pour téléphoner ou envoyer un email
- Email pré-rempli avec les détails de la réservation

### 🔧 Modifications techniques

#### **Fichiers modifiés :**

1. **`js/reservations-manager.js`**

   - Ajout fonction `canModifyReservation()` pour vérifier le délai de 24h
   - Modification `generateReservationHTML()` pour les nouveaux boutons
   - Ajout gestionnaires d'événements pour clients
   - Fonctions `editClientReservation()`, `cancelClientReservation()`, `showContactRestaurantModal()`

2. **`js/reservation-form.js`**

   - Support du mode édition avec `isEditMode()` et `getEditingReservation()`
   - Fonction `prefillEditForm()` pour pré-remplir le formulaire
   - Modification `submitReservation()` pour gérer création et modification
   - Fonction `cancelEdit()` pour annuler l'édition

3. **`scss/main.scss`**
   - Styles pour les nouveaux boutons de réservation
   - Effets hover et transitions
   - Styles pour la modal de contact restaurant

### 🎯 Logique de fonctionnement

#### **Calcul des 24 heures :**

```javascript
function canModifyReservation(reservationDate, reservationTime) {
  const now = new Date();
  const reservationDateTime = new Date(`${reservationDate}T${reservationTime}`);
  const timeDiff = reservationDateTime.getTime() - now.getTime();
  const hoursUntilReservation = timeDiff / (1000 * 3600);

  return hoursUntilReservation >= 24;
}
```

#### **États des boutons selon le délai :**

- **≥ 24h** : Boutons ✏️ "Modifier" et ❌ "Annuler" actifs
- **< 24h** : Boutons ✏️ et ❌ remplacés par des boutons de contact grisés
- **Réservation annulée** : Boutons de modification désactivés

### 📞 Contact restaurant

#### **Informations de contact :**

- **Téléphone :** +33 1 23 45 67 89
- **Email :** contact@quai-antique.fr

#### **Email pré-rempli inclut :**

- Objet : "Demande de modification/annulation de réservation - [DATE]"
- Corps avec détails de la réservation
- Demande de confirmation

### 🔐 Sécurité et UX

- ✅ Validation côté client du délai de 24h
- ✅ Confirmations avant annulation
- ✅ Messages d'information clairs
- ✅ Transitions visuelles fluides
- ✅ Gestion des erreurs
- ✅ Logs sécurisés sans données sensibles

### 🚀 Test de la fonctionnalité

1. **Connectez-vous en tant que client**
2. **Allez sur "Vos réservations"**
3. **Testez avec différentes dates :**
   - Réservation dans > 24h → boutons actifs
   - Réservation dans < 24h → modal de contact
4. **Testez la modification :** formulaire pré-rempli
5. **Testez l'annulation :** confirmation et mise à jour

---

## 📋 Statut des réservations

- **confirmée** : Réservation active, peut être modifiée/annulée
- **en attente** : Réservation en cours de validation
- **annulée** : Réservation annulée par le client

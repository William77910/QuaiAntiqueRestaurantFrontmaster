// Système de logging sécurisé
// En production, mettre DEBUG_MODE à false

const DEBUG_MODE = false; // ✅ Sécurisé pour la production !

// Fonction de logging sécurisée
window.secureLog = {
  // Log standard (à utiliser pour le debugging non-sensible)
  debug: function (...args) {
    if (DEBUG_MODE) {
      console.log("[DEBUG]", ...args);
    }
  },

  // Log d'informations (non-sensibles)
  info: function (...args) {
    if (DEBUG_MODE) {
      console.info("[INFO]", ...args);
    }
  },

  // Log d'erreurs (peut être gardé en production)
  error: function (...args) {
    console.error("[ERROR]", ...args);
  },

  // Log d'avertissements (peut être gardé en production)
  warn: function (...args) {
    console.warn("[WARN]", ...args);
  },

  // JAMAIS utiliser en production - données sensibles
  sensitive: function (...args) {
    if (DEBUG_MODE) {
      console.log("[SENSITIVE - DEV ONLY]", ...args);
    }
  },
};

// Fonction pour désactiver complètement les logs en production
function disableLogging() {
  if (!DEBUG_MODE) {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    // Garder console.error et console.warn pour la production
  }
}

// Auto-désactivation si on détecte qu'on est en production
if (
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  // Probablement en production, désactiver les logs de debug
  disableLogging();
}

// Appel immédiat pour désactiver selon DEBUG_MODE
disableLogging();

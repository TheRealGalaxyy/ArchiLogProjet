import { Board } from "../../model/board.js";
import { Card } from "../../model/card.js";
import { List } from "../../model/list.js";
import { BoardService } from "../../app/boardService.js";
import { StorageService } from "../../app/storageService.js";
import { DOMAdapter } from "../../infrastructure/domAdapter.js";

// Fonction pour vérifier la session utilisateur
const checkSession = async () => {
  try {
    const response = await fetch(
      "http://localhost/archilog/backend/public/checkSession.php"
    );
    const data = await response.json();

    if (data.loggedIn) {
      // Si l'utilisateur est connecté, charger son tableau
      const storage = new StorageService();
      const boardService = new BoardService(storage);
      const board = await boardService.loadBoard(data.user.id); // Charger le tableau de l'utilisateur
      const domAdapter = new DOMAdapter(boardService);

      if (data.loggedIn) {
        document.getElementById("user-name").innerText = data.user.name;
      }

      // Afficher le tableau
      domAdapter.renderBoard(board);

      // Gestion des événements
      const addListButton = document.getElementById("add-list");
      addListButton.addEventListener("click", () => {
        domAdapter.openAddListModal();
      });

      document
        .getElementById("menu-toggle")
        .addEventListener("click", function () {
          document.getElementById("menu").classList.toggle("show");
        });
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      window.location.href = "/pages/html/login.html";
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la session :", error);
    alert("Une erreur est survenue. Veuillez réessayer.");
  }
};

// Exécuter la vérification de la session au chargement de la page
checkSession();

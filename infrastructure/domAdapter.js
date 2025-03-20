export class DOMAdapter {
  constructor(boardService) {
    this.boardService = boardService;
  }

  renderBoard(board) {
    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";

    board.lists.forEach((list, listIndex) => {
      const listElement = document.createElement("div");
      listElement.className = "list";
      listElement.innerHTML = `<h3>${list.name}</h3>`;

      // Bouton pour supprimer la liste
      const deleteListBtn = document.createElement("button");
      deleteListBtn.innerText = "Supprimer la liste";
      deleteListBtn.addEventListener("click", () => {
        this.boardService.removeList(listIndex);
        this.renderBoard(this.boardService.board);
      });
      listElement.appendChild(deleteListBtn);

      list.cards.forEach((card, cardIndex) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.innerHTML = `<p>${card.title}</p>`;

        // Rendre la carte draggable
        cardElement.setAttribute("draggable", "true");

        cardElement.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("cardIndex", cardIndex);
          e.dataTransfer.setData("listIndex", listIndex);
          e.target.style.opacity = 0.5;
        });

        cardElement.addEventListener("dragend", (e) => {
          e.target.style.opacity = 1;
        });

        // Ouvrir la modale au clic sur la carte
        cardElement.addEventListener("click", () => {
          this.showCardModal(listIndex, cardIndex, card);
        });

        listContent.appendChild(cardElement);
      });

      // Créer les boutons pour ajouter une carte et supprimer la liste
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "buttons-container";

      // Bouton pour ajouter une carte
      const addCardBtn = document.createElement("button");
      addCardBtn.innerText = "Ajouter une carte";
      addCardBtn.addEventListener("click", () => {
        this.openAddCardModal(listIndex);
      });
      addCardBtn.style.marginBottom = "10px";
      buttonsContainer.appendChild(addCardBtn);

      // Bouton pour supprimer la liste
      const deleteListBtn = document.createElement("button");
      deleteListBtn.innerText = "Supprimer la liste";
      deleteListBtn.style.backgroundColor = "red";
      deleteListBtn.style.color = "white";
      deleteListBtn.style.marginBottom = "10px";
      deleteListBtn.addEventListener("click", () => {
        this.boardService.removeList(listIndex);
        this.renderBoard(this.boardService.board);
      });
      buttonsContainer.appendChild(deleteListBtn);

      // Ajouter le contenu de la liste et les boutons à la liste
      listElement.appendChild(listContent);
      listElement.appendChild(buttonsContainer);

      boardContainer.appendChild(listElement);
    });
  }

  showCardModal(listIndex, cardIndex, card) {
    const modal = document.getElementById("card-modal");
    document.getElementById("modal-title").innerText = card.title;
    document.getElementById("modal-description").innerText = card.description;

    const modalContent = document.querySelector(".modal-content");

    // Supprimer l'ancien bouton Modifier s'il existe
    const oldEditBtn = document.getElementById("edit-card-btn");
    if (oldEditBtn) oldEditBtn.remove();

    // Ajouter le bouton Modifier
    let editCardBtn = document.createElement("button");
    editCardBtn.id = "edit-card-btn";
    editCardBtn.innerText = "Modifier la carte";
    editCardBtn.style.backgroundColor = "orange";
    editCardBtn.style.color = "white";
    editCardBtn.style.marginBottom = "10px";

    editCardBtn.addEventListener("click", () => {
      // Appeler la méthode pour ouvrir le modal d'édition de la carte
      this.openEditCardModal(listIndex, cardIndex, card);
    });

    modalContent.appendChild(editCardBtn);

    // Gestion de la suppression de la carte
    const deleteCardBtn = document.getElementById("delete-card");
    deleteCardBtn.style.backgroundColor = "red";
    deleteCardBtn.style.color = "white";
    deleteCardBtn.onclick = () => {
      this.boardService.removeCard(listIndex, cardIndex);
      this.renderBoard(this.boardService.board);
      modal.style.display = "none";
    };

    // Affichage du modal
    modal.style.display = "flex";

    // Empêcher la fermeture si on clique dans le contenu
    modalContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Fermer la modale en cliquant en dehors du contenu
    modal.addEventListener("click", (event) => {
      modal.style.display = "none";
    });

    // Fermer la modale en cliquant sur la croix
    document.querySelector(".close").onclick = () => {
      modal.style.display = "none";
    };
  }

  openAddCardModal(listIndex) {
    const modal = document.getElementById("add-card-modal");
    const saveButton = document.getElementById("save-card");
    const closeButton = document.querySelector("#add-card-modal .close");
    const cancelButton = document.getElementById("cancel-card");

    // Réinitialiser les champs
    document.getElementById("card-title").value = "";
    document.getElementById("card-description").value = "";

    // Afficher le modal
    modal.style.display = "flex";

    // Ajouter la carte lors du clic sur "Ajouter"
    saveButton.onclick = () => {
      const title = document.getElementById("card-title").value.trim();
      const description = document
        .getElementById("card-description")
        .value.trim();

      if (title) {
        this.boardService.addCard(listIndex, title, description);
        this.renderBoard(this.boardService.board);
        modal.style.display = "none"; // ✅ Fermer le modal après l'ajout
      } else {
        alert("Le titre est obligatoire !");
      }
    };

    // Fermer le modal en cliquant sur la croix
    closeButton.onclick = () => {
      modal.style.display = "none";
    };

    // Fermer le modal en cliquant sur "Annuler"
    cancelButton.onclick = () => {
      modal.style.display = "none";
    };

    // Fermer le modal en cliquant en dehors
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }
  openAddListModal() {
    const modal = document.getElementById("add-list-modal");
    const saveButton = document.getElementById("save-list");
    const closeButton = document.querySelector("#add-list-modal .close");
    const cancelButton = document.getElementById("cancel-list");

    // Réinitialiser le champ
    document.getElementById("list-name").value = "";

    // Afficher le modal
    modal.style.display = "flex";

    // Ajouter la liste lors du clic sur "Ajouter"
    saveButton.onclick = () => {
      const listName = document.getElementById("list-name").value.trim();

      if (listName) {
        this.boardService.addList(listName);
        this.renderBoard(this.boardService.board);
        modal.style.display = "none"; // ✅ Fermer le modal après l'ajout
      } else {
        alert("Le nom de la liste est obligatoire !");
      }
    };

    // Fermer le modal en cliquant sur la croix
    closeButton.onclick = () => {
      modal.style.display = "none";
    };

    // Fermer le modal en cliquant sur "Annuler"
    cancelButton.onclick = () => {
      modal.style.display = "none";
    };

    // Fermer le modal en cliquant en dehors
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  openEditCardModal(listIndex, cardIndex, card) {
    const modal = document.getElementById("edit-card-modal");
    const saveButton = document.getElementById("save-edited-card");
    const closeButton = document.querySelector("#edit-card-modal .close");
    const cancelButton = document.getElementById("cancel-edit-card");

    // Pré-remplir les champs avec les données actuelles de la carte
    document.getElementById("edit-card-title").value = card.title;
    document.getElementById("edit-card-description").value = card.description;

    // Afficher le modal
    modal.style.display = "flex";

    // Sauvegarder les modifications lors du clic sur "Sauvegarder"
    saveButton.onclick = () => {
      const newTitle = document.getElementById("edit-card-title").value.trim();
      const newDescription = document
        .getElementById("edit-card-description")
        .value.trim();

      if (newTitle) {
        // Mettre à jour la carte avec les nouvelles informations
        card.title = newTitle;
        card.description = newDescription;
        this.boardService.storage.saveBoard(this.boardService.board);
        this.renderBoard(this.boardService.board);
        modal.style.display = "none"; // ✅ Fermer le modal après la sauvegarde
      } else {
        alert("Le titre est obligatoire !");
      }
    };

    // Fermer le modal en cliquant sur la croix
    closeButton.onclick = () => {
      modal.style.display = "none";
    };

    // Fermer le modal en cliquant sur "Annuler"
    cancelButton.onclick = () => {
      modal.style.display = "none";
    };

    // Fermer le modal en cliquant en dehors
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }
}

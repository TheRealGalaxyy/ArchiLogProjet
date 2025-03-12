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

      // Permettre le drop sur la liste
      listElement.setAttribute("droppable", "true");
      listElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        listElement.style.border = "2px dashed #007bff";
      });

      listElement.addEventListener("dragleave", () => {
        listElement.style.border = "";
      });

      listElement.addEventListener("drop", (e) => {
        e.preventDefault();
        listElement.style.border = "";

        const draggedCardIndex = e.dataTransfer.getData("cardIndex");
        const draggedListIndex = e.dataTransfer.getData("listIndex");

        if (draggedCardIndex !== null && draggedListIndex !== null) {
          const draggedCard = this.boardService.board.lists[
            draggedListIndex
          ].cards.splice(draggedCardIndex, 1)[0];

          if (draggedCard) {
            this.boardService.board.lists[listIndex].cards.push(draggedCard);
            this.boardService.storage.saveBoard(this.boardService.board);
            this.renderBoard(this.boardService.board);
          }
        }
      });

      // Créer un conteneur pour les cartes et les boutons
      const listContent = document.createElement("div");
      listContent.className = "list-content";

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
        const title = prompt("Titre de la carte :");
        const description = prompt("Description de la carte :");
        if (title) {
          this.boardService.addCard(listIndex, title, description);
          this.renderBoard(this.boardService.board);
        }
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

    // Vérifier si le bouton Modifier existe déjà dans la modale
    let editCardBtn = document.getElementById("edit-card-btn");
    if (!editCardBtn) {
      editCardBtn = document.createElement("button");
      editCardBtn.id = "edit-card-btn";
      editCardBtn.innerText = "Modifier la carte";
      editCardBtn.style.backgroundColor = "orange";
      editCardBtn.style.color = "white";
      editCardBtn.style.marginBottom = "10px";
      editCardBtn.addEventListener("click", () => {
        const newTitle = prompt("Nouveau titre de la carte :", card.title);
        const newDescription = prompt("Nouvelle description de la carte :", card.description);

        if (newTitle) {
          card.title = newTitle;
          card.description = newDescription;
          this.boardService.storage.saveBoard(this.boardService.board);
          this.renderBoard(this.boardService.board);
          modal.style.display = "none";
        }
      });

      // Ajouter le bouton de modification à la modale
      const modalContent = document.querySelector(".modal-content");
      modalContent.appendChild(editCardBtn);
    }

    // Ajouter le bouton de suppression de la carte (en rouge)
    const deleteCardBtn = document.getElementById("delete-card");
    deleteCardBtn.style.backgroundColor = "red";
    deleteCardBtn.style.color = "white";
    deleteCardBtn.onclick = () => {
      this.boardService.removeCard(listIndex, cardIndex);
      this.renderBoard(this.boardService.board);
      modal.style.display = "none";
    };

    modal.style.display = "block";

    // Fermer la modale en cliquant sur la croix
    document.querySelector(".close").onclick = () => {
      modal.style.display = "none";
    };

    // Fermer la modale en cliquant en dehors du contenu
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }
}

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

        // Ajouter un bouton pour modifier la carte
        const editCardBtn = document.createElement("button");
        editCardBtn.innerText = "Modifier";
        editCardBtn.addEventListener("click", () => {
          this.editCard(listIndex, cardIndex);
        });
        cardElement.appendChild(editCardBtn);

        listElement.appendChild(cardElement);
      });

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
      listElement.appendChild(addCardBtn);

      boardContainer.appendChild(listElement);
    });
  }

  showCardModal(listIndex, cardIndex, card) {
    const modal = document.getElementById("card-modal");
    document.getElementById("modal-title").innerText = card.title;
    document.getElementById("modal-description").innerText = card.description;

    // Gérer la suppression de la carte
    document.getElementById("delete-card").onclick = () => {
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

  editCard(listIndex, cardIndex) {
    const newTitle = prompt("Modifier le titre de la carte :", this.boardService.board.lists[listIndex].cards[cardIndex].title);
    const newDescription = prompt("Modifier la description de la carte :", this.boardService.board.lists[listIndex].cards[cardIndex].description);

    if (newTitle !== null && newDescription !== null) {
      this.boardService.updateCard(listIndex, cardIndex, newTitle, newDescription);
      this.renderBoard(this.boardService.board);
    }
  }
}

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

        cardElement.addEventListener("click", () => {
          this.showCardModal(listIndex, cardIndex, card);
        });

        listElement.appendChild(cardElement);
      });

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
}

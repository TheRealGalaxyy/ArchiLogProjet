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
            list.cards.forEach(card => {
                const cardElement = document.createElement("div");
                cardElement.className = "card";
                cardElement.innerHTML = `<p>${card.title}</p>`;
                listElement.appendChild(cardElement);
            });
            const addCardBtn = document.createElement("button");
            addCardBtn.innerText = "Ajouter une carte";
            addCardBtn.addEventListener("click", () => {
                const title = prompt("Titre de la carte :");
                const description = prompt("Description de la carte :");
                if (title) {
                    this.boardService.addCard(listIndex, title, description);
                    this.renderBoard(board);
                }
            });
            listElement.appendChild(addCardBtn);
            boardContainer.appendChild(listElement);
        });
    }
}
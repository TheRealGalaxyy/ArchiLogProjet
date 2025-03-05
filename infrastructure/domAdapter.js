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
            
            listElement.setAttribute("droppable", "true");
            listElement.addEventListener("dragover", (e) => {
                e.preventDefault();
                listElement.style.border = "2px dashed #007bff";
            });

            listElement.addEventListener("dragleave", () => {
                listElement.style.border = "";
            });

            list.cards.forEach((card, cardIndex) => {
                const cardElement = document.createElement("div");
                cardElement.className = "card";
                cardElement.innerHTML = `<p>${card.title}</p>`;

                cardElement.setAttribute("draggable", "true");

                cardElement.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("cardIndex", cardIndex);
                    e.dataTransfer.setData("listIndex", listIndex);
                    e.target.style.opacity = 0.5;
                });

                cardElement.addEventListener("dragend", (e) => {
                    e.target.style.opacity = 1;
                    listElement.style.border = "";
                });

                listElement.appendChild(cardElement);
            });

            listElement.addEventListener("drop", (e) => {
                e.preventDefault();
                const draggedCardIndex = e.dataTransfer.getData("cardIndex");
                const draggedListIndex = e.dataTransfer.getData("listIndex");

                if (draggedCardIndex && draggedListIndex) {
                    if (draggedListIndex !== listIndex) {
                        const draggedCard = this.boardService.board.lists[draggedListIndex].cards.splice(draggedCardIndex, 1)[0];

                        this.boardService.board.lists[listIndex].addCard(draggedCard);
                        this.boardService.storage.saveBoard(this.boardService.board);
                        this.renderBoard(this.boardService.board);
                    }
                } else {
                    const draggedCard = this.boardService.board.lists[draggedListIndex].cards.splice(draggedCardIndex, 1)[0];
                    this.boardService.board.lists[listIndex].addCard(draggedCard);
                    this.boardService.storage.saveBoard(this.boardService.board);
                    this.renderBoard(this.boardService.board);
                }
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
}

import { BoardService } from "./app/boardService.js";
import { DOMAdapter } from "./infrastructure/domAdapter.js";

const boardService = new BoardService();
const domAdapter = new DOMAdapter(boardService);

async function initialize() {
  const board = await boardService.loadBoard();
  domAdapter.renderBoard(board);

  document.getElementById("add-list").addEventListener("click", async () => {
    const listName = prompt("Nom de la liste :");
    if (listName) {
      await boardService.addList(listName);
      const updatedBoard = await boardService.loadBoard();
      domAdapter.renderBoard(updatedBoard);
    }
  });
}

initialize();

import { Board } from "./model/board.js";
import { List } from "./model/list.js";
import { Card } from "./model/card.js";
import { BoardService } from "./app/BoardService.js";
import { StorageService } from "./app/StorageService.js";
import { DOMAdapter } from "./infra/DOMAdapter.js";

const storage = new StorageService();
const boardService = new BoardService(storage);
const board = boardService.loadBoard() || new Board("Ollert");
const domAdapter = new DOMAdapter(boardService);

domAdapter.renderBoard(board);

document.getElementById("add-list").addEventListener("click", () => {
    const listName = prompt("Nom de la liste :");
    if (listName) {
        boardService.addList(listName);
        domAdapter.renderBoard(board);
    }
});
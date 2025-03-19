import { Board } from "../../model/board.js";
import { Card } from "../../model/card.js";
import { List } from "../../model/list.js";
import { BoardService } from "../../app/boardService.js";
import { StorageService } from "../../app/storageService.js";
import { DOMAdapter } from "../../infrastructure/domAdapter.js";

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

document.getElementById("menu-toggle").addEventListener("click", function() {
  document.getElementById("menu").classList.toggle("show");
});


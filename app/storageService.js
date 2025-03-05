import { Board } from "../model/board.js";  

export class StorageService {
    saveBoard(board) {
        localStorage.setItem("ollert_board", JSON.stringify(board));
    }
    loadBoard() {
        const data = localStorage.getItem("ollert_board");
        return data ? Object.assign(new Board(), JSON.parse(data)) : null;
    }
}
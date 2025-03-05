import { Board } from "../model/board.js";  
import { Card } from "../model/card.js";  
import { List } from "../model/list.js";  

export class BoardService {
    constructor(storage) {
        this.storage = storage;
        this.board = this.storage.loadBoard() || new Board("Ollert");
    }

    addList(name) {
        const list = new List(name);
        this.board.addList(list);
        this.storage.saveBoard(this.board);
    }

    addCard(listIndex, title, description) {
        const card = new Card(title, description);
        this.board.lists[listIndex].addCard(card);
        this.storage.saveBoard(this.board);
    }

    loadBoard() {
        return this.board;
    }
}

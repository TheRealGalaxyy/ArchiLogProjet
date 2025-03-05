export class Board {
    constructor(name) {
        this.name = name;
        this.lists = [];
    }
    addList(list) {
        this.lists.push(list);
    }
}
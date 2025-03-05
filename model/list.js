export class List {
    constructor(name) {
        this.name = name;
        this.cards = [];
    }
    addCard(card) {
        this.cards.push(card);
    }
}
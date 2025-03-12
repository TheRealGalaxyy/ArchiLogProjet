export class List {
  constructor(name) {
    this.name = name;
    this.id = null;
    this.cards = [];
  }
  addCard(card) {
    this.cards.push(card);
  }
}

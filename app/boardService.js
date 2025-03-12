export class BoardService {
  constructor() {
    this.board = null;
  }

  async loadBoard() {
    const response = await fetch(
      "http://localhost/backend/public/index.php?action=getBoard"
    );
    const data = await response.json();
    this.board = new Board(data.name);
    console.log(this.board);
    this.board.lists = data.lists || [];
    return this.board;
  }

  async addList(name) {
    const response = await fetch(
      "http://localhost/backend/public/index.php?action=addList",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    const newList = await response.json();
    this.board.addList(new List(newList.name));
  }

  async addCard(listIndex, title, description) {
    const listId = this.board.lists[listIndex].id;
    const response = await fetch(
      "http://localhost/backend/public/index.php?action=addCard",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listId, title, description }),
      }
    );
    const newCard = await response.json();
    this.board.lists[listIndex].addCard(
      new Card(newCard.title, newCard.description)
    );
  }

  async removeList(listIndex) {
    const listId = this.board.lists[listIndex].id;
    await fetch(
      `http://localhost/backend/public/index.php?action=deleteList&listId=${listId}`,
      {
        method: "DELETE",
      }
    );
    this.board.lists.splice(listIndex, 1);
  }

  async removeCard(listIndex, cardIndex) {
    const cardId = this.board.lists[listIndex].cards[cardIndex].id;
    await fetch(
      `http://localhost/backend/public/index.php?action=deleteCard&cardId=${cardId}`,
      {
        method: "DELETE",
      }
    );
    this.board.lists[listIndex].cards.splice(cardIndex, 1);
  }
}

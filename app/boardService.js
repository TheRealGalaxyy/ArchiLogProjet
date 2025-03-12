import { Board } from "../model/board.js";
import { List } from "../model/list.js";
import { Card } from "../model/card.js";

export class BoardService {
  constructor() {
    this.board = null;
  }

  async loadBoard() {
    try {
      const response = await fetch(
        "http://localhost:8000/index.php?action=getBoard"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch board");
      }
      const data = await response.json();
      this.board = new Board(data.name);
      this.board.lists = data.lists.map((listData) => {
        const list = new List(listData.name);
        list.id = listData.id;
        list.cards = listData.cards.map(
          (cardData) => new Card(cardData.title, cardData.description)
        );
        return list;
      });
      return this.board;
    } catch (error) {
      console.error("Error loading board:", error);
      this.board = new Board("Ollert");
      this.board.lists = [];
      return this.board;
    }
  }

  async addList(name) {
    try {
      const response = await fetch(
        "http://localhost:8000/index.php?action=addList",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add list");
      }

      const newList = await response.json();
      this.board.addList(new List(newList.name));
    } catch (error) {
      console.error("Error adding list:", error);
    }
  }

  async addCard(listIndex, title, description) {
    const listId = this.board.lists[listIndex].id;
    const response = await fetch(
      "http://localhost:8000/index.php?action=addCard",
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
      `http://localhost:8000/index.php?action=deleteList&listId=${listId}`,
      {
        method: "DELETE",
      }
    );
    this.board.lists.splice(listIndex, 1);
  }

  async removeCard(listIndex, cardIndex) {
    const cardId = this.board.lists[listIndex].cards[cardIndex].id;
    await fetch(
      `http://localhost:8000/index.php?action=deleteCard&cardId=${cardId}`,
      {
        method: "DELETE",
      }
    );
    this.board.lists[listIndex].cards.splice(cardIndex, 1);
  }
}

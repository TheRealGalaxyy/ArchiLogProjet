import { Board } from "../model/board.js";
import { List } from "../model/list.js";
import { Card } from "../model/card.js";

export class BoardService {
  constructor(storage) {
    this.board = null;
    this.storage = storage; // Ajout du service de stockage
  }

  async loadBoard(userId) {
    try {
      const response = await fetch(
        `http://localhost/archilog/backend/public/index.php?action=getBoard&userId=${userId}`
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
        "http://localhost/archilog/backend/public/index.php?action=addList",
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
      const list = new List(newList.name);
      list.id = newList.id; // Assigner l'ID de la liste
      this.board.addList(list);
    } catch (error) {
      console.error("Error adding list:", error);
    }
  }

  async addCard(listIndex, title, description) {
    try {
      const listId = this.board.lists[listIndex].id;
      const response = await fetch(
        "http://localhost/archilog/backend/public/index.php?action=addCard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ listId, title, description }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add card");
      }

      const newCard = await response.json();
      const card = new Card(newCard.title, newCard.description);
      card.id = newCard.id; // Assigner l'ID de la carte
      this.board.lists[listIndex].addCard(card);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  }

  async removeList(listIndex) {
    try {
      const listId = this.board.lists[listIndex].id;
      const response = await fetch(
        `http://localhost/archilog/backend/public/index.php?action=deleteList&listId=${listId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete list");
      }

      this.board.lists.splice(listIndex, 1);
    } catch (error) {
      console.error("Error removing list:", error);
    }
  }

  async removeCard(listIndex, cardIndex) {
    try {
      const cardId = this.board.lists[listIndex].cards[cardIndex].id;
      const response = await fetch(
        `http://localhost/archilog/backend/public/index.php?action=deleteCard&cardId=${cardId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      this.board.lists[listIndex].cards.splice(cardIndex, 1);
    } catch (error) {
      console.error("Error removing card:", error);
    }
  }
}

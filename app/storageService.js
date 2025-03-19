import { Board } from "../model/board.js";

export class StorageService {
  saveBoard(board) {
    fetch("backend/public/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Board saved successfully:", data);
      })
      .catch((error) => {
        console.error("Error saving board:", error);
      });
  }

  loadBoard() {
    const data = localStorage.getItem("ollert_board");
    return data ? Object.assign(new Board(), JSON.parse(data)) : null;
  }
}

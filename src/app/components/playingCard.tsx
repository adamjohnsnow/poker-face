import { Card } from "../lib/cards";
import "../styles/playingCard.css";

export function PlayingCard({ card }: { card: Card }) {
  function getColour() {
    if (card.suit === "♦️" || card.suit === "♥️") {
      return "#FF0000";
    } else {
      return "#000";
    }
  }

  function getValue() {
    switch (card.value) {
      case 14: {
        return "A";
      }
      case 13: {
        return "K";
      }
      case 12: {
        return "Q";
      }
      case 11: {
        return "J";
      }
      default: {
        return card.value;
      }
    }
  }

  return (
    <div
      id={"card-" + card.value + "-" + card.suit}
      className={"card-wrapper"}
      style={{ color: getColour() }}
    >
      <div className="card-back"></div>
      <div className="card-face">
        <div className="card-value">
          <div>{getValue()}</div>
          <div>{card.suit}</div>
        </div>
        <div className="card-suit">{card.suit}</div>
      </div>
    </div>
  );
}
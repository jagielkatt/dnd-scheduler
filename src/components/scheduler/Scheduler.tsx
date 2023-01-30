import React, { useCallback, useRef, useState } from "react";
import { useMousePosition } from "../../hooks/useMousePosition";
import { CardContent } from "./components/cardContent/CardContent";
import { TextField } from "./components/textField/TextField";
import styles from "./Scheduler.module.scss";

interface Ticket {
  id: number;
  text: string;
}

export const Scheduler = () => {
  const container = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(container);
  const [activeElement, setActiveElement] = useState<HTMLDivElement>();
  const [grabCoordinates, setGrabCoordinates] = useState<{
    x: number;
    y: number;
  }>();
  const shiftSpotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [cards, setCards] = useState<Ticket[]>(
    [...Array(40)].map((el, index) => ({
      id: index,
      text: "",
    }))
  );
  const [shifts] = useState([...Array(5)].map((v, i) => i));
  const [shiftSpots, setShiftSpots] = useState<
    { id: number; ticket?: Ticket }[]
  >(
    [...Array(40)].map((el, index) => ({
      id: index,
      ticket: undefined,
    }))
  );
  const [textFieldset, setTextFieldset] = useState("");

  const calculatePosition = useCallback(() => {
    const containerBounds = container.current?.getBoundingClientRect();
    if (
      mousePosition.x === null ||
      mousePosition.y === null ||
      typeof grabCoordinates === "undefined" ||
      typeof containerBounds === "undefined"
    ) {
      return;
    }
    return {
      x: mousePosition.x - grabCoordinates.x,
      y: mousePosition.y - grabCoordinates.y,
    };
  }, [grabCoordinates, mousePosition.x, mousePosition.y]);

  return (
    <div>
      <div className="title">
        <h1>Schedule</h1>
      </div>
      <div className={styles.grid} ref={container}>
        <div className={styles["card-container"]}>
          <div className={styles["card-list"]}>
            {cards.map((ticket, index) => {
              const isActiveElemet =
                typeof activeElement !== "undefined" &&
                activeElement === cardsRef.current[index];
              return (
                <div
                  key={`card ${index}`}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className={`${styles.box} ${
                    isActiveElemet ? styles["box--active"] : ""
                  }`}
                  style={{
                    transform: isActiveElemet
                      ? `translate(${calculatePosition()?.x}px, ${
                          calculatePosition()?.y
                        }px)`
                      : "",
                  }}
                  draggable="false"
                  onClick={(event) => {
                    setActiveElement(undefined);
                  }}
                  onMouseDown={(event) => {
                    if (event.button !== 0) {
                      return;
                    }
                    if (cardsRef.current[index] === null) {
                      return;
                    }
                    setGrabCoordinates({ x: event.clientX, y: event.clientY });
                    setActiveElement(cardsRef.current[index]!);
                  }}
                  onMouseUp={(event) => {
                    let shiftId;
                    const shiftSpot = shiftSpotRefs.current.find(
                      (item, index) => {
                        if (!mousePosition.x || !mousePosition.y || !item) {
                          return false;
                        }
                        const bounds = item.getBoundingClientRect();
                        const isDroppedInShiftSpot =
                          mousePosition.x > bounds.left &&
                          mousePosition.x < bounds.right &&
                          mousePosition.y < bounds.bottom &&
                          mousePosition.y > bounds.top;
                        if (isDroppedInShiftSpot) {
                          shiftId = index;
                        }
                        return isDroppedInShiftSpot;
                      }
                    );
                    if (shiftSpot && typeof shiftId === "number") {
                      const temp = [...shiftSpots];
                      temp[shiftId].ticket = ticket;
                      setShiftSpots(temp);
                      setCards((pre) => [
                        ...pre.slice(0, index),
                        ...pre.slice(index + 1, pre.length),
                      ]);
                    }
                    setActiveElement(undefined);
                  }}
                >
                  <CardContent
                    setText={(text: string) => {
                      const temp = [...cards];
                      temp[index].text = text;
                      setCards(temp);
                    }}
                    textValue={ticket.text}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.shift}>
          {shifts.map((item, outerIndex) => {
            return (
              <div key={outerIndex} className={styles.shift__box}>
                Skift {outerIndex + 1}
                <div className={styles.shift__row}>
                  {shiftSpots
                    .slice(outerIndex * 8, outerIndex * 8 + 8)
                    .map((item, innerIndex) => {
                      const index = innerIndex + outerIndex * 8;
                      return (
                        <div
                          className={styles.shift__spot}
                          ref={(el) => (shiftSpotRefs.current[index] = el)}
                          key={index}
                        >
                          {item.ticket?.text && (
                            <div className={styles["shift__spot--active"]}>
                              {item.ticket.text}
                              <button
                                type="button"
                                className={styles.button}
                                onClick={(event) => {
                                  if (typeof item.ticket === "undefined") {
                                    return;
                                  }
                                  const tempCards = [...cards];
                                  tempCards.push(item.ticket);
                                  setCards(tempCards);
                                  const tempShifts = [...shiftSpots];
                                  tempShifts[item.id].ticket = undefined;
                                  setShiftSpots(tempShifts);
                                }}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                                    fill="black"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M13.5355 6.46447C13.9261 6.85499 13.9261 7.48816 13.5355 7.87868L11.4142 10L13.5355 12.1213C13.9261 12.5118 13.9261 13.145 13.5355 13.5355C13.145 13.9261 12.5118 13.9261 12.1213 13.5355L10 11.4142L7.87868 13.5355C7.48816 13.9261 6.85499 13.9261 6.46447 13.5355C6.07394 13.145 6.07394 12.5118 6.46447 12.1213L8.58579 10L6.46447 7.87868C6.07394 7.48816 6.07394 6.85499 6.46447 6.46447C6.85499 6.07394 7.48816 6.07394 7.87868 6.46447L10 8.58579L12.1213 6.46447C12.5118 6.07394 13.145 6.07394 13.5355 6.46447Z"
                                    fill="black"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles["menu-container"]}>
        <h2>Menu</h2>
        <div className={styles["menu-container__button-wrapper"]}>
          <TextField setTextFieldset={setTextFieldset} />
          <button
            onClick={() => {
              const newCards = [...cards];
              textFieldset
                .split(",")
                .forEach((word, index) => (newCards[index].text = word));
              setCards(newCards);
            }}
            className={styles["menu-container__button"]}
          >
            Fill
          </button>
        </div>
      </div>
    </div>
  );
};

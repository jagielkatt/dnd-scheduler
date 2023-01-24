import React, { useCallback, useRef, useState } from "react";
import { useMousePosition } from "../../hooks/useMousePosition";
import { CardContent } from "./components/cardContent/CardContent";
import { TextField } from "./components/textField/TextField";
import styles from "./Scheduler.module.scss";

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
  const [cards, setCards] = useState<string[]>([...Array(40)]);
  const [shifts] = useState([...Array(5)].map((v, i) => i));
  const [shiftSpots, setShiftSpots] = useState<string[]>([...Array(40)]);
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
            {cards.map((item, index) => {
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

                    if (shiftSpot && shiftId) {
                      const temp = [...shiftSpots];
                      temp[shiftId] = item;
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
                      temp[index] = text;
                      setCards(temp);
                    }}
                    textValue={typeof item === "string" ? item : ""}
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
                          {item && (
                            <div className={styles["shift__spot--active"]}>
                              {item}
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
              const newCards = [...Array(cards.length)];
              textFieldset
                .split(",")
                .forEach((word, index) => (newCards[index] = word));
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

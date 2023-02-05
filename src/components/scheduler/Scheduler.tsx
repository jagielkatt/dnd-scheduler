import React, { useCallback, useRef, useState } from "react";
import { useMousePosition } from "../../hooks/useMousePosition";
import { Icon } from "../icons/Icon";
import { CardContent } from "./components/cardContent/CardContent";
import { TextField } from "./components/textField/TextField";
import styles from "./Scheduler.module.scss";

export interface Ticket {
  id: number;
  text: string | null;
}

export const Scheduler = () => {
  const container = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(container);
  const [activeElement, setActiveElement] = useState<HTMLDivElement | null>();
  const [grabCoordinates, setGrabCoordinates] = useState<{
    x: number;
    y: number;
  }>();
  const shiftSpotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [cards, setCards] = useState<Ticket[]>(
    [...Array(40)].map((e, i) => ({
      id: i,
      text: "",
    }))
  );
  const [shifts] = useState([...Array(5)].map((v, i) => i));
  const [shiftSpots, setShiftSpots] = useState<
    { id: number; ticket?: Ticket }[]
  >(
    [...Array(40)].map((e, i) => ({
      id: i,
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

  const isDroppedInBounds = (bounds: DOMRect) => {
    if (!mousePosition.x || !mousePosition.y) {
      return false;
    }
    return (
      mousePosition.x > bounds.left &&
      mousePosition.x < bounds.right &&
      mousePosition.y < bounds.bottom &&
      mousePosition.y > bounds.top
    );
  };

  const onMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: HTMLDivElement | null
  ) => {
    if (event.button !== 0 || element === null) {
      return;
    }
    setGrabCoordinates({ x: event.clientX, y: event.clientY });
    setActiveElement(element);
  };

  return (
    <div className={styles.scheduler}>
      <div className={styles.grid} ref={container}>
        <div className={styles["card-container"]}>
          <div className={styles["card-list"]}>
            {cards.map((ticket, index) => {
              if (ticket.text === null) {
                return <div className={styles["empty-box"]} key={ticket.id} />;
              }
              const isActiveElement =
                typeof activeElement !== "undefined" &&
                activeElement === cardsRef.current[index];
              return (
                <div
                  key={ticket.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className={`${styles.box} ${
                    isActiveElement && styles["box--active"]
                  }`}
                  style={{
                    transform: isActiveElement
                      ? `translate(${calculatePosition()?.x}px, ${
                          calculatePosition()?.y
                        }px)`
                      : "",
                  }}
                  draggable="false"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  onMouseDown={(event) =>
                    onMouseDown(event, cardsRef.current[index])
                  }
                  onMouseUp={(event) => {
                    let shiftId;
                    const shiftSpot = shiftSpotRefs.current.find(
                      (item, index) => {
                        if (!item) {
                          return false;
                        }
                        const isDroppedInShiftSpot = isDroppedInBounds(
                          item.getBoundingClientRect()
                        );
                        if (isDroppedInShiftSpot) {
                          shiftId = index;
                        }
                        return isDroppedInShiftSpot;
                      }
                    );
                    if (shiftSpot && typeof shiftId === "number") {
                      const temp = [...shiftSpots];
                      temp[shiftId].ticket = ticket;
                      const tempCards = [...cards];
                      tempCards[index] = { id: ticket.id, text: null };
                      setCards(tempCards);
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
          {shifts.map((i, outerIndex) => {
            return (
              <div key={outerIndex} className={styles.shift__box}>
                <h2>Skift {outerIndex + 1}</h2>
                <div className={styles.shift__row}>
                  {shiftSpots
                    .slice(outerIndex * 8, outerIndex * 8 + 8)
                    .map((item, innerIndex) => {
                      const index = innerIndex + outerIndex * 8;
                      const isActiveElement =
                        typeof activeElement !== "undefined" &&
                        activeElement === shiftSpotRefs.current[index];
                      return (
                        <div
                          className={styles.shift__spot}
                          ref={(el) => (shiftSpotRefs.current[index] = el)}
                          key={index}
                        >
                          {item.ticket?.text && (
                            <div
                              className={`${styles["shift__spot--active"]} ${
                                isActiveElement &&
                                styles["shift__spot--active--grabbed"]
                              }`}
                              style={{
                                transform: isActiveElement
                                  ? `translate(${calculatePosition()?.x}px, ${
                                      calculatePosition()?.y
                                    }px)`
                                  : "",
                              }}
                              draggable="false"
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                              onMouseDown={(event) =>
                                onMouseDown(event, shiftSpotRefs.current[index])
                              }
                              onMouseUp={(event) => {
                                let shiftId;
                                const shiftSpot = shiftSpotRefs.current.find(
                                  (item, index) => {
                                    if (!item) {
                                      return false;
                                    }
                                    const isDroppedInShiftSpot =
                                      isDroppedInBounds(
                                        item.getBoundingClientRect()
                                      );
                                    if (isDroppedInShiftSpot) {
                                      shiftId = index;
                                    }
                                    return isDroppedInShiftSpot;
                                  }
                                );
                                if (shiftSpot && typeof shiftId === "number") {
                                  const temp = [...shiftSpots];
                                  let tempTicket;

                                  if (item.ticket) {
                                    tempTicket = { ...item.ticket };
                                    temp[shiftId].ticket = { ...item.ticket };
                                    item.ticket = undefined;
                                  }
                                  if (tempTicket) {
                                    temp[shiftId].ticket = {
                                      id: tempTicket.id,
                                      text: tempTicket.text,
                                    };
                                  }
                                  setShiftSpots(temp);
                                }
                                setActiveElement(undefined);
                              }}
                            >
                              {item.ticket.text}
                              <button
                                type="button"
                                className={styles.button}
                                onClick={(event) => {
                                  if (typeof item.ticket === "undefined") {
                                    return;
                                  }
                                  const tempCards = [...cards];
                                  tempCards[item.ticket.id] = item.ticket;
                                  setCards(tempCards);
                                  const tempShifts = [...shiftSpots];
                                  tempShifts[item.id].ticket = undefined;
                                  setShiftSpots(tempShifts);
                                }}
                              >
                                <Icon.Close />
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
              textFieldset.split(",").forEach((word, i) => {
                if (typeof newCards[i] === "undefined") {
                  return;
                }
                newCards[i].text = word;
              });
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

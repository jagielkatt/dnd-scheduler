import React, { useRef, useState } from "react";
import {
  useEditContext,
  useCards,
  useIsEditMode,
  useShiftSpots,
  ShiftSpot,
} from "../../context/EditContext";
import { useMousePosition } from "../../hooks/useMousePosition";
import { Icon } from "../icons/Icon";
import { CardContent } from "./components/cardContent/CardContent";
import { ColumnLabel } from "./components/colLabel/ColumnLabel";
import { RowLabel } from "./components/rowLabel/RowLabel";
import { TextField } from "./components/textField/TextField";
import styles from "./Scheduler.module.scss";

export const Scheduler = () => {
  const { state: editContext, setState: setEditContext } = useEditContext();
  const { cards, setCards } = useCards();
  const { shiftSpots, setShiftSpots } = useShiftSpots();
  const { isEditMode, toggleEditMode } = useIsEditMode();
  const container = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(container);
  const [activeElement, setActiveElement] = useState<HTMLDivElement | null>();
  const [grabCoordinates, setGrabCoordinates] = useState<{
    x: number;
    y: number;
  }>();
  const shiftSpotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [textFieldset, setTextFieldset] = useState("");

  const calculatePosition = () => {
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
  };

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
      <button
        className={`${styles.toggle} ${isEditMode && styles["toggle--active"]}`}
        type="button"
        onClick={() => {
          toggleEditMode();
        }}
      >
        {isEditMode ? "Stop editing" : "Start editing"}
      </button>
      <button
        className={styles.toggle}
        type="button"
        onClick={() => {
          localStorage.removeItem("cards");
          localStorage.removeItem("shifts");
          localStorage.removeItem("row_labels");
          localStorage.removeItem("col_labels");
          window.location.reload();
        }}
      >
        Reset
      </button>
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
                    background: ticket.color,
                    color: ticket.color === "#003057" ? "#FFF" : "",
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
                      const temp: ShiftSpot[] = JSON.parse(
                        JSON.stringify(shiftSpots)
                      );
                      const existingCardInSpot =
                        typeof temp[shiftId].ticket !== "undefined"
                          ? JSON.parse(JSON.stringify(temp[shiftId].ticket))
                          : undefined;
                      temp[shiftId].ticket = ticket;
                      setShiftSpots(temp);
                      const tempCards = JSON.parse(JSON.stringify(cards));
                      tempCards[index] = existingCardInSpot
                        ? {
                            id: ticket.id,
                            ...existingCardInSpot,
                          }
                        : { id: ticket.id, text: null };
                      setCards(tempCards);
                    }
                    setActiveElement(undefined);
                  }}
                >
                  <CardContent
                    ticketId={ticket.id}
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
          <div className={styles["shift__label-row"]}>
            {editContext.rowLabels.map((row, i) => (
              <RowLabel
                text={row}
                setLabel={(text) => {
                  const temp = [...editContext.rowLabels];
                  temp[i] = text;
                  setEditContext({ rowLabels: temp });
                }}
              />
            ))}
          </div>
          {[...Array(5)].map((e, outerIndex) => {
            return (
              <div key={outerIndex} className={styles.shift__box}>
                <ColumnLabel
                  text={editContext.columnLabels[outerIndex]}
                  setLabel={(text) => {
                    const temp = [...editContext.columnLabels];
                    temp[outerIndex] = text;
                    setEditContext({ columnLabels: temp });
                  }}
                />
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
                          {item.ticket && (
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
                                background: item.ticket.color,
                                color:
                                  item.ticket.color === "#003057" ? "#FFF" : "",
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
                                  const temp = JSON.parse(
                                    JSON.stringify(shiftSpots)
                                  );
                                  let tempTicket;
                                  let existingCardInSpot;
                                  if (
                                    typeof temp[shiftId].ticket !== "undefined"
                                  ) {
                                    existingCardInSpot = JSON.parse(
                                      JSON.stringify(temp[shiftId].ticket)
                                    );
                                  }

                                  if (item.ticket) {
                                    tempTicket = JSON.parse(
                                      JSON.stringify(item.ticket)
                                    );
                                    temp[item.id].ticket = existingCardInSpot
                                      ? existingCardInSpot
                                      : undefined;
                                  }
                                  if (tempTicket) {
                                    temp[shiftId].ticket = {
                                      id: tempTicket.id,
                                      text: tempTicket.text,
                                      color: tempTicket.color,
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
                                  const tempCards = JSON.parse(
                                    JSON.stringify(cards)
                                  );
                                  tempCards[item.ticket.id] = item.ticket;
                                  setCards(tempCards);
                                  const tempShifts = JSON.parse(
                                    JSON.stringify(shiftSpots)
                                  );
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
      {isEditMode && (
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
      )}
    </div>
  );
};

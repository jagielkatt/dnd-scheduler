import React, { useRef, useState } from "react";
import {
  ShiftSpot,
  NBR_OF_ENTRIES,
  NBR_OF_SHIFTS,
  Ticket,
  Colors,
} from "../../context/EditContext";
import { useMousePosition } from "../../hooks/useMousePosition";
import { Icon } from "../icons/Icon";
import { CardContent } from "./components/cardContent/CardContent";
import { ColumnLabel } from "./components/colLabel/ColumnLabel";
import { RowLabel } from "./components/rowLabel/RowLabel";
import { TextField } from "./components/textField/TextField";
import styles from "./Scheduler.module.scss";
import shiftSpotStyles from "./ShiftSpot.module.scss";
import { useCards } from "../../hooks/useCards";
import { useShiftSpots } from "../../hooks/useShiftSpots";
import { useEditMode } from "../../hooks/useEditMode";
import { useEditContext } from "../../context/useEditContext";

export const Scheduler = () => {
  const { state: editContext, setState: setEditContext } = useEditContext();
  const { cards, setCards } = useCards();
  const { shiftSpots, setShiftSpots } = useShiftSpots();
  const { isEditMode, toggleEditMode } = useEditMode();
  const container = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(container);
  const [activeElement, setActiveElement] = useState<HTMLDivElement | null>();
  const [grabCoordinates, setGrabCoordinates] = useState<{
    x: number;
    y: number;
  }>();
  const shiftSpotRefs = useRef<
    Array<{ element: HTMLDivElement | null; boundingClientRect: DOMRect }>
  >([]);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [textFieldset, setTextFieldset] = useState("");

  const calculateTransformCoordinates = () => {
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
    if (!mousePosition.x || !mousePosition.y) return false;

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
    if (event.button !== 0 || element === null) return;

    setGrabCoordinates({ x: event.clientX, y: event.clientY });
    setActiveElement(element);
  };

  const getDroppedIntoShiftSpotId = () => {
    return shiftSpotRefs.current.findIndex((item) =>
      isDroppedInBounds(item.boundingClientRect)
    );
  };

  const entriesPerColumn = NBR_OF_ENTRIES / NBR_OF_SHIFTS;
  const position = activeElement && calculateTransformCoordinates();
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
                      ? `translate(${position?.x}px, ${position?.y}px)`
                      : "",
                    ...getColorStyles(ticket.color),
                  }}
                  draggable="false"
                  onClick={(event) => event.stopPropagation()}
                  onMouseDown={(event) =>
                    onMouseDown(event, cardsRef.current[index])
                  }
                  onMouseUp={() => {
                    const shiftId = getDroppedIntoShiftSpotId();
                    const isDroppedInShiftSpot = shiftId > -1;

                    if (isDroppedInShiftSpot) {
                      const temp: ShiftSpot[] = JSON.parse(
                        JSON.stringify(shiftSpots)
                      );
                      const existingCardInSpot =
                        typeof temp[shiftId].ticket !== "undefined"
                          ? JSON.parse(JSON.stringify(temp[shiftId].ticket))
                          : undefined;
                      temp[shiftId].ticket = ticket;
                      setShiftSpots(temp);

                      const tempCards: Ticket[] = JSON.parse(
                        JSON.stringify(cards)
                      );
                      tempCards[index] = existingCardInSpot
                        ? {
                            id: ticket.id,
                            ...existingCardInSpot,
                          }
                        : { id: ticket.id, text: null };
                      setCards(tempCards);
                    }
                    setGrabCoordinates(undefined);
                    setActiveElement(undefined);
                  }}
                >
                  <CardContent ticketId={ticket.id} textValue={ticket.text} />
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.shift}>
          <div className={styles["shift__label-row"]}>
            {editContext.rowLabels.map((row, i) => (
              <RowLabel rowId={i} key={row.label} />
            ))}
          </div>
          {[...Array(NBR_OF_SHIFTS)].map((_, outerIndex) => {
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
                    .slice(
                      outerIndex * entriesPerColumn,
                      outerIndex * entriesPerColumn + entriesPerColumn
                    )
                    .map((item, innerIndex) => {
                      const lastCol = outerIndex === NBR_OF_SHIFTS - 1;
                      const index = innerIndex + outerIndex * entriesPerColumn;
                      const isActiveElement =
                        typeof activeElement !== "undefined" &&
                        activeElement === shiftSpotRefs.current[index].element;

                      return (
                        <div
                          className={styles.shift__spot}
                          ref={(el) => {
                            if (el === null) return;

                            shiftSpotRefs.current[index] = {
                              element: el,
                              boundingClientRect: el.getBoundingClientRect(),
                            };
                          }}
                          key={index}
                        >
                          {item.ticket && (
                            <div
                              className={`${shiftSpotStyles["shift-spot"]} ${
                                isActiveElement &&
                                shiftSpotStyles["shift-spot__grabbed"]
                              } ${
                                item.ticket.comment !== null &&
                                item.ticket.comment !== "" &&
                                shiftSpotStyles["shift-spot__tooltip"]
                              } ${
                                lastCol &&
                                shiftSpotStyles["shift-spot__tooltip--left"]
                              }`}
                              style={{
                                transform: isActiveElement
                                  ? `translate(${position?.x}px, ${position?.y}px)`
                                  : "",
                                ...getColorStyles(item.ticket.color),
                              }}
                              draggable="false"
                              onClick={(event) => event.stopPropagation()}
                              onMouseDown={(event) =>
                                onMouseDown(
                                  event,
                                  shiftSpotRefs.current[index].element
                                )
                              }
                              onMouseUp={() => {
                                const shiftId = getDroppedIntoShiftSpotId();
                                const isDroppedInShiftSpot = shiftId > -1;

                                if (isDroppedInShiftSpot) {
                                  const temp: ShiftSpot[] = JSON.parse(
                                    JSON.stringify(shiftSpots)
                                  );
                                  let tempTicket: Ticket | undefined;
                                  let existingCardInSpot: Ticket | undefined;
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
                                    temp[shiftId].ticket = { ...tempTicket };
                                  }
                                  setShiftSpots(temp);
                                }
                                setActiveElement(undefined);
                                setGrabCoordinates(undefined);
                              }}
                              /* This is only used with .shift-spot--tooltip */
                              data-comment={item.ticket.comment}
                            >
                              {item.ticket.text}
                              <button
                                type="button"
                                className={styles.button}
                                onClick={() => {
                                  if (typeof item.ticket === "undefined") {
                                    return;
                                  }

                                  const tempCards: Ticket[] = JSON.parse(
                                    JSON.stringify(cards)
                                  );
                                  tempCards[item.ticket.id] = item.ticket;
                                  setCards(tempCards);
                                  const tempShifts: ShiftSpot[] = JSON.parse(
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
      <button
        className={`${styles.toggle} ${isEditMode && styles["toggle--active"]}`}
        type="button"
        onClick={() => toggleEditMode()}
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
      {isEditMode && (
        <div className={styles["menu-container"]}>
          <div className={styles["menu-container__button-wrapper"]}>
            <TextField
              setTextFieldset={setTextFieldset}
              value={textFieldset}
              label="Menu"
            />
            <button
              onClick={() => {
                const newCards = [...cards];
                textFieldset.split(",").forEach((word, i) => {
                  if (typeof newCards[i] === "undefined") return;

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

const getColorStyles = (backgroundColor?: Colors) => {
  if (typeof backgroundColor === "undefined") return;

  const hasWhiteText =
    backgroundColor === "#003057" ||
    backgroundColor === "hotpink" ||
    backgroundColor === "#6b8e23" ||
    backgroundColor === "#ff5470";
  return {
    background: backgroundColor,
    color: hasWhiteText ? "#FFF" : "",
  };
};

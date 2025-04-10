"use client";

import { MouseEvent, MouseEventHandler, ReactNode, useState } from "react";

type ElementItem = {
  id: number;
  content: ReactNode;
};

export default function ElementAdder() {
  const [elements, setElements] = useState<ElementItem[]>([]);
  const [counter, setCounter] = useState(0);

  const addElement = (component: string): void => {
    let questionTitle = prompt("Introduce la pregunta:", "default question");

    const newCounter: number = counter + 1;
    setCounter(newCounter);

    let newElement: ElementItem;

    switch (component) {
      case "input":
        newElement = {
          id: newCounter,
          content: (
            <>
              <h1>{questionTitle}</h1>
              <input className="bg-slate-300"></input>
            </>
          ),
        };
        break;
      case "multiple":
        let option1 = prompt("Opcion 1");
        let option2 = prompt("Opcion 2");
        let option3 = prompt("Opcion 3");
        let option4 = prompt("Opcion 4");

        newElement = {
          id: newCounter,
          content: (
            <>
              <h1>{questionTitle}</h1>
              <div>
                <input type="checkbox" className="bg-slate-300"></input>
                <label>{option1}</label>
              </div>
              <div>
                <input type="checkbox" className="bg-slate-300"></input>
                <label>{option2}</label>
              </div>
              <div>
                <input type="checkbox" className="bg-slate-300"></input>
                <label>{option3}</label>
              </div>
              <div>
                <input type="checkbox" className="bg-slate-300"></input>
                <label>{option4}</label>
              </div>
            </>
          ),
        };
        break;
      default:
        newElement = {
          id: newCounter,
          content: <p>error</p>,
        };
        break;
    }

    setElements([...elements, newElement]);
  };
  return (
    <>
      <button
        className="bg-slate-800 text-white"
        onClick={() => addElement("input")}
      >
        Agregar Input
      </button>
      <button
        className="bg-slate-800 text-white"
        onClick={() => addElement("multiple")}
      >
        Agregar Multiple
      </button>
      <div>
        {elements.length == 0 ? (
          <p>No hay elementos</p>
        ) : (
          elements.map((item) => <div key={item.id}>{item.content}</div>)
        )}
      </div>
    </>
  );
}

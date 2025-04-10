"use client";

import { ReactNode, useState } from "react";

type ElementItem = {
  id: number;
  content: ReactNode;
};

export default function ElementAdder() {
  const [elements, setElements] = useState<ElementItem[]>([]);
  const [counter, setCounter] = useState(0);

  const addElement = (): void => {
    const newCounter: number = counter + 1;
    setCounter(newCounter);

    const newElement: ElementItem = {
      id: newCounter,
      content: (
        <div>
          <input className="bg-slate-300"></input>
        </div>
      ),
    };
    setElements([...elements, newElement]);
  };
  return (
    <>
      <button className="bg-slate-800 text-white" onClick={addElement}>
        Agregar Elemento
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

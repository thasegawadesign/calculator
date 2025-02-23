"use client";

import clsx from "clsx";
import { JSX, useState } from "react";
import { BsPlusSlashMinus } from "react-icons/bs";

const expression = ["operand", "operator"] as const;
type Expression = (typeof expression)[number];

type ButtonLabel = {
  type: Expression;
  name: string;
  content: string | JSX.Element;
};

const line1: ButtonLabel[] = [
  { type: "operator", name: "AC", content: "AC" },
  {
    type: "operator",
    name: "plusSlashMinus",
    content: (
      <>
        <BsPlusSlashMinus />
      </>
    ),
  },
  { type: "operator", name: "%", content: "%" },
  { type: "operator", name: "÷", content: "÷" },
];
const line2: ButtonLabel[] = [
  { type: "operand", name: "7", content: "7" },
  { type: "operand", name: "8", content: "8" },
  { type: "operand", name: "9", content: "9" },
  { type: "operator", name: "×", content: "×" },
];
const line3: ButtonLabel[] = [
  { type: "operand", name: "4", content: "4" },
  { type: "operand", name: "5", content: "5" },
  { type: "operand", name: "6", content: "6" },
  { type: "operator", name: "-", content: "-" },
];
const line4: ButtonLabel[] = [
  { type: "operand", name: "1", content: "1" },
  { type: "operand", name: "2", content: "2" },
  { type: "operand", name: "3", content: "3" },
  { type: "operator", name: "+", content: "+" },
];
const line5: ButtonLabel[] = [
  { type: "operand", name: "0", content: "0" },
  { type: "operand", name: ".", content: "." },
  { type: "operator", name: "=", content: "=" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (item: ButtonLabel) => {
    console.log(item);
    switch (item.name) {
      case "AC":
        clearInput();
        break;
    }
    switch (item.type) {
      case "operand":
        concatenateNumericLiterals(item.name);
        break;
    }
  };

  const clearInput = () => {
    setInput("");
    setResult("");
  };

  const concatenateNumericLiterals = (value: string) => {
    if (input.length === 0 && value === "0") return;
    setInput((prev) => prev + value);
  };

  return (
    <main
      className={clsx("grid h-screen w-full items-end bg-gray-800 px-4 pb-20")}
    >
      <div className={clsx("max-w-sm")}>
        <div className={clsx("pb-5 text-right")}>
          <p className={clsx("text-7xl text-white")}>{input || "0"}</p>
          <p className={clsx("text-7xl text-white")}>{result}</p>
        </div>
        <div className={clsx("grid grid-cols-4 gap-2")}>
          {line1.map((item) => (
            <button
              key={item.name}
              className={clsx(
                "grid aspect-square place-items-center rounded-full text-4xl text-white",
                { "bg-gray-400 active:bg-gray-300": item.name !== "÷" },
                { "bg-orange-400 active:bg-orange-300": item.name === "÷" },
              )}
              onClick={() => handleClick(item)}
            >
              {item.content}
            </button>
          ))}
          {line2.map((item) => (
            <button
              key={item.name}
              className={clsx(
                "grid aspect-square place-items-center rounded-full text-4xl text-white",
                { "bg-gray-600 active:bg-gray-500": item.name !== "×" },
                { "bg-orange-400 active:bg-orange-300": item.name === "×" },
              )}
              onClick={() => handleClick(item)}
            >
              {item.content}
            </button>
          ))}
          {line3.map((item) => (
            <button
              key={item.name}
              className={clsx(
                "grid aspect-square place-items-center rounded-full text-4xl text-white",
                { "bg-gray-600 active:bg-gray-500": item.name !== "-" },
                { "bg-orange-400 active:bg-orange-300": item.name === "-" },
              )}
              onClick={() => handleClick(item)}
            >
              {item.content}
            </button>
          ))}
          {line4.map((item) => (
            <button
              key={item.name}
              className={clsx(
                "grid aspect-square place-items-center rounded-full text-4xl text-white",
                { "bg-gray-600 active:bg-gray-500": item.name !== "+" },
                { "bg-orange-400 active:bg-orange-300": item.name === "+" },
              )}
              onClick={() => handleClick(item)}
            >
              {item.content}
            </button>
          ))}
          {line5.map((item) => (
            <button
              key={item.name}
              className={clsx(
                "grid place-items-center rounded-full text-4xl text-white",
                {
                  "aspect-square": item.name !== "0",
                  "col-start-1 col-end-3 aspect-[2/1]": item.name === "0",
                },
                { "bg-gray-600 active:bg-gray-500": item.name !== "=" },
                { "bg-orange-400 active:bg-orange-300": item.name === "=" },
              )}
              onClick={() => handleClick(item)}
            >
              {item.content}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

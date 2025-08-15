"use client";

import clsx from "clsx";
import { all, create, MathJsInstance } from "mathjs";
import { JSX, useState } from "react";
import { BsPlusSlashMinus } from "react-icons/bs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  { type: "operator", name: "/", content: "÷" },
];
const line2: ButtonLabel[] = [
  { type: "operand", name: "7", content: "7" },
  { type: "operand", name: "8", content: "8" },
  { type: "operand", name: "9", content: "9" },
  { type: "operator", name: "*", content: "×" },
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
  const [isCalculated, setIsCalculated] = useState(false);

  const math: MathJsInstance = create(all);

  const replaceMathSymbols = (expression: string) => {
    return expression.replace(/×/g, "*").replace(/÷/g, "/");
  };

  const handleClick = (item: ButtonLabel) => {
    switch (item.name) {
      case "AC":
        clearInput();
        setIsCalculated(false);
        break;
      case "plusSlashMinus":
        toggleSign();
        setIsCalculated(false);
        break;
      case "=":
        calculate();
        break;
    }
    switch (item.type) {
      case "operand":
        concatenateNumericLiterals(item.name);
        break;
    }
    switch (item.type) {
      case "operator":
        concatenateOperator(item.content);
        break;
    }
  };

  const clearInput = () => {
    setInput("");
    setResult("");
  };

  const calculate = () => {
    if (input.trim() === "") {
      setResult("0");
      setIsCalculated(true);
      return;
    }

    const trimmedInput = input.replace(/[+\-×÷%]+$/, "");

    if (trimmedInput === "") {
      setResult("0");
      setIsCalculated(true);
      return;
    }

    try {
      const rawResult = math.evaluate(replaceMathSymbols(trimmedInput));
      const roundedResult = Math.round(rawResult * 1e12) / 1e12;
      setResult(roundedResult.toString());
      setIsCalculated(true);
      return;
    } catch (error) {
      setResult(error instanceof Error ? error.message : "計算エラー");
      setIsCalculated(true);
    }
  };

  const toggleSign = () => {
    if (input === "") return;

    const currentNumber = getCurrentNumber(input);
    if (currentNumber === "") return;

    const expressionWithoutLastNumber = getExpressionWithoutLastNumber(input);

    if (currentNumber.startsWith("-")) {
      const newNumber = currentNumber.slice(1);
      setInput(expressionWithoutLastNumber + newNumber);
      return;
    }

    const newNumber = "-" + currentNumber;
    setInput(expressionWithoutLastNumber + newNumber);
  };

  const getCurrentNumber = (expression: string) => {
    const operators = /([+\-×÷%])/;
    const parts = expression.split(operators);
    return parts[parts.length - 1] || "";
  };

  const getExpressionWithoutLastNumber = (expression: string) => {
    const currentNumber = getCurrentNumber(expression);
    if (currentNumber === "") return expression;
    return expression.slice(0, -currentNumber.length);
  };

  const concatenateNumericLiterals = (value: string) => {
    if (input.length === 0 && value === "0") return;

    const currentNumber = getCurrentNumber(input);
    if (currentNumber.includes(".") && value === ".") return;

    if (input.length === 0 && value === ".") {
      value = "0.";
    }

    if (value === "." && /[+\-×÷%]$/.test(input)) {
      value = "0.";
    }

    setInput((prev) => prev + value);
  };

  const concatenateOperator = (value: string | JSX.Element) => {
    if (value === "AC") return;
    if (value === "=") return;
    if (typeof value === "object") return;

    if (input === "" && value !== "-") return;

    if (input.endsWith("+") && value === "+") return;
    if (input.endsWith("×") && value === "×") return;
    if (input.endsWith("÷") && value === "÷") return;
    if (input.endsWith("%") && value === "%") return;

    if (value === "-") {
      if (input.endsWith("-")) return;
    }

    setIsCalculated(false);
    setInput((prev) => prev + value);
  };

  const getFontSizeClass = (value: string) => {
    const length = value.replace(/[.-]/g, "").length;

    if (length <= 6) return "text-7xl";
    if (length <= 9) return "text-5xl";
    if (length <= 12) return "text-4xl";
    return "text-3xl";
  };

  return (
    <main
      className={clsx("grid h-screen w-full items-end bg-gray-800 px-4 pb-20")}
    >
      <div className={clsx("max-w-sm")}>
        <div className={clsx("pb-5 text-right")}>
          <p
            className={clsx("text-white", {
              [getFontSizeClass(input || "0")]: isCalculated !== true,
              "mb-4 text-3xl text-gray-500": isCalculated === true,
            })}
          >
            {input || "0"}
          </p>
          <p
            className={clsx(`${getFontSizeClass(result)} text-white`, {
              hidden: isCalculated !== true,
            })}
          >
            {result}
          </p>
        </div>
        <div className={clsx("grid grid-cols-4 gap-2")}>
          {line1.map((item) => (
            <button
              key={item.name}
              className={clsx(
                "grid aspect-square place-items-center rounded-full text-4xl text-white",
                { "bg-gray-400 active:bg-gray-300": item.name !== "/" },
                { "bg-orange-400 active:bg-orange-300": item.name === "/" },
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
                { "bg-gray-600 active:bg-gray-500": item.name !== "*" },
                { "bg-orange-400 active:bg-orange-300": item.name === "*" },
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

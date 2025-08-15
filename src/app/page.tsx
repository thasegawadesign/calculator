"use client";

import clsx from "clsx";
import { all, create, MathJsInstance } from "mathjs";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  const math: MathJsInstance = create(all);

  const replaceMathSymbols = (expression: string) => {
    return expression.replace(/×/g, "*").replace(/÷/g, "/");
  };

  const addCommas = (num: string) => {
    const parts = num.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  const formatInputForDisplay = useCallback((inputStr: string) => {
    return inputStr.replace(/(\d+)/g, (match) => {
      return addCommas(match);
    });
  }, []);

  const handleClick = (item: ButtonLabel) => {
    if (item.name === "AC") {
      clearInput();
      setIsCalculated(false);
      return;
    }

    if (item.name === "plusSlashMinus") {
      toggleSign();
      setIsCalculated(false);
      return;
    }

    if (item.name === "=") {
      calculate();
      return;
    }

    if (item.type === "operand") {
      concatenateNumericLiterals(item.name);
      return;
    }

    if (item.type === "operator") {
      concatenateOperator(item.content);
      return;
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
      const mathExpression = convertParenthesesForMath(trimmedInput);
      const rawResult = math.evaluate(replaceMathSymbols(mathExpression));
      const formattedResult = formatResult(rawResult);
      setResult(formattedResult);
      setIsCalculated(true);
      return;
    } catch (error) {
      setResult(error instanceof Error ? error.message : "計算エラー");
      setIsCalculated(true);
    }
  };

  const toggleSign = () => {
    if (input === "") {
      setInput("(-0)");
      return;
    }

    const currentNumber = getCurrentNumber(input);
    if (currentNumber === "") return;

    if (/^[+\-×÷%]+$/.test(currentNumber)) return;

    const expressionWithoutLastNumber = getExpressionWithoutLastNumber(input);

    if (input.endsWith("(-" + currentNumber)) {
      setInput(expressionWithoutLastNumber + currentNumber);
      return;
    }

    if (currentNumber.startsWith("(") && currentNumber.endsWith(")")) {
      const numberInParentheses = currentNumber.slice(1, -1);
      if (numberInParentheses.startsWith("-")) {
        const positiveNumber = numberInParentheses.slice(1);
        setInput(expressionWithoutLastNumber + positiveNumber);
      } else {
        setInput(
          expressionWithoutLastNumber + "(-" + numberInParentheses + ")",
        );
      }
      return;
    }

    if (currentNumber.startsWith("-")) {
      const positiveNumber = currentNumber.slice(1);
      setInput(expressionWithoutLastNumber + positiveNumber);
    } else {
      setInput(expressionWithoutLastNumber + "(-" + currentNumber + ")");
    }
  };
  const getCurrentNumber = (expression: string) => {
    const patterns = [/\([^)]*\)$/, /[+\-×÷%]([^+\-×÷%]*)$/, /^([^+\-×÷%]*)$/];

    for (const pattern of patterns) {
      const match = expression.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return "";
  };

  const getExpressionWithoutLastNumber = (expression: string) => {
    const currentNumber = getCurrentNumber(expression);
    if (currentNumber === "") return expression;
    return expression.slice(0, -currentNumber.length);
  };

  const convertParenthesesForMath = (expression: string) => {
    return expression.replace(/\((-?\d*\.?\d*)\)/g, "$1");
  };

  const concatenateNumericLiterals = (value: string) => {
    if (input.length === 0 && value === "0") return;

    const currentNumber = getCurrentNumber(input);

    const actualNumber =
      currentNumber.startsWith("(") && currentNumber.endsWith(")")
        ? currentNumber.slice(1, -1)
        : currentNumber;

    if (actualNumber.includes(".") && value === ".") return;

    if (input.length === 0 && value === ".") {
      value = "0.";
    }
    if (value === "." && /[+\-×÷%]$/.test(input)) {
      value = "0.";
    }

    if (input.endsWith("(-")) {
      setInput((prev) => prev + value + ")");
      return;
    }

    setInput((prev) => prev + value);
  };

  const concatenateOperator = (value: string | JSX.Element) => {
    if (value === "AC") return;
    if (value === "=") return;
    if (typeof value === "object") return;
    if (input === "" && value !== "-") return;
    if (input.endsWith("+") && value === "+") return;
    if (input.endsWith("-") && value === "-") return;
    if (input.endsWith("×") && value === "×") return;
    if (input.endsWith("÷") && value === "÷") return;
    if (input.endsWith("%") && value === "%") return;

    setIsCalculated(false);
    setInput((prev) => prev + value);
  };

  const formatResult = (num: number) => {
    const str = num.toString();

    if (Number.isInteger(num)) {
      return addCommas(str);
    }

    const precision = 12;
    let result = num.toPrecision(precision);

    if (result.includes("e")) {
      if (Math.abs(num) < 1) {
        result = num.toFixed(12);
      } else {
        result = num.toString();
      }
    }

    result = result.replace(/\.?0+$/, "");

    return addCommas(result);
  };

  const isLongNumber = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, "");
    return digitsOnly.length > 12;
  };

  const getFontSizeClass = (value: string) => {
    const length = value.replace(/[.-]/g, "").length;

    if (length <= 6) return "text-7xl";
    if (length <= 9) return "text-6xl";
    if (length <= 12) return "text-5xl";
    return "text-4xl";
  };

  useEffect(() => {
    if (inputRef.current && isLongNumber(formatInputForDisplay(input))) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [formatInputForDisplay, input]);

  useEffect(() => {
    if (resultRef.current && isLongNumber(result)) {
      resultRef.current.scrollLeft = resultRef.current.scrollWidth;
    }
  }, [result]);

  const displayInput = formatInputForDisplay(input);

  return (
    <main
      className={clsx("grid h-screen w-full items-end bg-gray-800 px-4 pb-20")}
    >
      <div className={clsx("max-w-[348px]")}>
        <div className={clsx("pb-5")}>
          <div className="mb-2 w-full max-w-[348px] text-right">
            <div
              className={clsx({
                "scrollbar-none overflow-x-auto": isLongNumber(input || "0"),
                "overflow-hidden": !isLongNumber(input || "0"),
              })}
            >
              <p
                ref={inputRef}
                className={clsx("text-white", {
                  [getFontSizeClass(input || "0")]: isCalculated !== true,
                  "text-3xl text-gray-500": isCalculated === true,
                  "whitespace-nowrap": isLongNumber(input || "0"),
                })}
              >
                {displayInput || "0"}
              </p>
            </div>
            <div
              className={clsx("w-full max-w-[348px] text-right", {
                hidden: isCalculated !== true,
              })}
            >
              <div
                className={clsx({
                  "scrollbar-none overflow-x-auto": isLongNumber(result),
                  "overflow-hidden": !isLongNumber(result),
                })}
              >
                <p
                  ref={resultRef}
                  className={clsx(`${getFontSizeClass(result)} text-white`, {
                    "whitespace-nowrap": isLongNumber(result),
                  })}
                >
                  {result}
                </p>
              </div>
            </div>
          </div>
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

'use client';

import { JSX, useState } from 'react';
import { BsPlusSlashMinus } from 'react-icons/bs';

type ButtonLabel = string | JSX.Element;

const line1: ButtonLabel[] = [
  'AC',
  <>
    <BsPlusSlashMinus />
  </>,
  '%',
  '÷',
];
const line2: ButtonLabel[] = ['7', '8', '9', '×'];
const line3: ButtonLabel[] = ['4', '5', '6', '-'];
const line4: ButtonLabel[] = ['1', '2', '3', '+'];
const line5: ButtonLabel[] = ['0', '.', '='];

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  return (
    <main>
      <p>{input || '0'}</p>
      <p>{result}</p>
      {line1.map((char, i) => (
        <button key={i}>{char}</button>
      ))}
      {line2.map((char, i) => (
        <button key={i}>{char}</button>
      ))}
      {line3.map((char, i) => (
        <button key={i}>{char}</button>
      ))}
      {line4.map((char, i) => (
        <button key={i}>{char}</button>
      ))}
      {line5.map((char, i) => (
        <button key={i}>{char}</button>
      ))}
    </main>
  );
}

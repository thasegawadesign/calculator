'use client';

import { JSX, useState } from 'react';
import { BsPlusSlashMinus } from 'react-icons/bs';

type ButtonLabel = { name: string; content: string | JSX.Element };

const line1: ButtonLabel[] = [
  { name: 'AC', content: 'AC' },
  {
    name: 'plusSlashMinus',
    content: (
      <>
        <BsPlusSlashMinus />
      </>
    ),
  },
  { name: '%', content: '%' },
  { name: '÷', content: '÷' },
];
const line2: ButtonLabel[] = [
  { name: '7', content: '7' },
  { name: '8', content: '8' },
  { name: '9', content: '9' },
  { name: '×', content: '×' },
];
const line3: ButtonLabel[] = [
  { name: '4', content: '4' },
  { name: '5', content: '5' },
  { name: '6', content: '6' },
  { name: '-', content: '-' },
];
const line4: ButtonLabel[] = [
  { name: '1', content: '1' },
  { name: '2', content: '2' },
  { name: '3', content: '3' },
  { name: '+', content: '+' },
];
const line5: ButtonLabel[] = [
  { name: '0', content: '0' },
  { name: '.', content: '.' },
  { name: '=', content: '=' },
];

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  return (
    <main>
      <p>{input || '0'}</p>
      <p>{result}</p>
      {line1.map((item) => (
        <button key={item.name}>{item.content}</button>
      ))}
      {line2.map((item) => (
        <button key={item.name}>{item.content}</button>
      ))}
      {line3.map((item) => (
        <button key={item.name}>{item.content}</button>
      ))}
      {line4.map((item) => (
        <button key={item.name}>{item.content}</button>
      ))}
      {line5.map((item) => (
        <button key={item.name}>{item.content}</button>
      ))}
    </main>
  );
}

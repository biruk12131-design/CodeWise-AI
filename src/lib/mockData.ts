import { Review, Snippet } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const initialReviews: Review[] = [
  {
    id: uuidv4(),
    code: `function add(a, b) {\n  return a + b;\n}`,
    language: 'JavaScript',
    rating: 'Good',
    inlineComments: [
      { line: 2, comment: 'Clear return statement.' }
    ],
    suggestions: ['Consider adding parameter type checking or migrating to TypeScript for robustness.'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: uuidv4(),
    code: `interface User {\n  id: any;\n  name: string;\n}\n\nconst user = { name: "Alice" };`,
    language: 'TypeScript',
    rating: 'Needs Improvement',
    inlineComments: [
      { line: 2, comment: "Using 'any' defeats the purpose of TypeScript." },
      { line: 5, comment: "Object does not conform to User interface (missing id)." }
    ],
    suggestions: [
      "Replace 'any' with 'string' or 'number' for the id field.",
      "Explicitly type the 'user' variable: const user: User = ..."
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  }
];

export const initialSnippets: Snippet[] = [
  {
    id: uuidv4(),
    title: 'Debounce Function',
    language: 'JavaScript',
    code: `function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
  },
  {
    id: uuidv4(),
    title: 'React Button Component',
    language: 'TypeScript',
    code: `import React from 'react';\n\ninterface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: 'primary' | 'secondary';\n}\n\nexport const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {\n  return <button className={\`btn \${variant}\`} {...props} />;\n};`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() // 3 days ago
  }
];

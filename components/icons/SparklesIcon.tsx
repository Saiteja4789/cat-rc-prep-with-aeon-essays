
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.94 18.06 12 15.44l2.06 2.62.62-4.06-3.24-2.24-3.24 2.24.62 4.06z" />
    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
    <path d="m22 2-2.5 2.5" />
    <path d="m14 2.5 2.5 2.5" />
    <path d="M2.5 14 5 11.5" />
    <path d="M2 22l2.5-2.5" />
  </svg>
);

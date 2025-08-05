"use client";

import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    // Import Prosto One font for general use
    const prostoLink = document.createElement('link');
    prostoLink.href = 'https://fonts.googleapis.com/css2?family=Prosto+One&display=swap';
    prostoLink.rel = 'stylesheet';
    document.head.appendChild(prostoLink);

    // Import Nova Flat font for FAQ section
    const novaLink = document.createElement('link');
    novaLink.href = 'https://fonts.googleapis.com/css2?family=Nova+Flat&display=swap';
    novaLink.rel = 'stylesheet';
    document.head.appendChild(novaLink);

    // Import Inter font for feature cards
    const interLink = document.createElement('link');
    interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    interLink.rel = 'stylesheet';
    document.head.appendChild(interLink);

    // Import Poppins font for FAQ and footer sections
    const poppinsLink = document.createElement('link');
    poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    poppinsLink.rel = 'stylesheet';
    document.head.appendChild(poppinsLink);

    return () => {
      document.head.removeChild(prostoLink);
      document.head.removeChild(novaLink);
      document.head.removeChild(interLink);
      document.head.removeChild(poppinsLink);
    };
  }, []);

  return null; // This component doesn't render anything
}
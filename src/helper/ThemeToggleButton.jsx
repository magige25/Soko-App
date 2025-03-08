import React, { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
    // 1. Initialize state for the current theme
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // 2. Function to update the theme on the HTML element
    const updateThemeOnHtmlEl = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
    };

    // 4. On initial render, set the theme from localStorage
    useEffect(() => {
        updateThemeOnHtmlEl(theme);
    }, [theme]);

    // 5. Toggle theme when button is clicked
    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeOnHtmlEl(newTheme);
    };

    return (
        <button
            type="button"
            className="position-relative border-0 bg-transparent p-0 d-flex justify-content-center align-items-center gap-1"
            data-theme-toggle
            aria-label={theme} 
            onClick={handleThemeToggle}
        >
        </button>
    );
};

export default ThemeToggleButton;
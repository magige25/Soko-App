import React, { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const updateThemeOnHtmlEl = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
    };

    useEffect(() => {
        updateThemeOnHtmlEl(theme);
    }, [theme]);

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeOnHtmlEl(newTheme);
    };

    return (
        <button
            type="button"
            className="position-relative text-xl border-0 bg-transparent p-0 d-flex justify-content-center align-items-center gap-1"
            data-theme-toggle
            aria-label={theme} 
            onClick={handleThemeToggle}
        >
        </button>
    );
};

export default ThemeToggleButton;
import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storageService';

const ThemeContext = createContext();

export function useTheme() {
	return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState('light');

	useEffect(() => {
		const saved = storageService.get('exposoftware_theme', 'light');
		setTheme(saved);
	}, []);

	useEffect(() => {
		storageService.set('exposoftware_theme', theme);
		// Optional: update document class
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', theme === 'dark');
		}
	}, [theme]);

	const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggle }}>
			{children}
		</ThemeContext.Provider>
	);
}

export default ThemeContext;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const session = authService.getSession();
		if (session && session.user) {
			setUser(session.user);
		}
		setLoading(false);
	}, []);

	const register = async (userData) => {
		try {
			const newUser = authService.register(userData);
			setUser(newUser);
			return { ok: true, user: newUser };
		} catch (e) {
			return { ok: false, error: e.message };
		}
	};

	const login = async (credentials) => {
		try {
			const logged = authService.login(credentials);
			setUser(logged);
			return { ok: true, user: logged };
		} catch (e) {
			return { ok: false, error: e.message };
		}
	};

	const logout = () => {
		authService.logout();
		setUser(null);
	};

	const value = { user, loading, register, login, logout };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

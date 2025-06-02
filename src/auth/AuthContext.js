import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem('cuidador');
    return data ? JSON.parse(data) : null;
  });

  const login = (data) => {
    setUser(data);
    localStorage.setItem('cuidador', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cuidador');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

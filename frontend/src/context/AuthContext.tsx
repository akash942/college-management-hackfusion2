// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  department?: string;
  year?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate college email
      if (!email.endsWith("@college.edu")) {
        throw new Error("Only college email addresses are allowed");
      }

      // Mock user data
      const userData: User = {
        id: "1",
        name: "John Doe",
        email,
        role: "student",
        department: "Computer Science",
        year: 3,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (error: any) {
      throw new Error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      // Validate college email
      if (!email.endsWith("@college.edu")) {
        throw new Error("Only college email addresses are allowed");
      }

      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: Date.now().toString(),
        name,
        email,
        role: "student",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (error: any) {
      throw new Error(error.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utilities/firebase";
import { PageSpinner } from "../components/Spinners";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setLoading(true);
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        currentUser,
        setLoading,
        setCurrentUser
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

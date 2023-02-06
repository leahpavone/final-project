import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utilities/firebase";
import { PageSpinner } from "../components/Spinners";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);
      setCurrentUser(auth.currentUser);
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
        // loggedIn,
        // setLoggedIn,
        setLoading,
        setCurrentUser
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

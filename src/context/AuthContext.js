import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utilities/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [pending, setPending] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setPending(true);
      setCurrentUser(auth.currentUser);
      setPending(false);
      // console.log(auth.currentUser);
    });
  }, []);

  if (pending) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        pending,
        currentUser,
        loggedIn,
        setLoggedIn,
        setPending,
        setCurrentUser
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

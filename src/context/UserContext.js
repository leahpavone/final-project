import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utilities/firebase";
import AuthContext from "./AuthContext";
import { PageSpinner } from "../components/Spinners";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        console.log("Current data: ", doc.data());
        setUser(doc.data());
        setLoading(false);
      });
    }
  }, [currentUser]);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

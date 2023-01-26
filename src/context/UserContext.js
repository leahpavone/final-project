// When a user logs in and the current user becomes available, you need to create a user context that fetches that specific users data from the user table.  I want you to use a listener that subscribes to changes on the user document.  See firebase documentation on how to go about doing this for a single document.

// You also need to update the user document with the photoURL when uploading a user's image on the user document

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  getDoc,
  doc,
  getDocs,
  onSnapshot,
  collection
} from "firebase/firestore";
import { auth, db } from "../utilities/firebase";
import AuthContext from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        console.log("Current data: ", doc.data());
        setUser(doc.data());
      });
    }
  }, [currentUser]);

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

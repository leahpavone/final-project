import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utilities/firebase";
import googleIcon from "../assets/googleIcon.svg";
import dayjs from "dayjs";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

function OAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // This gives you a Google Access Token.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;

      // Check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phoneNumber: "",
          birthday: "",
          photoURL: null,
          playlists: [],
          favorites: [],
          createdAt: dayjs(new Date()).format("M/D/YYYY h:mm A"),
          updatedAt: dayjs().format("M/D/YYYY h:mm A")
        });
        setLoading(false);
      }
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "10px"
      }}>
      <Button
        disableRipple
        onClick={onGoogleClick}
        sx={{
          cursor: "pointer",
          backgroundColor: "#fff !important",
          boxShadow: "0 0 2px rgba(255,255,255, 0.4)",
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          "&:hover": {
            backgroundColor: "#f0ebf4 !important",
            transition: "all 0.2s ease",
            boxShadow: "0 0 6px rgba(255,255,255, 0.5)"
          }
        }}>
        <img
          className="social-icon-img"
          src={googleIcon}
          alt="google"
          style={{ height: "24px", width: "24px" }}
        />
        <Typography
          sx={{
            lineHeight: 1,
            letterSpacing: "1px",
            fontSize: "14px",
            color: "primary.main"
          }}>
          Sign {location.pathname === "/register" ? "up" : "in"} with Google
        </Typography>
      </Button>
    </Box>
  );
}

export default OAuth;

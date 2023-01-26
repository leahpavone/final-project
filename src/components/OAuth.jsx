import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utilities/firebase";
import googleIcon from "../assets/googleIcon.svg";
import dayjs from "dayjs";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  FormHelperText,
  Link,
  Divider
} from "@mui/material";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
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
      // if (!docSnap.exists()) {
      //   await setDoc(doc(db, "users", user.uid), {
      //     name: user.displayName,
      //     email: user.email,
      //     createdAt: new Date()
      //   });
      // }
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
          createdAt: dayjs().format("M/D/YYYY h:mm A"),
          updatedAt: dayjs().format("M/D/YYYY h:mm A")
        });
      }
      navigate("/dashboard");
    } catch (error) {
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
          backgroundColor: "secondary.light",
          boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
          // opacity: "0.8",
          // width: "fit-content",
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          borderRadius: "4px",
          border: "none",
          // border: "2px solid",
          // borderColor: "accent.veryDark",
          "&:hover": {
            // border: "1px solid",
            // borderColor: "primary",
            // opacity: "0.5",
            backgroundColor: "secondary.light",
            transform: "scaleX(1.01)",
            // scale: "101%",
            transition: "all 0.2s ease",
            boxShadow: "0 0 6px rgba(0, 0, 0, 0.3)"
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
            fontSize: "14px"
          }}>
          Sign {location.pathname === "/register" ? "up" : "in"} with Google
        </Typography>
      </Button>
    </Box>
  );
}

export default OAuth;

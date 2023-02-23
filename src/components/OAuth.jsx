import { useState } from "react";
import dayjs from "dayjs";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utilities/firebase";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Box, Typography, Button, Divider } from "@mui/material";
import googleIcon from "../assets/googleIcon.svg";

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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
      <Box sx={{ pt: 1 }}>
        <Divider
          sx={{
            color: "rgba(181, 155, 202, 0.5)",
            // width: "95%",
            margin: "0 auto",
            "&::before": {
              borderTop: "thin solid rgba(181, 155, 202, 0.5)"
            },
            "&::after": {
              borderTop: "thin solid rgba(181, 155, 202, 0.5)"
            }
          }}>
          or
        </Divider>
      </Box>

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "rgba(181, 155, 202, 0.7)" }}>
          {location.pathname === "/register"
            ? "Already have an account?"
            : "Don't have an account yet?"}
        </Typography>
        <Button
          component={Link}
          variant="text"
          sx={{ fontSize: "16px", letterSpacing: "1px", p: 0 }}
          to={location.pathname === "/register" ? "/login" : "/register"}>
          {location.pathname === "/register" ? "Login" : "Create an account"}
        </Button>
      </Box>
    </Box>
  );
}

export default OAuth;

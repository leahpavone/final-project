import { useContext, useEffect, useState } from "react";
import { Avatar, Button, Box } from "@mui/material";
import { auth, storage, db } from "../utilities/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import UserContext from "../context/UserContext";
import { updateDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";

// ! Question : when to set loading back to false

const UploadProfilePhoto = () => {
  const [photoURL, setPhotoURL] = useState(<Avatar />);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    const photoRef = ref(storage, user.uid);
    await uploadBytes(photoRef, photo)
      .then(() => {
        getDownloadURL(photoRef)
          .then((url) => {
            setPhotoURL(url);
            updateProfile(auth.currentUser, {
              photoURL: url
            });

            // update user doc
            const docRef = doc(db, "users", user.uid);
            updateDoc(docRef, {
              photoURL: url,
              updatedAt: dayjs().format("M/D/YYYY h:mm A")
            })
              .then(() => {
                console.log(url, "successfully updated photo");
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        setLoading(false);
        setPhoto(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    if (user && user.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  console.log(user);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: "30px"
      }}>
      <Box>
        {photoURL ? (
          <Avatar
            src={photoURL.toString()}
            sx={{ width: 175, height: 175, mb: "10px" }}
          />
        ) : (
          <Avatar />
        )}
      </Box>
      {!photo ? (
        <Button
          variant="contained"
          component="label"
          sx={{
            height: "30px",
            width: "250px",
            color: "accent.main"
          }}>
          Change profile photo
          <input type="file" accept="image/*" onChange={handleChange} hidden />
        </Button>
      ) : (
        <Box>
          <LoadingButton
            variant="contained"
            sx={{ height: "30px", width: "250px", color: "accent.main" }}
            loading={loading}
            onClick={handleClick}>
            <span>Upload</span>
          </LoadingButton>
          {photo.name}
        </Box>
      )}
    </Box>
  );
};

export default UploadProfilePhoto;

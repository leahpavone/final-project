import { useContext, useState } from "react";
import { Avatar, Button, Box } from "@mui/material";
import { storage, db } from "../utilities/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import UserContext from "../context/UserContext";
import { updateDoc, doc } from "firebase/firestore";
import dayjs from "dayjs";
import { UploadProfilePhotoSpinner } from "./Spinners";

const UploadProfilePhoto = () => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const handleChange = async (e) => {
    setUploadingPhoto(true);
    const value = e?.target?.files[0];
    await handleUpload(value);
    console.log("after change", value);
    setUploadingPhoto(false);
  };

  //  over write user image name to be the same every time

  const handleUpload = async (photo) => {
    setLoading(true);
    const photoRef = ref(storage, user.uid);
    try {
      await uploadBytes(photoRef, photo);
      const url = await getDownloadURL(photoRef);
      // const namedUrl = ``
      console.log("url", url);
      // update user doc
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        photoURL: url,
        updatedAt: dayjs().format("M/D/YYYY h:mm A")
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  if (loading) {
    return <UploadProfilePhotoSpinner />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center"
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: (theme) => `4px solid ${theme.palette.accent.active}`,
          borderRadius: "500px"
        }}>
        {loading ? (
          <UploadProfilePhotoSpinner />
        ) : (
          <Box>
            {user?.photoURL ? (
              <Avatar
                src={user.photoURL.toString()}
                sx={{ width: 96, height: 96 }}
              />
            ) : (
              <Avatar sx={{ width: 96, height: 96 }} />
            )}
          </Box>
        )}
      </Box>
      <Button
        size="small"
        disabled={uploadingPhoto}
        variant="contained"
        component="label"
        sx={{
          width: "max-content",
          height: "20px"
        }}>
        Change avatar
        <input type="file" accept="image/*" onChange={handleChange} hidden />
      </Button>
    </Box>
  );
};

export default UploadProfilePhoto;

import { useContext, useState } from "react";
import dayjs from "dayjs";
import { storage, db } from "../utilities/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import UserContext from "../context/UserContext";
import { UploadProfilePhotoSpinner } from "./Spinners";
import { Avatar, Button, Box } from "@mui/material";

const UploadProfilePhoto = () => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const handleChange = async (e) => {
    setUploadingPhoto(true);
    const value = e?.target?.files[0];
    await handleUpload(value);
    setUploadingPhoto(false);
  };

  const handleUpload = async (photo) => {
    setLoading(true);
    const photoRef = ref(storage, `User Images/${user.name}/Profile Photo`);
    try {
      await uploadBytes(photoRef, photo);
      const url = await getDownloadURL(photoRef);

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

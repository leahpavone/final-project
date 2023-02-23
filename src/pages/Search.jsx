import { useState, useContext } from "react";
import UserDrawer from "../components/UserDrawer";
import NoUserDrawer from "../components/NoUserDrawer";
import AccountMenu from "../components/AccountMenu";
import AuthContext from "../context/AuthContext";
import UserContext from "../context/UserContext";
import { PageSpinner } from "../components/Spinners";
import { ArrowBack, ArrowForward, SearchOutlined } from "@mui/icons-material";
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Fade,
  Button
} from "@mui/material";
// import { Link } from "react-router-dom";

const Search = () => {
  const [searchedValue, setSearchedValue] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { user } = useContext(UserContext);

  if (loading) {
    return <PageSpinner />;
  }

  const handleChange = (e) => {
    setSearchedValue(e.target.value);
    // console.log(e.target.value);
    setSearchSubmitted(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchSubmitted(true);
    console.log(searchedValue);
  };

  return (
    <Container
      maxWidth="100vw"
      sx={{
        height: "100vh",
        backgroundColor: "primary.main",
        display: "flex",
        flexDirection: "column"
        // overflow: "hidden"
      }}>
      {currentUser ? <UserDrawer /> : <NoUserDrawer />}
      <AccountMenu />
      <Fade in={true} timeout={500}>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: { xs: "90%", md: "70%" },
            height: "100%",
            ml: { xs: "auto", md: "220px" }
          }}>
          <Typography variant="h4" sx={{ p: 3 }}>
            Search for your favorite music
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "50%",
              height: "fit-content",
              display: "flex",
              gap: "10px"
            }}>
            <TextField
              onChange={handleChange}
              // size="small"
              fullWidth
              sx={{
                input: {
                  "&::placeholder": {
                    fontSize: "18px"
                  }
                }
              }}
              placeholder="What would you like to listen to?"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {<SearchOutlined fontSize="large" />}
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit" variant="contained">
              <ArrowForward />
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "100%"
            }}>
            <Typography variant="h5">
              {searchSubmitted ? `Results for '${searchedValue}'` : ""}
            </Typography>
          </Box>
        </Container>
      </Fade>
    </Container>
  );
};

export default Search;

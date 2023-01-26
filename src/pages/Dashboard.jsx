import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, storage } from "../utilities/firebase";
import axios from "axios";
import UserContext from "../context/UserContext";
import { Button } from "@mui/material";
import AccountMenu from "../components/AccountMenu";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <div className="page-ctr">
      <AccountMenu />
      <h1>Dashboard</h1>
      <h1 className="greeting-header">Hi, {user?.name}</h1>
    </div>
  );
};

export default Dashboard;

import { Container } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import LoaderWrapper from "./components/hoc/LoaderWrapper";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import FriendsPage from "./components/pages/FriendsPage";
import SignupPage from "./components/pages/SignupPage/SignupPage";
import ProtectedRoute from "./components/hoc/ProtectedRoute";
import NavBar from "./components/ui/NavBar";
import { checkAuthAsync } from "./redux/actions/authActions";
import { socketInit } from "./redux/actions/wsActions";
import GamePage from "./components/pages/GamePage/GamePage";

function App() {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // Проверка авторизации
    dispatch(checkAuthAsync());
  }, []);

  useEffect(() => {
    if (authUser?.id) {
      dispatch(socketInit());
    }
  }, [authUser?.id]);

  return (
    <Container>
      <LoaderWrapper>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute isAllowed={!authUser?.id} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route element={<ProtectedRoute isAllowed={!!authUser?.id} />}>
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/game" element={<GamePage />} />
          </Route>
        </Routes>
      </LoaderWrapper>
    </Container>
  );
}

export default App;

import { Navigate, Route, Routes } from "react-router-dom";
import ExplorePage from "../pages/ExplorePage";
import GameDetailsPage from "../pages/GameDetailsPage";
import HomePage from "../pages/HomePage";
import MyLibraryPage from "../pages/MyLibraryPage";
import CommunityPage from "../pages/CommunityPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MainLayout from "../components/layouts/MainLayout";

function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to={"/home"} replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/library" element={<MyLibraryPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/game/:id" element={<GameDetailsPage />} />
        
        
      </Route>
    </Routes>
  );
}

export default AppRoute;

import { Navigate, Route, Routes } from "react-router-dom";
import ExplorePage from "../pages/ExplorePage";
import GameDetailsPage from "../pages/GameDetailsPage";
import HomePage from "../pages/HomePage";
import MyLibraryPage from "../pages/MyLibraryPage";
import CommunityPage from "../pages/CommunityPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MainLayout from "../components/layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/ProfilePage";
import ScrollToTop from "../components/ScrollToTop";
import ProfilePictureUpload from "../components/ProfilePictureUpload";

function AppRoute() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to={"/home"} replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/game/:id" element={<GameDetailsPage />} />
          <Route path="/test" element={<ProfilePictureUpload/>}/>

          {/* Protect route */}
          <Route element={<PrivateRoute />}>
            <Route path="/library" element={<MyLibraryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default AppRoute;

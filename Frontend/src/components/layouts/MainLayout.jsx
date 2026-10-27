import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950 text-mist-100">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;

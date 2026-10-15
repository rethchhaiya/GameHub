import { Route, Routes } from "react-router-dom";
import ExplorePage from "../pages/ExplorePage";
import GameDetailsPage from "../pages/GameDetailsPage";

function AppRoute(){
    return(
        <Routes>
            <Route path="/" element={<ExplorePage/>}/>
            <Route path="/game/:id" element={<GameDetailsPage/>} />
        </Routes>
    )
}

export default AppRoute;
import { BrowserRouter } from "react-router-dom";
import AppRoute from "./routes";
import ProfilePictureUpload from "./components/ProfilePictureUpload";

function App() {
  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}

export default App;

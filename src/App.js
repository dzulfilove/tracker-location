import logo from "./logo.svg";
import "./App.css";
import MyLocation from "./pages/map";
import DistanceCalculator from "./tracker";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import MyTrip from "./pages/trip";
import History from "./pages/history";
import InputTrip from "./pages/inputTrip";
import BackTrip from "./pages/backTrip";
import DetailTrip from "./pages/detailTrip";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />

          {isLoggedIn ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mytrip" element={<MyTrip />} />
              <Route path="/history" element={<History />} />
              <Route path="/input-trip/:id" element={<InputTrip />} />
              <Route path="/arrive-trip" element={<BackTrip />} />
              <Route path="/detail-trip" element={<DetailTrip />} />
            </>
          ) : null}
        </Routes>
      </Router>
      {/* <Auth /> */}
    </div>
  );
}

export default App;

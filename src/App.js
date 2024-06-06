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
import Camera from "./components/camera";
import DashboardAdmin from "./pages/dashboardAdmin";
import Home from "./components/sidebar";
import React, { useState, useEffect } from "react";
import { db } from "../src/config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
function App() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail");
    getUser(userEmail);
    // you can use the userData here, or set it to state using setUser
  }, []);
  const getUser = async (email) => {
    try {
      const userRef = collection(db, "User");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userData = querySnapshot.docs[0].data();
      console.log(userData.peran, "userrrrr");

      await new Promise((resolve) => {
        setUser(userData);
        setIsUser(true);
      });

      return userData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <div>
      <Router>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Dashboard />} />
              {isUser == true && (
                <>
                  {user.peran == "Scrum Master" && (
                    <>
                      <Route path="/dashboard" element={<Home />} />
                    </>
                  )}
                  {user.email == "akuntingkosasih@gmail.com" && (
                    <>
                      <Route path="/dashboard" element={<Home />} />
                    </>
                  )}
                </>
              )}

              <Route path="/mytrip" element={<MyTrip />} />
              <Route path="/history" element={<History />} />
              <Route path="/input-trip/:id" element={<InputTrip />} />
              <Route path="/arrive-trip/:idTrip" element={<BackTrip />} />
              <Route path="/detail-trip/:idTrip" element={<DetailTrip />} />
              <Route path="/camera" element={<Camera />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Auth />} />
            </>
          )}
        </Routes>
      </Router>
      {/* <Auth /> */}
    </div>
  );
}

export default App;

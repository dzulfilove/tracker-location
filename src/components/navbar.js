import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/navbar.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
function Navbar() {
  const navRef = useRef();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(false);

  let login = false;
  if (isLoggedIn) {
    login = true;
  }
  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
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
      console.log(userData.email, "userrrrr");

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

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    Swal.fire(
      {
        icon: "success",
        title: "Berhasil",
        text: "Berhasil Logout ",
        showConfirmButton: false,
        timer: 1500,
      },
      () => {}
    );
    window.location.href = "/";
  };
  return (
    <header className=" navbar-desktop w-6 ml-2 h-6 p-3 flex justify-center items-center rounded-md font-DM text-medium">
      <nav ref={navRef} className="bg-blue-600 text-white ">
        {login == false && (
          <>
            <Link
              loading="lazy"
              to="/"
              onClick={showNavbar}
              className="flex justify-start items-center gap-4 w-[8rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g fill="white">
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06z" />
                  <path d="m12 5.432l8.159 8.159q.045.044.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198l.091-.086z" />
                </g>
              </svg>
              <div>Beranda</div>
            </Link>
          </>
        )}
        {login == true && isUser == true && (
          <>
            {user.peran == "Scrum Master" && (
              <>
                <Link
                  loading="lazy"
                  to="/dashboard"
                  onClick={showNavbar}
                  className="flex justify-start items-center gap-4 w-[15rem]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g fill="white">
                      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06z" />
                      <path d="m12 5.432l8.159 8.159q.045.044.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198l.091-.086z" />
                    </g>
                  </svg>
                  <div>Dashboard Admin</div>
                </Link>
              </>
            )}

            {user.email == "maisyarohsiti564@gmail.com" && (
              <>
                <Link
                  loading="lazy"
                  to="/dashboard"
                  onClick={showNavbar}
                  className="flex justify-start items-center gap-4 w-[15rem]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g fill="white">
                      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06z" />
                      <path d="m12 5.432l8.159 8.159q.045.044.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198l.091-.086z" />
                    </g>
                  </svg>
                  <div>Dashboard Admin</div>
                </Link>
              </>
            )}

            <Link
              loading="lazy"
              to="/"
              onClick={showNavbar}
              className="flex justify-start items-center gap-4 w-[10rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g fill="white">
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06z" />
                  <path d="m12 5.432l8.159 8.159q.045.044.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198l.091-.086z" />
                </g>
              </svg>
              <div>Dashboard</div>
            </Link>
            <Link
              loading="lazy"
              to="/mytrip"
              onClick={showNavbar}
              className="flex justify-center items-center gap-4 w-[15rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 512 512"
              >
                <path
                  fill="white"
                  d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468c-59.015.042-113.223-20.53-155.822-54.911c-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184c0-101.705-82.311-184-184-184c-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531m-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21"
                />
              </svg>
              <div>Perjalanan Hari Ini</div>
            </Link>
            <Link
              loading="lazy"
              to="/history"
              onClick={showNavbar}
              className="flex justify-start items-center gap-4 w-[8rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 8 8"
              >
                <path
                  fill="white"
                  d="M0 0v3h3V0zm4 0v1h4V0zm0 2v1h3V2zM0 4v3h3V4zm4 0v1h4V4zm0 2v1h3V6z"
                />
              </svg>
              <div>Riwayat</div>
            </Link>
            <button
              loading="lazy"
              onClick={logout}
              className="flex justify-start items-center gap-4 w-[8rem] text-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M4 12a1 1 0 0 0 1 1h7.59l-2.3 2.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4-4a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76a1 1 0 0 0-.21-.33l-4-4a1 1 0 1 0-1.42 1.42l2.3 2.29H5a1 1 0 0 0-1 1M17 2H7a3 3 0 0 0-3 3v3a1 1 0 0 0 2 0V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3a1 1 0 0 0-2 0v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3"
                />
              </svg>
              <div>Logout</div>
            </button>
          </>
        )}

        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button
        className="p-2 w-11 h-11 flex justify-center items-center bg-blue-500 rounded-full shadow-md"
        onClick={showNavbar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="white" d="M3 4h18v2H3zm0 7h12v2H3zm0 7h18v2H3z" />
        </svg>
      </button>
    </header>
  );
}

export default Navbar;

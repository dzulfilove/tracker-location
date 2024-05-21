import * as React from "react";
import Logo from "../assets/logo.png";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userEmail", email);
      Swal.fire(
        {
          icon: "success",
          title: "Berhasil",
          text: "Selamat, Anda Berhasil Masuk ",
          showConfirmButton: false,
          timer: 1500,
        },
        () => {
          window.location.href = `/dashboard`;
        }
      );
      window.location.href = `/dashboard`;

      console.log("Login successful");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Anda Gagal Masuk, Periksa Kembali Passowrd dan Email Anda ",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
  };
  render() {
    return (
      <div className="flex font-DM flex-col pb-20 mx-auto  font-semibold text-blue-500 bg-white  leading-[140%] w-full rounded-[32px]">
        <div className="flex flex-col items-center p-10 w-full text-2xl bg-white rounded-b-[7rem] shadow-md h-[10rem">
          <img
            loading="lazy"
            srcSet={Logo}
            className="aspect-[1.12] w-[160px] h-[160px] object-cover "
          />
          <div className="mt-4 mb-1 text-3xl">Trip Tracer App</div>
        </div>
        <div className="flex flex-col px-9 mt-9 w-full font-medium text-sm">
          <div>Masukkan E-mail Anda</div>
          <input
            type="text"
            value={this.state.email}
            onChange={this.handleEmailChange}
            className=" px-3 shrink-0 mt-3.5 h-11 text-slate-900 bg-white rounded-2xl border border-solid border-blue-500 shadow-[0px_4px_15px_rgba(0,0,0,0.11)]"
          />
          <div className="mt-7">Masukkan Password Anda</div>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            className="px-3 shrink-0 mt-3.5 h-11 bg-white text-slate-900 rounded-2xl border border-solid border-blue-500 shadow-[0px_4px_15px_rgba(0,0,0,0.11)]"
          />
          <button
            onClick={this.handleSubmit}
            className="flex gap-5 justify-center items-center mt-16 p-3 text-base font-bold tracking-wide leading-7 text-center shadow-lg text-white whitespace-nowrap bg-blue-500 rounded-2xl"
          >
            <div>Masuk</div>
          </button>
        </div>
      </div>
    );
  }
}

export default Auth;

import React from "react";
import backgroundImage from "../../assets/tajmahal.jpg";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogo = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row md:min-h-screen bg-gradient-to-b from-teal-50 to-teal-200">
      {/* Left Section */}
      <div
        className="md:flex-[1.5] bg-cover bg-center relative md:rounded-r-[50px] overflow-hidden min-h-[50vh] md:min-h-full"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute top-8 left-8 md:top-12 md:left-14 md:ml-10">
          <img src={logo} alt="Travso Logo" className="w-32 md:w-40 cursor-pointer" onClick={handleLogo} />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white text-left md:ml-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Landing page</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-[1] flex justify-center items-center min-h-[50vh] md:min-h-full">
        <div className="rounded-lg w-11/12 md:w-3/4 lg:w-3/5 flex flex-col gap-28">
          <h2 className="text-[25px] font-semibold text-center">
            <button className="bg-teal-400 text-white font-semibold rounded-md hover:bg-teal-500 transition p-2 w-32" onClick={handleLogin}>Login</button>
          </h2>
          <h2 className="text-[25px] font-semibold text-center">
            <button className="bg-teal-400 text-white font-semibold rounded-md hover:bg-teal-500 transition p-2 w-32" onClick={handleSignup}>Signup</button>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
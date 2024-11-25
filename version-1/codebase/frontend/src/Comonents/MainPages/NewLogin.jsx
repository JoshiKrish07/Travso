import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import backgroundImage from "../../assets/Image.png";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const NewLogin = () => {
  const navigate = useNavigate();
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("mobile"); // 'mobile' or 'email'
  const [step, setStep] = useState(1); // Track if we're on the input, verify, or password creation step
  const [otp, setOtp] = useState(["", "", "", ""]); // For handling OTP input
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogo = () => navigate("/");
  const toggleForgotPassword = () => {
    setForgotPasswordOpen(!isForgotPasswordOpen);
    setStep(1);
  };
  const handleNext = () => setStep(2); // Move to the "Verify" step
  const handleBackToInput = () => setStep(1); // Move back to the input step
  const handleVerify = () => setStep(3); // Move to password creation step

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only allow single digit
    setOtp(newOtp);
  };

  const handleSubmitPassword = () => {
    // Handle password submission logic here
    console.log("Create Password:", createPassword);
    console.log("Confirm Password:", confirmPassword);
    // Close the modal after submission
    setForgotPasswordOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row md:h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      {/* Left Section */}
      <div
        className="md:flex-[1.5] bg-cover bg-center relative md:rounded-r-[50px] overflow-hidden min-h-[50vh] md:min-h-full"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div
          className="absolute top-8 left-8 md:top-12 md:left-12 md:ml-10 cursor-pointer"
          onClick={handleLogo}
        >
          <img src={logo} alt="Travso Logo" className="w-32 md:w-40" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white text-left md:ml-10">
          <h1 className="text-3xl md:text-5xl font-bold">
            The Whole World <br /> in One Place
          </h1>
          <p className="mt-4 text-sm md:text-base">
            Discover the most unique places, experiences, <br /> and amazing
            homes around the world.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-[1] flex justify-center items-center min-h-[50vh] md:min-h-full">
        <div className="rounded-lg w-11/12 md:w-3/4 lg:w-3/5">
          <h2 className="text-[36px] font-semibold mb-4 mt-2 text-center font-poppins text-customBlack">
            Login
          </h2>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="User Name"
              className=" bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
            />
            <button
              type="submit"
              className="mt-5 w-full py-2 bg-teal-400 text-white font-semibold rounded-md hover:bg-teal-500 transition"
            >
              Sign in
            </button>
          </form>
          <p className="text-right mt-2 pb-10 md:pb-0 text-base">
            <a
              className="text-teal-600 hover:underline"
              onClick={toggleForgotPassword}
            >
              Forgot Password?
            </a>
          </p>
          <p className="text-center mt-10 pb-10 md:pb-0 text-base">
            Don’t have an account?{" "}
            <a href="/signup" className="text-teal-600 hover:underline">
              Signup
            </a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-1/2 lg:w-1/4 relative">
            <FontAwesomeIcon
              icon={faTimes}
              onClick={toggleForgotPassword}
              className="bg-black p-1 rounded absolute top-4 right-4 text-white cursor-pointer hover:text-white hover:bg-[#2DC6BE]" 
              size="lg"
            />

            <h3 className="text-2xl font-semibold text-center mb-8">
              Forgot Password
              <hr />
            </h3>

            {step === 1 && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => {
                    setActiveTab("email");
                    handleBackToInput();
                  }}
                  className={`mx-4 px-4 py-2 ${
                    activeTab === "email"
                      ? "bg-teal-400 text-white"
                      : "bg-gray-200 text-black"
                  } rounded-2`}
                >
                  Email ID
                </button>
                <button
                  onClick={() => {
                    setActiveTab("mobile");
                    handleBackToInput();
                  }}
                  className={`px-4 px-4 py-2 ${
                    activeTab === "mobile"
                      ? "bg-teal-400 text-white"
                      : "bg-gray-200 text-black"
                  } rounded-2`}
                >
                  Mobile No.
                </button>
              </div>
            )}

            <div className="p-4">
              {step === 1 && (
                <div>
                  {activeTab === "email" && (
                    <form>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                      />
                      <button
                        onClick={handleNext}
                        className="mt-4 w-full py-2 bg-teal-400 text-white font-semibold rounded-md hover:bg-teal-500 transition"
                      >
                        Next
                      </button>
                    </form>
                  )}
                  {activeTab === "mobile" && (
                    <form>
                      <input
                        type="number"
                        placeholder="Mobile Number"
                        className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                      />
                      <button
                        onClick={handleNext}
                        className="mt-4 w-full py-2 bg-teal-400 text-white font-semibold rounded-md hover:bg-teal-500 transition"
                      >
                        Next
                      </button>
                    </form>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="flex-col justify-center space-x-2">
                  <p className="text-left mb-5 text-lg">Please Enter the OTP</p>
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-10 h-10 text-center border border-[#2DC6BE] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                    />
                  ))}
                  <button
                    onClick={handleVerify}
                    className="mt-4 w-full py-2 bg-teal-400 text-white font-semibold rounded-md hover:bg-teal-500 transition"
                  >
                    Verify
                  </button>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmitPassword}>
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className="bg-white w-full p-2 mb-4 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white w-full p-2 mb-4 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                  />
                  <button
                    type="submit"
                    className="mt-4 w-full py-2 bg-teal-400 text-white font-semibold rounded-md hover:bg-teal-500 transition"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewLogin;
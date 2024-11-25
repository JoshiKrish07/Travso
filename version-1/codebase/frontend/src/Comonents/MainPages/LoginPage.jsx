
import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/Image.png';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from 'react-redux';
import OTPInput from "react-otp-input";
import { getEmailOTP, getMobileOTPForgotPass, loginUser, updatePassword, verifyForgotPassOTP } from '../../redux/slices/authSlice';
import SuccessError from '../OtherPages/SuccessError';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [formDataError, setFormDataError] = useState({});
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("mobile");
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState(["", "", "", ""]); 
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState('');
  const [flashMsgType, setFlashMsgType] = useState('');
  
  /* forgot password input states starts*/
  const [fpFormData, setFpFormData] = useState({
    userName: '',
    email: "",
    mobileNumber: "",
    otp: "",
    password:'',
    confirmPassword:''
  });
  const [fpFormDataError, setFpFormDataError] = useState({});
  const [otpVal, setOtpVal] = useState("");
  const [otpError, setOtpError] = useState("");

  /* forgot password input states ends */

  const toggleForgotPassword = () => {
    setFpFormDataError({});
    setFpFormData({
      userName: '',
      email: "",
      mobileNumber: "",
      otp: "",
      password:'',
      confirmPassword:''
    });
    setForgotPasswordOpen(!isForgotPasswordOpen);
    setStep(1);
    // setStep(2);
  };

  const handleNext = async() =>{ 
    const isValidate = await validateFpInputs();

    /* for email OTP */
    if(isValidate && activeTab === 'email'){
      try {
        const otpResult = await dispatch(getEmailOTP(fpFormData)).unwrap();
        if(otpResult) {
          handleFlashMessage(otpResult.message, 'success');
          setStep(2);
        }
      } catch (error) {
        console.log("error in email otp", error);
        const errorMessage = error.error || 'Something went wrong';
        handleFlashMessage(errorMessage, 'error');
      }
      
    } 


    /* for mobile OTP */
    if(isValidate && activeTab === 'mobile'){
      try {
        const otpResult = await dispatch(getMobileOTPForgotPass(fpFormData)).unwrap();
        if(otpResult) {
          handleFlashMessage(otpResult.message, 'success');
          setStep(2);
        }

      } catch (error) {
        console.log("error in mobile otp", error);
        const errorMessage = error.error || 'Something went wrong';
        handleFlashMessage(errorMessage, 'error');
      }
      
    } 
  } 
  
  const handleBackToInput = () => setStep(1); 

  const handleVerify = async() => {
    // const isValidate = await validateFpInputs();
    if (otpVal.length !== 4) {
      setOtpError("*Enter all values");
      return;
    }

    /* for email OTP verification */
    // if(isValidate){
      try {
        // const verifyOTPResult = await dispatch(verifyForgotPassOTP({email: fpFormData.email, mobileNumber: fpFormData.mobileNumber, userName: fpFormData.userName, otp:otp.join('')})).unwrap();
        const verifyOTPResult = await dispatch(verifyForgotPassOTP({email: fpFormData.email, mobileNumber: fpFormData.mobileNumber, userName: fpFormData.userName, otp: otpVal})).unwrap();
        // console.log("===verifyOTPResult===>", verifyOTPResult)
        if(verifyOTPResult) {
          handleFlashMessage(verifyOTPResult.message, 'success');
          setOtpVal("");
          setStep(3);
        }
      } catch (error) {
        console.log("error in email otp", error);
        const errorMessage = error.error || 'Something went wrong';
        handleFlashMessage(errorMessage, 'error');
      }
      
    // } 

  }; 

  // const handleOtpChange = (index, value) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = value.slice(-1); 
  //   setOtp(newOtp);
  //   setFpFormDataError((prevData) => ({
  //     ...prevData,
  //     'otpError': '',
  //   }));
  // };

  const handleOtpChange = (otp) => {
    setOtpError("");
    const numericOtp = otp.replace(/[^0-9]/g, "");
    if (numericOtp) setOtpVal(numericOtp);
  };

  const handleSubmitPassword = async(e) => {
    e.preventDefault();
    const isValidate = await validateFpInputs();
    if(isValidate){
        try {
          const updatePassResult = await dispatch(updatePassword({email: fpFormData.email, mobileNumber: fpFormData.mobileNumber, userName: fpFormData.userName, password: fpFormData.password})).unwrap();
          console.log("===updatePassResult===>", updatePassResult)
        if(updatePassResult) {
          handleFlashMessage(updatePassResult.message, 'success');
          setFpFormData({
            userName: '',
            email: "",
            mobileNumber: "",
            otp: "",
            password:'',
            confirmPassword:''
          });
          setForgotPasswordOpen(false);
        }
        } catch (error) {
          console.log("error in password update otp", error);
        const errorMessage = error.error || 'Something went wrong';
        handleFlashMessage(errorMessage, 'error');
        }
    } else {
      console.log("all values are required")
    }
    // setForgotPasswordOpen(false);
  };


  /* handle forgot password Inputs */
  const handleForgotPassInputs = (e) => {
    const { name, value } = e.target;
    setFpFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    /* remove if field is value filled */
    Object.keys(fpFormDataError).forEach((inputName) => {
      if(inputName === name && value !== '') {
          delete fpFormDataError[inputName];
      }
    });
  }

  /* handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    Object.keys(formDataError).forEach((inputName) => {
      if(inputName === name && value !== '') {
          delete formDataError[inputName];
      }
  });
};

// validate forgot passwords input
const validateFpInputs = async() => {
  let formErrors = {};
  if(step === 1 && activeTab === "email") {

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fpFormData.email) {
      formErrors.email = "*Email is required";
    } else if (!emailPattern.test(fpFormData.email)) {
      formErrors.email = "*Invalid email format";
    }

    // User Name validation
    if (!fpFormData.userName.trim()) {
      formErrors.userName = "*User name is required";
    }

    setFpFormDataError(formErrors);
    return Object.keys(formErrors).length === 0;
  } 
  else if (step === 1 && activeTab === "mobile") {
    // Mobile validation
    const mobilePattern = /^[0-9]{10}$/;
    if (!fpFormData.mobileNumber) {
      formErrors.mobileNumber = "*Mobile number is required";
    } else if (!mobilePattern.test(fpFormData.mobileNumber)) {
      formErrors.mobileNumber = "*Mobile number should be 10 digits";
    }

    // User Name validation
    if (!fpFormData.userName.trim()) {
      formErrors.userName = "*User name is required";
    }

    setFpFormDataError(formErrors);
    return Object.keys(formErrors).length === 0;

  } 
  /* handle password and confirm password validation */
  else if(step === 3) {
      // Password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/;
    if (!fpFormData.password) {
        formErrors.password = "*Password is required";
    } else if (!passwordPattern.test(fpFormData.password)) {
        formErrors.password = "*Password must be at least 6 characters, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    // confirm password validation
    if (!fpFormData.confirmPassword) {
      formErrors.confirmPassword = "*Confirm password is required";
    } else if (fpFormData.confirmPassword !== fpFormData.password) {
        formErrors.confirmPassword = "*Passwords do not match";
    }

    setFpFormDataError(formErrors);
    return Object.keys(formErrors).length === 0;
  }
}

// checking for input field validation
const validateInputs = async() => {

  let formErrors = {};

  // User Name validation
  if (!formData.username.trim()) {
    formErrors.username = "*User name is required";
  }

  // Password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/;
    if (!formData.password) {
        formErrors.password = "*Password is required";
    } else if (!passwordPattern.test(formData.password)) {
        formErrors.password = "*Password must be at least 6 characters, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    setFormDataError(formErrors);
    return Object.keys(formErrors).length === 0;

}

// to show flash message
// handle flash messages show
const handleFlashMessage = (errorMessage, msgType) => {
  setFlashMessage(errorMessage);
  setFlashMsgType(msgType);
  setTimeout(() => {
    setFlashMessage("");
    setFlashMsgType("");
  }, 3000); // Hide the message after 3 seconds
}

const handleSubmit = async(e) => {
  e.preventDefault();
  const isValid = await validateInputs();

  if(isValid) {
    console.log("yes valid form")
    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      if(response.error) {
        handleFlashMessage(response.error, 'error');
      } else {
        localStorage.setItem("token", response.token);
        handleFlashMessage(response.message, 'success');
      }
    } catch (error) {
      console.log("error at login page catch block", error);
      const errorMessage = error.error || "something went wrong";
      handleFlashMessage(errorMessage, 'error')
    }
    // navigate("/header")
  } else {
    console.log("not a valid form")
  }

}

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-b from-teal-50 to-teal-200">
      {flashMessage && <SuccessError message={flashMessage} messageType={flashMsgType}/>}

      {/* Left Section */}
      <div
        className="flex-[1.5] bg-cover bg-center relative md:rounded-r-[50px] overflow-hidden"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute top-8 left-8 md:top-12 md:left-12 md:ml-10">
          <img src={logo} alt="Travso Logo" className="w-32 md:w-40" /> {/* Logo size and responsiveness */}
        </div>
        <div className=" absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white text-left md:ml-10">
          <h1 className="text-4xl md:text-5xl font-bold">The Whole World <br/> in One Place</h1>
          <p className="mt-4 text-sm md:text-base">
            Discover the most unique places, experiences,<br/> and amazing homes around the world.
          </p>
          <div className="flex justify-between items-center mt-8">
            <span className="text-sm">03 — 03</span>
            <div className="flex space-x-2">
              {/* Dots */}
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="w-2 h-2 bg-white opacity-50 rounded-full"></span>
              <span className="w-2 h-2 bg-white opacity-50 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-[1] flex justify-center items-center">
        <div className="rounded-lg w-11/12 md:w-3/4 lg:w-3/5">
          <h2 className="text-[32px] font-semibold mb-4 mt-2 text-center">Login</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="username"
                placeholder="User Name"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
                  {formDataError.username && <p className="error text-left text-[#ff0000] text-sm">{formDataError.username}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              {formDataError.password && <p className="error text-left text-[#ff0000] text-sm">{formDataError.password}</p>}
            </div>
            <button
              type="submit"
              className="mt-5 w-full py-2 bg-teal-400 text-[white] font-semibold rounded-md hover:bg-teal-500 transition"
            >
              Sign In
            </button>
          </form>
          <p className="text-right mt-2 pb-10 md:pb-0 text-base">
            <Link
              className="text-teal-600 hover:underline"
              onClick={toggleForgotPassword}
            >
              Forgot Password?
            </Link>
          </p>
          <p className="text-center mt-10 pb-10 md:pb-0 text-base">
            Don’t have an account? <Link to="/signup" className="text-teal-600 hover:underline">Signup</Link>
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
                      <div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={fpFormData.email}
                          name='email'
                          onChange={handleForgotPassInputs}
                          className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                        />
                        {fpFormDataError.email && <p className="error text-left text-[#ff0000] text-sm">{fpFormDataError.email}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="User Name"
                          value={fpFormData.userName}
                          name='userName'
                          onChange={handleForgotPassInputs}
                          className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                        />
                        {fpFormDataError.userName && <p className="error text-left text-[#ff0000] text-sm">{fpFormDataError.userName}</p>}
                      </div>
                      <button
                        type='button'
                        onClick={handleNext}
                        className="mt-4 w-full py-2 bg-teal-400 text-white font-semibold rounded-md hover:bg-teal-500 transition"
                      >
                        Next
                      </button>
                    </form>
                  )}
                  {activeTab === "mobile" && (
                    <form>
                      <div>
                        <input
                          type="number"
                          placeholder="Mobile Number"
                          value={fpFormData.mobileNumber}
                          name='mobileNumber'
                          onChange={handleForgotPassInputs}
                          className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                        />
                        {fpFormDataError.mobileNumber && <p className="error text-left text-[#ff0000] text-sm">{fpFormDataError.mobileNumber}</p>}

                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="User Name"
                          value={fpFormData.userName}
                          name='userName'
                          onChange={handleForgotPassInputs}
                          className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                        />
                        {fpFormDataError.userName && <p className="error text-left text-[#ff0000] text-sm">{fpFormDataError.userName}</p>}
                      </div>
                      <button
                        type='button'
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
                  <div>
                    {/* {otp.map((value, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-10 h-10 text-center border border-[#2DC6BE] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                      />
                    ))} */}

<OTPInput
                    value={otpVal}
                    onChange={handleOtpChange}
                    numInputs={4}
                    renderSeparator={<span></span>}
                    renderInput={(props) => (
                      <input
                        {...props}
                        type="tel"
                        pattern="[0-9]*"
                        className="otp-input w-12 h-12 sm:w-16 sm:h-12 md:w-16 md:h-12 text-center text-xl border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                        onInput={(e) => {
                          if (!/^\d*$/.test(e.target.value)) {
                            e.target.value = ""; // Clear the value if it is not numeric
                          }
                        }}
                      />
                    )}
                  />
                  {otpError && <p className="error text-left text-[#ff0000] text-sm">{otpError}</p>}
                    {fpFormDataError.otpError && <p className="error text-left text-[#ff0000] text-sm">{fpFormDataError.otpError}</p>}
                  </div>
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
                  <div>
                    <input
                      type="password"
                      placeholder="Create Password"
                      value={fpFormData.password}
                      name='password'
                      onChange={handleForgotPassInputs}
                      className="bg-white w-full p-2 mb-4 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                    />
                      {fpFormDataError.password && <p className="error text-left text-[#ff0000] text-sm">{fpFormDataError.password}</p>}
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={fpFormData.confirmPassword}
                      name='confirmPassword'
                      onChange={handleForgotPassInputs}
                      className="bg-white w-full p-2 mb-4 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:font-poppins placeholder:text-customBlack"
                    />
                      {fpFormDataError.confirmPassword && <p className="error text-left text-[#ff0000] text-sm">{fpFormDataError.confirmPassword}</p>}
                  </div>
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

export default LoginPage;
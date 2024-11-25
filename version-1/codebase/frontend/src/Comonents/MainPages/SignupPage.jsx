import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupStep1 from "./SignUpForms/SignupStep1";
import InfluencerPage from "./SignUpForms/InfluencerPage";
import AlmostPage from "./SignUpForms/AlmostPage";
import { fetchCities } from "../../redux/slices/stateCitySlice";
import { finalSignup } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import SuccessError from "../OtherPages/SuccessError";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showBoxes, setShowBoxes] = useState(false);
  const [flashMessage, setFlashMessage] = useState('');
  const [flashMsgType, setFlashMsgType] = useState('');

  /* kk code starts */


  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    email: "",
    mobileNumber: "",
    state: "",
    city: "",
    isInfluencer: false,
    smlink1: "",
    smlink2: "",
    userName: "",
    password: "",
    confirmPassword: "",
    description: "",
  });
  const [formDataError, setFormDataError] = useState({});
  const [isDobValid, setIsDobValid] = useState(false);


  const validate = () => {
    let formErrors = {};

    // validation for step 1 inputs
    if (step === 1) {
      // Full Name validation
      if (!formData.fullName.trim()) {
        formErrors.fullName = "*Full name is required";
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        formErrors.email = "*Email is required";
      } else if (!emailPattern.test(formData.email)) {
        formErrors.email = "*Invalid email format";
      }

      // Date of Birth validation
      if (!formData.dob.trim()) {
        formErrors.dob = "*Date of Birth is required.";
      } else if (!isDobValid) {
        formErrors.dob = "*User must be 16 years or older.";
      }

      // Mobile validation
      const mobilePattern = /^[0-9]{10}$/;
      if (!formData.mobileNumber) {
        formErrors.mobileNumber = "*Mobile number is required";
      } else if (!mobilePattern.test(formData.mobileNumber)) {
        formErrors.mobileNumber = "*Mobile number should be 10 digits";
      }

      // State validation
      if (!formData?.state?.trim()) {
        formErrors.state = "*State is required";
      }

      // City validation
      if (!formData.city.trim()) {
        formErrors.city = "*City is required";
      }

      // Gender validation
      if (!formData.gender.trim()) {
        formErrors.gender = "*Gender is required";
      }

      setFormDataError(formErrors);
      return Object.keys(formErrors).length === 0;
    }

    // validation for step 2 inputs
    if (step === 2) {
      // social media link validation
      if (
        formData.isInfluencer &&
        !formData.smlink1.trim() &&
        !formData.smlink2.trim()
      ) {
        formErrors.smLinkError = "*Atleast one social media link is required";
      }

      setFormDataError(formErrors);
      return Object.keys(formErrors).length === 0;
    }

    // validation for step 3 inputs
    if (step === 3) {
      // User Name validation
      if (!formData.userName.trim()) {
        formErrors.userName = "*User name is required";
      }

      // Password validation
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/;
      if (!formData.password) {
        formErrors.password = "*Password is required";
      } else if (!passwordPattern.test(formData.password)) {
        formErrors.password =
          "*Password must be at least 6 characters, include an uppercase letter, a lowercase letter, a number, and a special character.";
      }

      // confirm password
      if (!formData.confirmPassword) {
        formErrors.confirmPassword = "*Confirm Password is required";
      } else if (formData.confirmPassword !== formData.password) {
        formErrors.confirmPassword = "*Password does not match";
      }

      // Description validation
      if (!formData.description.trim()) {
        formErrors.description = "*Description is required";
      }

      setFormDataError(formErrors);
      return Object.keys(formErrors).length === 0;
    }
  };

  // handle for DOB change
  const handleDOBChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Extract the date in yyyy-MM-dd format
    console.table({
      'date': date,
      'formattedDate': formattedDate
    });
    setFormData((prevState) => ({
      ...prevState,
      dob: formattedDate
    }));
  };

  // handle input changes before dob validation
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   console.table({
  //     'name': name,
  //     'value': value
  //   })
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));

  //   Object.keys(formDataError).forEach((inputName) => {
  //     if (inputName === name && value !== "") {
  //       delete formDataError[inputName];
  //     } else if (
  //       (inputName === "smLinkError" && name === "smlink1") ||
  //       (name === "smlink2" && value !== "")
  //     ) {
  //       delete formDataError[inputName];
  //     }

  //     // else if(value === '') {
  //     //   setFormDataError((prev)=>({
  //     //     ...prev,
  //     //     [name]: `*${name} is required`,
  //     //   }))
  //     // }
  //   });
  // };

  // handle input change with dob validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.table({
    //   name: name,
    //   value: value,
    // });
  
    // Update the form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
    // Validate the input
    setFormDataError((prevErrors) => {
      let updatedErrors = { ...prevErrors };
  
      if (name === "dob") {
        const selectedDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        const dayDiff = today.getDate() - selectedDate.getDate();
  
        // Adjust age if the birthday hasn't occurred yet this year
        const isAgeValid =
          age > 16 ||
          (age === 16 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
  
        setIsDobValid(isAgeValid);
        if (!isAgeValid) {
          updatedErrors[name] = "*User must be 16 years or older.";
        } else {
          delete updatedErrors.dob;
        }

        return updatedErrors;
      }
  
      // Clear other errors if the field is not empty
      if (value !== "" && updatedErrors[name]) {
        delete updatedErrors[name];
      }
  
      return updatedErrors;
    });
  };

  // handle change on city and state select
  const handleSelectChange = async(selectedOption, name) => {

    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "",
    }));

    if (name === "state") {
      // set city blank if new state is chosen
      setFormData((prevData) => ({
        ...prevData,
        city: "",
      }));
      await dispatch(fetchCities({ state: selectedOption.value, country: "India" }));
    }

    if (formDataError[name]) {
      setFormDataError((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNext = async (e) => {
    // e.preventDefault();
    console.log("====formData====>", formData);
    // if (step === 2) {
    //   const isVerified = true;
    //   console.log("====otpVal====>", otpVal.length);
    //   if (otpVal.length !== 4) {
    //     setOtpError("*Enter all values");
    //     return;
    //   }
    //   if (isVerified) {
    //     setOtpVal("");
    //     setStep(step + 1);
    //   }
    //   return;
    // }

    // need to remove after social media link applied
    setStep(step + 1);

    // open when social media link applied
    // const validated = await validate();
    // if (validated) setStep(step + 1);
  };


   // handle flash messages show
   const handleFlashMessage = (errorMessage, msgType) => {
    setFlashMessage(errorMessage);
    setFlashMsgType(msgType);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 3000); // Hide the message after 3 seconds
}

  // for final signup process
  const handleSubmit = async (e) => {
    e.preventDefault();

    // check for form validation
    const isValid = await validate();
    if(isValid) {
      console.log("valid form");
      try {

        // call final sign up api from finalSignup(authSlice) 
        const finalSignUpResult = await dispatch(finalSignup(formData)).unwrap();

        if(finalSignUpResult) {
          handleFlashMessage(finalSignUpResult.message, 'success')
          navigate('/login');
        } else {
          handleFlashMessage('Something went wrong', 'error');
        }

        // Call API to register the user
    // fetch("/api/register", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Registration successful:", data);
    //   })
    //   .catch((error) => console.error("Error:", error));

      } catch (error) {
        console.log("error in register api call", error);
        const errorMessage = error.error || "An unexpected error occurred.";
        handleFlashMessage(errorMessage, 'error');   // update flash message
      }
    } else {
       console.log("form is not valid")
    }

  };

  const handleBackStep = () => {
    step === 1 ? setStep(1) : setStep(step - 1);
  };

  /* kk code ends */

  const handleInputChangeMobile = (e) => {
    const value = e.target.value;
    // setPhoneNumber(value);

    // Show boxes if the input is 10 digits long
    if (value.length === 10) {
      setShowBoxes(true);
    } else {
      setShowBoxes(false);
    }
  };

  /* to check whether user is influencer */
  const handleInfluencerType = async(isInfluencer) => {
      setFormData({ ...formData, isInfluencer: isInfluencer })
  }

  return (
    <div>
      {flashMessage && <SuccessError message={flashMessage} messageType={flashMsgType}/>}
        {
          step === 1 && (
            <div>
              <SignupStep1 
                formData={formData}
                formDataError={formDataError}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                handleNext={handleNext}
                validate={validate}
                handleDOBChange= {handleDOBChange}
                handleFlashMessage = {handleFlashMessage}
              />
            </div>
          )
        }

        {
          step === 2 && (
            <div>
              <InfluencerPage 
                formData={formData}
                formDataError={formDataError}
                handleInputChange={handleInputChange}
                handleInfluencerType={handleInfluencerType}
                handleNext={handleNext}
                handleBackStep={handleBackStep}
                validate={validate}
              />
            </div>
          )
        }

        {
          step === 3 && (
            <div>
              <AlmostPage 
                formData={formData}
                formDataError={formDataError}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleBackStep={handleBackStep}
              />
            </div>
          )
        }
    </div>
  );
};

export default SignupPage;

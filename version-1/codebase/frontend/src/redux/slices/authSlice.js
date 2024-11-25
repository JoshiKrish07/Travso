import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const apiUrl = import.meta.env.VITE_API_URL;
// Thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    console.log("apiUrl", apiUrl)
    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      console.log("===data===>", data);
      return data;
    } catch (error) {
      console.log("error in signup api call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for OTP generation
// export const generateOtp = createAsyncThunk(
//   'auth/generateOtp',
//   async ({ mobileNumber, action = 'generate' }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${apiUrl}/send-otp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ mobileNumber, action }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         return rejectWithValue(errorData);
//       }

//       const otpData = await response.json();
//       return otpData;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const generateOtp = createAsyncThunk(
  'auth/generateOtp',
  async ({ mobileNumber }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const otpData = await response.json();
      console.log("======otpData===generate=>", otpData);
      return otpData;
    } catch (error) {
      console.log("error in otp generate api call thunk", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for OTP verification
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobileNumber, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber,
          otp
        }),
      });

      const data = await response.json();

      console.log("data in verify otp", data);
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      console.log("error in verify otp api call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for resend OTP
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async ({ email, mobileNumber }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mobileNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const otpData = await response.json();
      console.log("======otpData===resend=>", otpData);
      return otpData;
    } catch (error) {
      console.log("error in otp resend api call thunk", error.message);
      return rejectWithValue(error.message);
    }
  }
);


// Thunk for final registration
export const finalSignup = createAsyncThunk(
  'auth/finalSignUp',
  async (formData, { rejectWithValue }) => {
    console.log("apiUrl", apiUrl)
    try {
      const response = await fetch(`${apiUrl}/auth/final-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      console.log("===data==in final signup=>", data);
      return data;
    } catch (error) {
      console.log("error in final signup api call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for social media link
export const setInfluencerType = createAsyncThunk(
  'auth/setInfluencerType',
  async ({smlink1, email, mobileNumber}, { rejectWithValue }) => {
    console.log("apiUrl", apiUrl)
    try {
      const response = await fetch(`${apiUrl}/auth/followers-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ smlink1, email, mobileNumber}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      console.log("===data==in followers-count ===>", data);
      return data;
    } catch (error) {
      console.log("error in followers-count call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
)

// Thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    console.log("apiUrl", apiUrl)
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      // console.log("===data==in login user ===>", data);
      return data;
    } catch (error) {
      console.log("error in login user call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
)

// Thunk for email otp
export const getEmailOTP = createAsyncThunk(
  'auth/getEmailOTP',
  async (formData, { rejectWithValue }) => {
    console.log("apiUrl", apiUrl)
    try {
      const response = await fetch(`${apiUrl}/auth/email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      // console.log("===data==in login user ===>", data);
      return data;
    } catch (error) {
      console.log("error in login user call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
)

// Thunk for forgot password mobile otp
export const getMobileOTPForgotPass = createAsyncThunk(
  'auth/getMobileOTPForgotPass',
  async (formData, { rejectWithValue }) => {
    console.log("apiUrl", apiUrl)
    try {
      const response = await fetch(`${apiUrl}/auth/mobile-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      // console.log("===data==in login user ===>", data);
      return data;
    } catch (error) {
      console.log("error in login user call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
)

// Thunk for forgot password mobile otp
export const verifyForgotPassOTP = createAsyncThunk(
  'auth/verifyForgotPassOTP',
  async ({email=null, mobileNumber=null, userName=null, otp=null}, { rejectWithValue }) => {
    console.log("===mobileNumber====>", mobileNumber)
    try {
      const response = await fetch(`${apiUrl}/auth/fp-otp-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email,mobileNumber,userName,otp}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      // console.log("===data==in login user ===>", data);
      return data;
    } catch (error) {
      console.log("error in login user call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
)

// Thunk for forgot password update password
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({email=null, mobileNumber=null, userName=null, password=null}, { rejectWithValue }) => {
    console.log("===mobileNumber====>", mobileNumber)
    try {
      const response = await fetch(`${apiUrl}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email,mobileNumber,userName,password}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      // console.log("===data==in login user ===>", data);
      return data;
    } catch (error) {
      console.log("error in login user call thunk", error.message)
      return rejectWithValue(error.message);
    }
  }
)


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    otpData: null,
    verifyOtpData: null,
    loading: false,
    error: null,
    setInfluencer: null,
    token: null,
    updatePass: null
  },
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.otpData = null;
      state.verifyOtpData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle generateOtp
      .addCase(generateOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpData = action.payload;
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyOtpData = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle finalSIgnup
      .addCase(finalSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(finalSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // handle resend otp
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpData = action.payload;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // handle setInfluencerType
      .addCase(setInfluencerType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setInfluencerType.fulfilled, (state, action) => {
        state.loading = false;
        state.setInfluencer = action.payload
      })
      .addCase(setInfluencerType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle getEmailOTP
      .addCase(getEmailOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmailOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpData = action.payload;
      })
      .addCase(getEmailOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle getMobileOTPForgotPass
      .addCase(getMobileOTPForgotPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMobileOTPForgotPass.fulfilled, (state, action) => {
        state.loading = false;
        state.otpData = action.payload;
      })
      .addCase(getMobileOTPForgotPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle verifyOtp for forgot password
      .addCase(verifyForgotPassOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyForgotPassOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyOtpData = action.payload;
      })
      .addCase(verifyForgotPassOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle update password for forgot password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.updatePass = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;

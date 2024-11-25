// utils/generateOTP.js
// Importing randomstring using CommonJS syntax
const randomstring = require('randomstring');

// Function to generate a 4-digit OTP
const generateOTP = () => {
  return randomstring.generate({
    length: 4,           // OTP length is 4 digits
    charset: 'numeric',  // Only numeric characters (0-9)
  });
};

module.exports = generateOTP;  // Export the function for use in other files
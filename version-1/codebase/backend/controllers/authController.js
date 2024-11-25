const pool = require("../utils/db");
const twilio = require("twilio");
const bcrypt = require("bcrypt");
const puppeteer = require('puppeteer');
const generateOTP = require("../utils/generateOTP");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendMobileOTP = require("../utils/sendMobileOTP");

async function registerUser(req, res) {
  try {
    const { fullName, gender, dob, state, city, email, mobileNumber } = req.body; 

    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ? OR mobile_number = ?",
      [email, mobileNumber]
    );

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];

      // Compare existing values with the provided ones
      if (
        existingUser.email === email &&
        existingUser.mobile_number === mobileNumber
      ) {
        if (existingUser.isOtpVerified === 0) {
          // console.log("yes i am in isOtpVerified")
          return res
            .status(200)
            .json({ message: "User is registered", user: existingUser });
        } else {
          return res
            .status(400)
            .json({
              error:
                "User already registered with the same email and mobile number",
            });
        }
      } else {
        return res
          .status(409)
          .json({ error: "Email or mobile number already registered" });
      }
    }

    // generate otp
    const otp = await generateOTP();
    
    // Proceed with the insertion if no conflicts
    const valuesToInsert = [
      fullName,
      gender,
      dob,
      state,
      city,
      email,
      mobileNumber,
      otp,
      0,
      0,
      'traveler'
    ];

    // console.log("=====valuesToInsert===>", valuesToInsert);

    const [result] = await pool.execute(
      "INSERT INTO users (full_name, gender, dob, state, city, email, mobile_number, otp, isOtpVerified, is_influencer, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      valuesToInsert
    );


    // Retrieve the inserted ID
    const insertedUserId = result.insertId;

    // Fetch the newly inserted user's data
    const [userResult] = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [insertedUserId]
    );

    // Get the user details
    // const insertedUser = userResult[0];

    // console.log(insertedUser);

    // res
    //   .status(200)
    //   .json({ message: "User Registered Successfully", user: insertedUser });

    return res
      .status(200)
      .json({ message: "User Registered Successfully" });

  } catch (error) {
    console.log('error in register', error);
    res.status(500).json({ message: "Internal server error" });
  }
  // res.status(200).json({'message': 'api working'})
}

async function sendOTP(req, res) {
  try {
    const { mobileNumber } = req.body;

    // find user by mobile number
    const [user] = await pool.execute(
      "SELECT * FROM users WHERE mobile_number = ?",
      [mobileNumber]
    );

    if (user.length === 0) {
      res.status(404).json({ error: "No User Found" });
      return;
    }

    if (user[0].isOtpVerified !== 0) {
      return res.status(409).json({ error: "User is already registered" });
    }

    // Your Twilio Account SID and Auth Token
    const accountSid = process.env.TWILIO_ACCOUNTSID;
    const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;

    // Create a Twilio client
    const client = await twilio(accountSid, authToken);

    // Send the SMS
    // const otpSent = await client.messages
    //   .create({
    //     body: `Your OTP is ${user[0].otp}`,
    //     // from: '+13858316478',
    //     from: process.env.TWILIO_MOBILE_NUMBER,
    //     to: `+91${user[0].mobile_number}`,
    //     // to: '+918720096457'
    //   })
    //   .then((message) =>  true)
    //   .catch((error) => false);

    //   console.log("=====otpSent===>", otpSent);
    //   if(otpSent) {
    //     return res
    //     .status(200)
    //     .json({ message: "OTP sent successfully" });
    //   } else {
    //     return res.status(404).json({ error: "Something went wrong while generating OTP" });
    //   }

    const result = await sendMobileOTP(user[0].otp, mobileNumber);

    // if (result.success) {
    //   return res.status(200).json({ message: result.message });
    // } else {
    //   return res.status(500).json({ error: result.error });
    // }


      return res
      .status(200)
      .json({ message: "OTP sent successfully" });
    
  } catch (err) {
    console.log("error in catch part send otp", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// old working fine
// async function verifyOTP(req, res) {

//     try {
//         const { mobileNumber, otp } = req.body;

//         // find user by mobile number
//         const [user] = await pool.execute(
//             "SELECT * FROM users WHERE mobile_number = ?",
//             [mobileNumber]
//         );

//         if(user.length === 0) {
//             return res.status(404).json({error: "No User with this mobile number Found"});
//         }

//         if(otp == user[0].otp) {
//             return res.status(200).json({message: 'OTP verified'});
//         } else {
//             return res.status(400).json({error: 'Invalid OTP'});
//         }

//     } catch (error) {
//         console.log("error in catch part verify otp", err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// }

async function verifyOTP(req, res) {
  try {
    const { mobileNumber, otp } = req.body;

    // find user by mobile number
    const [user] = await pool.execute(
      "SELECT * FROM users WHERE mobile_number = ?",
      [mobileNumber]
    );

    if (user.length === 0) {
      return res
        .status(404)
        .json({ error: "No User with this mobile number Found" });
    }

    if (otp == user[0].otp) {
      // Update the isOtpVerified field to 1 and set otp to NULL if the OTP matches
      // const [updateResult] = await pool.execute(
      //     "UPDATE users SET isOtpVerified = 1, otp = NULL WHERE email = ? AND mobile_number = ? AND otp = ?",
      //     [user[0].email, mobileNumber, otp]
      // );

      // // Check if any row was updated
      // if (updateResult.affectedRows === 0) {
      //     return res.status(400).json({ error: "Invalid email, mobile number, or OTP" });
      // }

      return res.status(200).json({ message: "OTP verified" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.log("error in catch part verify otp", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function resendOTP(req, res) {
  const { email, mobileNumber } = req.body;
    try {

        // find user by mobile number and email
        const [user] = await pool.execute(
            "SELECT * FROM users WHERE email = ? AND mobile_number = ?",
            [email, mobileNumber]
        );
  
      if (user.length === 0) {
        res.status(404).json({ error: "No User Found" });
        return;
      }
  
      if (user[0].isOtpVerified !== 0 ) {
        return res.status(409).json({ error: "User is already registered" });
      }

        const otp = await generateOTP();

        const otpSentResult = await sendMobileOTP(otp, mobileNumber);

        // if otp sent succesfully,  commented till testing
          // if (otpSentResult.success) {
          //   // Update OTP in the database
          //       const [result] = await pool.execute(
          //         "UPDATE users SET otp = ? WHERE id = ? AND email = ? AND mobile_number = ?",
          //         [otp, user[0].id, email, mobileNumber]
          //     );

          //     // Validate if the update was successful
          //     if (result.affectedRows === 0) {
          //         return res.status(500).json({ error: "Failed to update OTP. Please try again later." });
          //     }
          //   return res.status(200).json({ message: otpSentResult.message });
          // } else {
          //   return res.status(500).json({ error: otpSentResult.error });
          // }


        // Update OTP in the database
        const [result] = await pool.execute(
            "UPDATE users SET otp = ? WHERE id = ? AND email = ? AND mobile_number = ?",
            [otp, user[0].id, email, mobileNumber]
        );

        // Validate if the update was successful
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to update OTP. Please try again later." });
        }

        // Respond with success
        return res.status(200).json({ message: "OTP resent successfully" });

    } catch (err) {
        console.log("error in catch part resend otp", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function finalSignUp(req, res) {

  try {
    const {
      city,
      description,
      dob,
      email,
      fullName,
      gender,
      isInfluencer,
      mobileNumber,
      password,
      state,
      userName,
    } = req.body;

    // Check if the username already exists in the database
    const [existingUsers] = await pool.execute(
      `SELECT user_name FROM users WHERE user_name = ?`,
      [userName]
    );

    if (existingUsers.length > 0) {
      // If a user with the same username exists, return an error
      return res.status(400).json({ error: "Username already exists. Please choose a different username." });
    }

    // Hash the password
    const saltRounds = 10; // Adjust based on security needs
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user in the database using email and mobile number
    const [result] = await pool.execute(
      `UPDATE users 
             SET city = ?, description = ?, dob = ?, full_name = ?, gender = ?, 
                 password = ?, state = ?, user_name = ?
             WHERE email = ? AND mobile_number = ?`,
      [
        city,
        description,
        dob,
        fullName,
        gender,
        hashedPassword,
        state,
        userName,
        email,
        mobileNumber,
      ]
    );

    // Check if any rows were updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
 
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error in catch part final update", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getFollowersCount(req, res) {
  try {
    const { smlink1, mobileNumber, email } = req.body;
    // console.log("====smlink1====>", smlink1);
    // Launch Puppeteer and open a new browser instance
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to Instagram profile URL
    // const url = 'https://www.instagram.com/nikhil__patankar/';
    const url = smlink1;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract meta tag content (e.g., followers, following, posts)
    const data = await page.evaluate(() => {
        const metaTags = {};
        document.querySelectorAll('meta').forEach(tag => {
            if (tag.getAttribute('property')) {
                metaTags[tag.getAttribute('property')] = tag.getAttribute('content');
            }
        });
        return metaTags;
    });

    // Extract followers count from the og:description meta tag
    const description = data['og:description'] || '';
    const followersMatch = description.match(/(\d+) Followers/); // Match the number of followers

    let followersCount = null;
    if (followersMatch && followersMatch[1]) {
        followersCount = followersMatch[1]; // Get the first capturing group
    }

    // Close the browser
    await browser.close();

    const [user] = await pool.execute(
      "SELECT * FROM users WHERE email = ? OR mobile_number = ?",
      [email, mobileNumber]
    );

    // set user as influencer if followers are more than 3000 otherwise traveler
    if(followersCount > 3000) {
      // update user type to influencer
      const [updateResult] = await pool.execute(
        "UPDATE users SET is_influencer = ?, user_type = ?, smlink1 = ? WHERE id = ? AND email = ? AND mobile_number = ?",
        [1, 'influencer', smlink1 ,user[0].id, email, mobileNumber]
      );

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
    
      return res.status(200).json({ setInfluencer: true });
    } else {
     // update user type to traveler
      const [updateResult] = await pool.execute(
        "UPDATE users SET is_influencer = ?, user_type = ?, smlink1 = ? WHERE id = ? AND email = ? AND mobile_number = ?",
        [0, 'traveler', smlink1, user[0].id, email, mobileNumber]
      );

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ setInfluencer: false });
    }

    // Send extracted data as response
    // res.status(200).json({
    //     success: true,
    //     data: {
    //         instaFollowers: followersCount,  // Add the followers count to the response
    //     },
    // });
  } catch (err) {
    console.error("Error in catch part final update", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const [user] = await pool.execute(
      "SELECT * FROM users WHERE user_name = ?",
      [username]
    );

    // return if no user is found
    if (user.length === 0) {
      res.status(404).json({ error: "No User Found" });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = await jwt.sign({ userId: user[0].id, email: user[0].email, userName: user[0].user_name }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful", token });

  } catch (err) {
    console.log("Error in catch part login api", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function sendEmailOTP(req, res) {
  try {
    const { email, userName } = req.body;
    const otp = generateOTP(); // Generate OTP

    const [user] = await pool.execute(
      "SELECT * FROM users WHERE user_name = ? AND email = ?",
      [userName, email]
    );

    // return if no user is found
    if (user.length === 0) {
      res.status(404).json({ error: "No User Found" });
      return;
    }

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Replace with your email service provider (e.g., Gmail, Outlook, etc.)
      auth: {
        user: process.env.APP_EMAIL, // Your email
        pass: process.env.APP_PASSWORD, // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL, // Sender address
      to: email, // Receiver's email address
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };


    // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);

      // Validate if the email was sent successfully
      // The receiving server returns a 250 response code when it has successfully processed an SMTP command.
      if (!info || !info.response.includes("250")) {
        return res.status(500).json({ error: "Failed to send email. Please try again later." });
      }

    // Update OTP in the database
    const [result] = await pool.execute(
      "UPDATE users SET otp = ? WHERE id = ? AND email = ?",
      [otp, user[0].id, email]
    );

    // Validate if the update was successful
    if (result.affectedRows === 0) {
        return res.status(500).json({ error: "Failed to update OTP. Please try again later." });
    }

    return res.status(200).json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.log("Error in catch part send email otp api", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function sendOTPForgotPassword(req, res) {
  try {
    const { mobileNumber, userName } = req.body;
    const otp = generateOTP(); // Generate OTP

    const [user] = await pool.execute(
      "SELECT * FROM users WHERE user_name = ? AND mobile_number = ?",
      [userName, mobileNumber]
    );

    // return if no user is found
    if (user.length === 0) {
      res.status(404).json({ error: "No User Found" });
      return;
    }

    const otpSentResult = await sendMobileOTP(otp, mobileNumber);

            // if otp sent succesfully,  commented till testing
          // if (otpSentResult.success) {
          //   // Update OTP in the database
          //       const [result] = await pool.execute(
          //         "UPDATE users SET otp = ? WHERE id = ? AND mobile_number = ?",
          //         [otp, user[0].id, mobileNumber]
          //     );

          //     // Validate if the update was successful
          //     if (result.affectedRows === 0) {
          //         return res.status(500).json({ error: "Failed to update OTP. Please try again later." });
          //     }
          //   return res.status(200).json({ message: otpSentResult.message });
          // } else {
          //   return res.status(500).json({ error: otpSentResult.error });
          // }


        // Update OTP in the database
        const [result] = await pool.execute(
          "UPDATE users SET otp = ? WHERE id = ? AND mobile_number = ?",
          [otp, user[0].id, mobileNumber]
      );

      // Validate if the update was successful
      if (result.affectedRows === 0) {
          return res.status(500).json({ error: "Failed to update OTP. Please try again later." });
      }

      // Respond with success
      return res.status(200).json({ message: "OTP resent successfully" });


  } catch (error) {
    console.log("Error in catch part send mobile otp api", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function forgotPassVerify(req, res) {

  try {
     const { mobileNumber, email, userName, otp } = req.body;
     let user;
     if(mobileNumber) {
      // console.log("in mobile block");
      [user] = await pool.execute(
        "SELECT * FROM users WHERE user_name = ? AND mobile_number = ?",
        [userName, mobileNumber]
      );
     } else if(email) {
      // console.log("in email block");
      [user] = await pool.execute(
        "SELECT * FROM users WHERE user_name = ? AND email = ?",
        [userName, email]
      );
     }
  
     // return if no user is found
      if (user.length === 0) {
        res.status(404).json({ error: "No User Found" });
        return;
      }

      // OTP matches or not
      if(otp === user[0].otp) {
        return res.status(200).json({ message: 'OTP Verified Successfully'});
      } else {
        return res.status(400).json({ error: "Invalid OTP" });
      }
  } catch (error) {
    console.log("Error in catch part verify forgot password otp api", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updatePassword(req, res) {
  try {
    const { mobileNumber, email, userName, password } = req.body;
     let user;
     if(mobileNumber) {
      // console.log("in mobile block");
      [user] = await pool.execute(
        "SELECT * FROM users WHERE user_name = ? AND mobile_number = ?",
        [userName, mobileNumber]
      );
     } else if(email) {
      // console.log("in email block");
      [user] = await pool.execute(
        "SELECT * FROM users WHERE user_name = ? AND email = ?",
        [userName, email]
      );
     }
  
     // return if no user is found
      if (user.length === 0) {
        res.status(404).json({ error: "No User Found" });
        return;
      }

      // Hash the password
      const saltRounds = 10; // Adjust based on security needs
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await pool.execute(
        `UPDATE users 
               SET password = ?
               WHERE email = ? AND mobile_number = ?`,
        [
          hashedPassword,
          user[0].email,
          user[0].mobile_number
        ]
      );
     
      // Check if any rows were updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: 'Password Updated Successfully' });
  } catch (error) {
    console.log("Error in catch part updatePassword api", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  registerUser,
  sendOTP,
  verifyOTP,
  finalSignUp,
  resendOTP,
  getFollowersCount,
  loginUser,
  sendEmailOTP,
  sendOTPForgotPassword,
  forgotPassVerify,
  updatePassword
};

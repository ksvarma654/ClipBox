// async function login() {
//     //variables to hold respective value enterd by user inside element
//     const username = document.getElementById("username-log").value;
//     const password = document.getElementById("password-log").value;
//     const message = document.getElementById("message");

//     try {
//         //loadig json file 
//         const response = await fetch("users.json");
//         console.log("Fetched JSON data successfully")
//         const data = await response.json();


//         //checking user
//         const user = data.users.find(
//             u => u.username === username && u.password === password
//         );

//             if (user){
//                 message.style.color = "green";
//                 message.textContent = "Login Successful";
//                 console.log("Login Successful!")
//             }
//             else{
//                 message.style.color = "red";
//                 message.textContent = "Invalid Username or Password";
//                 document.getElementById("username").focus();
//                 document.getElementById("username").select();
//             }    
//     }
//     catch(error){
//         message.textContent = "Error Loading User Data"
//     }
// }


// async function registeruser() {
//   const data = {
//     username: document.getElementById("username-reg").value,
//     email: document.getElementById("email-reg").value,
//     password: document.getElementById("password-reg").value,
//     mobile: document.getElementById("phone").value
//   };


// console.log("Captured Registration Data:", data);
// const message = document.getElementById("message");

//   // try {
//   //   // Send the data to the Python backend
//   //   const res = await fetch("http://127.0.0.1:8000/register", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json"
//   //     },
//   //     body: JSON.stringify(data)
//   //   });

//   //   const result = await res.json();
    
//   //   if (res.ok) {
//   //     message.style.color = "green";
//   //     message.innerHTML = result.message;
//   //   } else {
//   //     message.style.color = "red";
//   //     message.innerHTML = result.detail;
//   //   }
//   // } catch (error) {
//   //   message.style.color = "red";
//   //   message.innerHTML = "Server connection failed.";
//   // }
// }

async function checkUsernameExists(username) {
  const response = await fetch(`http://127.0.0.1:8000/check_availability?field=username&value=${username}`);
  return await response.json();
}

async function checkEmailExists(email) {
  const response = await fetch(`http://127.0.0.1:8000/check_availability?field=email&value=${email}`);
  return await response.json();
}


//--------username validation-----------------

document.getElementById("username-reg").addEventListener("input", async function() {
  const username = this.value;
  const msg = document.getElementById("username-valid");

  if(!username){
    msg.textContent = "";
    return;
  }
  const data = await checkUsernameExists(username);

  msg.style.color = data.exists ? "red" : "green";
  msg.textContent = data.message;

}
);


//----------Email Validation----------------

document.getElementById("email-reg").addEventListener("input", async function() {
  const email = this.value.trim();
  const msg = document.getElementById("email-valid");

  if(!email){
    msg.textContent = "";
    return;
  }

  const emailPattern = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;
  if (!emailPattern.test(email)) {
    msg.style.color = "red";
    msg.textContent = "Invalid email format";
    return;
  }

  const data = await checkEmailExists(email);
  
  msg.style.color = data.exists ? "red" : "green";
  msg.textContent = data.message;

}
)

//----------Mobile Number Validation---------------------

document.getElementById("phone").addEventListener("input", async function() {
  const phone = this.value.trim();
  const msg = document.getElementById("mobile-valid");

  if(!phone){
    msg.textContent = "";
    return;
  }

  if (phone.length !== 10) {
    msg.style.color = "red";
    msg.textContent = "Mobile number must be 10 digits";
    } else {
    msg.textContent = "";
  }
}
)


//------------Password Match------------------
document.getElementById("password-reg").addEventListener("input", validatePassword);
document.getElementById("confirm-password-reg").addEventListener("input", validatePassword);

function validatePassword() {
  const pass = document.getElementById("password-reg").value;
  const confirm = document.getElementById("confirm-password-reg").value;
  const msg = document.getElementById("password-match");

  // If both fields are empty, clear the message and exit.
  if (!pass && !confirm) {
    msg.textContent = "";
    return;
  }

  // Prioritize the length check if the main password field has content.
  if (pass.length > 0 && pass.length < 6) {
    msg.style.color = "red";
    msg.textContent = "Password must be at least 6 characters";
    return;
  }

  // Only check for a match if the user has started typing in the confirm field.
  if (confirm.length > 0) {
    if (pass === confirm) {
      msg.style.color = "green";
      msg.textContent = "Passwords match";
    } else {
      msg.style.color = "red";
      msg.textContent = "Passwords do not match";
    }
  } else {
    // If the confirm field is empty but the main password is valid, clear any previous message.
    msg.textContent = "";
  }

  if (pass === confirm) {
    msg.style.color = "green";
    msg.textContent = "Passwords match";
  }

  
}



//------------Register Button Action-------------

document.getElementById("reg-button").addEventListener("click", async function(e) {
  e.preventDefault(); // stop page reload

  const usernameVal = document.getElementById("username-reg").value.trim();
  const emailVal = document.getElementById("email-reg").value.trim();
  const passwordVal = document.getElementById("password-reg").value;
  const confirmpasswordVal = document.getElementById("confirm-password-reg").value;
  const phoneVal = document.getElementById("phone").value.trim();

  // 1. Check if all fields are filled
  if (!usernameVal || !emailVal || !passwordVal || !confirmpasswordVal || !phoneVal) {
    alert("Please fill all details.");
    return; // Stops the function here
  }

  // 2. Synchronous Validation Checks (Ensures the data itself is valid)
  const emailPattern = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;
  if (!emailPattern.test(emailVal)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (passwordVal.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (passwordVal !== confirmpasswordVal) {
    alert("Passwords do not match.");
    return;
  }

  if (phoneVal.length !== 10) {
    alert("Mobile number must be exactly 10 digits.");
    return;
  }

  // 3. Asynchronous Validation Checks (Checks if your backend marked the username/email in red)
  if (document.getElementById("username-valid").style.color === "red" || 
      document.getElementById("email-valid").style.color === "red") {
    alert("Please resolve the highlighted errors before registering.");
    return;
  }

  // 4. Prepare the data exactly as your Python 'User' model expects it
  const userData = {
    username: usernameVal,
    email: emailVal,
    password: passwordVal,
    mobile: phoneVal
  };

  // 5. Request the API to post the info
  try {
    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    if (response.ok) {
      // Clear all form fields and validation messages instantly
      document.getElementById("registration").reset();
      document.getElementById("username-valid").textContent = "";
      document.getElementById("email-valid").textContent = "";
      document.getElementById("password-match").textContent = "";
      document.getElementById("mobile-valid").textContent = "";

      alert(result.message); // Will say "Registration successful!"
      window.location.href = "login.html"; // Redirect to login page
    } else {
      alert(result.detail || "Registration failed."); // Backend error message
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong! " + error.message);
  }
}
);


















// function validatePasswordMatch() {
//   const password = document.getElementById("password-reg").value;
//   const confirmPassword = document.getElementById("confirm-password-reg").value;


//   if (!password && !confirmPassword) {
//     document.getElementById("password-match").style.color = "red";
//     document.getElementById("password-match").textContent = "Password must be at least 6 characters long";
//     return;
//   } 

//   if (confirmPassword && password !== confirmPassword) {
//     document.getElementById("password-match").style.color = "red";
//     document.getElementById("password-match").textContent = "Passwords do not match";
//     return;
//   }

//   if (confirmPassword && password === confirmPassword) {
//     document.getElementById("password-match").style.color = "green";
//     document.getElementById("password-match").textContent = "Password Match";
//     return;
//   }

//   document.getElementById("password-match").textContent = "";
 
// }

// function validateMobile() {
//   const mobile = document.getElementById("phone").value;

//   if (!mobile) {
//     document.getElementById("message").textContent = "";
//     return;
//   }
//   if (mobile.length !== 10) {
//     document.getElementById("mobile-valid").style.color = "red";
//     document.getElementById("mobile-valid").textContent = "Mobile number must be 10 digits";
//   } else {
//     document.getElementById("mobile-valid").textContent = "";
//   }
// }

// function validateEmail() {
//   const email = document.getElementById("email-reg").value.trim();
//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


//   if (!email) {
//     document.getElementById("email-valid").textContent = "";
//     return;
//   }

//   if (!emailPattern.test(email)) {
//     document.getElementById("email-valid").style.color = "red";
//     document.getElementById("email-valid").textContent = "Please enter a valid email address";
//   } else {
//     document.getElementById("email-valid").textContent = "";
//   }
// }


// document.getElementById("password-reg").addEventListener("input", validatePasswordMatch);
// document.getElementById("confirm-password-reg").addEventListener("input", validatePasswordMatch);
// document.getElementById("phone").addEventListener("input", validateMobile);
// document.getElementById("email-reg").addEventListener("input", validateEmail);


// document.getElementById("reg-button").addEventListener("click", async function(e) {
//   e.preventDefault(); // stop page reload

//   const usernameVal = document.getElementById("username-reg").value.trim();
//   const emailVal = document.getElementById("email-reg").value.trim();
//   const passwordVal = document.getElementById("password-reg").value.trim();
//   const phoneVal = document.getElementById("phone").value.trim();
//   const confirmpasswordVal = document.getElementById("confirm-password-reg").value.trim();


// //   // --- Form Validations ---
// //   // 1. Check if any field is empty
// //   if (!usernameVal || !emailVal || !passwordVal || !phoneVal) {
// //     alert("Please fill in all fields.");
// //     return; // Stops the function so it doesn't send bad data to the server
// //   }

// //   // 2. Validate email format
// //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //   if (!emailPattern.test(emailVal)) {
// //     alert("Please enter a valid email address.");
// //     return;
// //   }

// //   if(passwordVal !== confirmpasswordVal){
// //     alert("Passwords do not match.");
// //     return;
// //   }

// //   // 3. Validate password length
// //   if (passwordVal.length < 6) {
// //     alert("Password must be at least 6 characters long.");
// //     return;
// //   }

// //   // 4. Validate phone number (assuming 10 digits for standard mobile)
// //   const phonePattern = /^[0-9]{10}$/;
// //   if (!phonePattern.test(phoneVal)) {
// //     alert("Please enter a valid 10-digit mobile number.");
// //     return;
// //   }



// if (!usernameVal || !emailVal || !passwordVal || !phoneVal || !confirmpasswordVal) {
//   alert("Please fill all fields.");
//   return;
// }

// // if (!passwordval && !confirmpasswordVal){
// //   return;
// // }
// // else if (passwordVal !== confirmpasswordVal) {
// //   alert("Passwords do not match.");
// //   return;
// // }

//   const userData = {
//     // username: document.getElementById("username-reg").value,
//     // email: document.getElementById("email-reg").value,
//     // password: document.getElementById("password-reg").value,
//     // mobile: document.getElementById("phone").value
//     username: usernameVal,
//     email: emailVal,
//     password: passwordVal,
//     mobile: phoneVal
//   };

//   try {
//     const response = await fetch("http://127.0.0.1:8000/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(userData)
//     });

//     const result = await response.json();
//     alert(result.message);

//     if (response.ok) {
//       window.location.href = "login.html";
//     }

//   } catch (error) {
//     console.error("Error:", error);
//     alert("Something went wrong!" + error.message);
//   }
// });

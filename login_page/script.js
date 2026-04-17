async function login() {
    //variables to hold respective value enterd by user inside element
    const username = document.getElementById("username-log").value;
    const password = document.getElementById("password-log").value;
    const message = document.getElementById("message");

    try {
        //loadig json file 
        const response = await fetch("users.json");
        console.log("Fetched JSON data successfully")
        const data = await response.json();


        //checking user
        const user = data.users.find(
            u => u.username === username && u.password === password
        );

            if (user){
                message.style.color = "green";
                message.textContent = "Login Successful";
                console.log("Login Successful!")

                sessionStorage.setItem("loggedInUser", username);
                
            setTimeout(() => {
                window.location.href = "home_page.html";
            }, 1000);
        }
            else{
                message.style.color = "red";
                message.textContent = "Invalid Username or Password";
                document.getElementById("username").focus();
                document.getElementById("username").select();
            }    
    }
    catch(error){
        message.textContent = "Error Loading User Data"
    }
}
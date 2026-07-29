// Function used to login to app and sumbit the form
function loginToApp() {
    // Get login form  
    const loginForm = document.getElementById("login-form");
    
    loginForm.addEventListener("submit", async (event) => {

        // This is used to prevent page reloading
        event.preventDefault();

        //Get users data
        const email = document.getElementById("email").value;

        const password = document.getElementById("password").value;

        //Get checkbox value
        const remember = document.getElementById("remember-box").checked;

        // This is where the connection to the backend happens
        const apiBaseUrl = "http://localhost:3000";
        const response = await fetch(`${apiBaseUrl}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!response.ok) {
            console.error("Login request failed", response.status, response.statusText);
            return;
        }

        // And after it checks, if matching it gives the user data
        const data = await response.json();

        // Check for userr data
        console.log(data);

        //If success store to localStorage and login
        if (data.success) {
            if(remember) {
                localStorage.setItem(
                    "remember",
                    "true"
                );

                localStorage.setItem(
                "user",
                JSON.stringify(data.user)
                );
            } else {
                sessionStorage.setItem(
                    "remember",
                    "false"
                )

                sessionStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                )
            }
            

            window.location.replace("../../pages/dashboards/browsePage.html");
        } else {
            console.log("Error with login");
        }
    })
}

function checkUserSession(){
    //Check if lst user session was checked 
    const remember = localStorage.getItem("remember");

    //If it was checked
    if (remember === "true") {

        //Get user from local storage
        const user = localStorage.getItem("user");

        // Check to see for valid user data and login
        if(user) {
            console.log(
                "User remembered:",
                JSON.parse(user)
            );

            //ALready logged in move to browse
            window.location.replace(
                "../../pages/dashboards/browsePage.html"
            );
        }
    }

    //CHeck session login (valid till browser closes)
    const sessionUser = sessionStorage.getItem("user");

    //If exists
    if (sessionUser) {

        //CHeck to see the data
        console.log(
            "Session user:",
            JSON.parse(sessionUser)
        );

        //Change to browse
        window.location.replace(
            "../../pages/dashboards/browsePage.html"
        );
    }
    
}

function init() {
    checkUserSession();

    loginToApp();
}

init();
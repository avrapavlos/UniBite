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

        //THis is where the connection to the backend happens
        const response = await fetch("/api/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            } ,

            body: JSON.stringify({
                email,
                password
            })
        })

        // And after it checks, if mathcing it gives the user data
        const data = await response.json();

        // Check for userr data
        console.log(data);

        //If success store to localStorage and login
        if (data.success) {
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            window.location.href = "../../pages/dashboards/browsePage.html";
        }
    })
}

function init() {
    loginToApp();
}

init();
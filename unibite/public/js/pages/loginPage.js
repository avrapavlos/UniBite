// Function used to login to app and sumbit the form
function loginToApp() {
    // Get login form 
    const loginForm = document.getElementById("login-form");
    
    loginForm.addEventListener("submit", (event) => {

        // This is used to prevent page reloading
        event.preventDefault();

        //Get users data
        const email = document.getElementById("email").value;

        const password = document.getElementById("password").value;

        //THis is where the connection to the backend will happen
        // FROM CHATGPT AN EXAMPLE
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

        // ANd after it checks, if mathcing it gives the user data
        const data = await response.json;
        
        console.log(email);
        console.log(password);
    })
}

function init() {
    loginToApp();
}

init();
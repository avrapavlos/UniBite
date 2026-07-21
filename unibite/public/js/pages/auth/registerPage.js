// Function to register
function registerToApp() {

    const registerForm = document.getElementById("register-form");


    if (!registerForm) {
        console.log("Register form not found");
        return;
    }



    registerForm.addEventListener("submit", async (event) => {

        // Prevent reload
        event.preventDefault();

        //Get the fields
        const name = document.getElementById("name").value;

        const email = document.getElementById("email").value;

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirm-password").value;


        const passwordError = document.getElementById("password-error");

        //Add clear error when clicked
        document.getElementById("confirm-password")
            .addEventListener("click", () => {

                passwordError.style.display = "none";

            });

        // Check passwords
        if (password !== confirmPassword) {

            passwordError.style.display = "block";

            return;

        } else {

            passwordError.style.display = "none";

        }



        try {

            const response = await fetch("/api/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });



            const data = await response.json();


            console.log(data);



            if (data.success) {


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                window.location.replace(
                    "../../pages/dashboards/browsePage.html"
                );


            } else {

                console.log(data.message);

            }



        } catch (error) {

            console.error("Register error:", error);

        }


    });

}



function initRegister() {

    registerToApp();

}


initRegister();
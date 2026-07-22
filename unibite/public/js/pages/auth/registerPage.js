function registerToApp() {


    const registerForm = document.getElementById("register-form");


    if (!registerForm) {

        console.log("Register form not found");

        return;

    }



    // Fields

    const name = document.getElementById("name");

    const email = document.getElementById("email");

    const password = document.getElementById("password");

    const confirmPassword = document.getElementById("confirm-password");



    // Errors

    const passwordError = document.getElementById("password-error");

    const nameEmailError = document.getElementById("duplicate-name-email");




    // Clear password error

    password.addEventListener("input", () => {

        passwordError.style.display = "none";

    });


    confirmPassword.addEventListener("input", () => {

        passwordError.style.display = "none";

    });



    // Clear duplicate error

    name.addEventListener("input", () => {

        nameEmailError.style.display = "none";

    });


    email.addEventListener("input", () => {

        nameEmailError.style.display = "none";

    });




    registerForm.addEventListener("submit", async(event)=>{


        event.preventDefault();



        // Password check

        if(password.value !== confirmPassword.value){


            passwordError.style.display = "block";

            return;

        }


        passwordError.style.display = "none";




        try {


            const response = await fetch("/api/register", {


                method:"POST",


                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({

                    name:name.value,

                    email:email.value,

                    password:password.value

                })


            });



            const data = await response.json();



            console.log(data);



            if(data.success) {
                console.log("Regitser succes:\n");
                console.log(data);


                window.location.replace(

                    "../../pages/auth/login.html"

                );


            }
            else{


                nameEmailError.textContent = data.message;

                nameEmailError.style.display = "block";


            }



        }
        catch(error){


            console.error(
                "Register error:",
                error
            );


        }



    });


}



function initRegister(){

    registerToApp();

}


initRegister();
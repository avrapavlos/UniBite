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
    const latitude = document.getElementById("latitude");
    const longitude = document.getElementById("longitude");
    const address = document.getElementById("address");
    const searchAddressButton = document.getElementById("search-address-button");
    const locationError = document.getElementById("location-error");
    let map;
    let selectedMarker = null;

    map = L.map("registration-map").setView([39.365, 21.921], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    function selectLocation(selectedLatitude, selectedLongitude, label = "Selected location") {
        latitude.value = selectedLatitude.toFixed(6);
        longitude.value = selectedLongitude.toFixed(6);
        locationError.hidden = true;

        if (selectedMarker) {
            map.removeLayer(selectedMarker);
        }

        selectedMarker = L.marker([selectedLatitude, selectedLongitude])
            .addTo(map)
            .bindPopup(label)
            .openPopup();
    }

    map.on("click", (event) => selectLocation(event.latlng.lat, event.latlng.lng));

    searchAddressButton.addEventListener("click", async () => {
        const query = address.value.trim();
        if (!query) return;

        searchAddressButton.disabled = true;
        searchAddressButton.textContent = "Searching...";
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
            const results = await response.json();
            if (!results.length) {
                locationError.textContent = "Location not found. Try a more specific address.";
                locationError.hidden = false;
                return;
            }

            const result = results[0];
            const selectedLatitude = Number(result.lat);
            const selectedLongitude = Number(result.lon);
            map.setView([selectedLatitude, selectedLongitude], 16);
            selectLocation(selectedLatitude, selectedLongitude, result.display_name);
        } catch (error) {
            locationError.textContent = "Unable to search for that location. You can select it on the map.";
            locationError.hidden = false;
        } finally {
            searchAddressButton.disabled = false;
            searchAddressButton.textContent = "Search";
        }
    });

    setTimeout(() => map.invalidateSize(), 0);



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

        if (!latitude.value || !longitude.value) {
            locationError.textContent = "Please select your location on the map before creating your account.";
            locationError.hidden = false;
            return;
        }




        try {


            const response = await fetch("http://localhost:3000/api/register", {


                method:"POST",


                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({

                    name:name.value,

                    email:email.value,

                    password:password.value
                    ,latitude:Number(latitude.value)
                    ,longitude:Number(longitude.value)

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
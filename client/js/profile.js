const profileForm = document.getElementById("profileForm");


// Load business from SQLite

async function loadProfile(){

    try {

        const response = await fetch(
            "http://localhost:5000/api/businesses"
        );

        const business = await response.json();


        if(business.id){

            document.getElementById("businessName").value =
            business.business_name || "";


            document.getElementById("ownerName").value =
            business.owner_name || "";


            document.getElementById("phone").value =
            business.phone || "";


            document.getElementById("currency").value =
            business.currency || "KSh";

        }


    } catch(error){

        console.error(error);

    }

}



// Save business to SQLite

profileForm.addEventListener("submit", async function(event){

    event.preventDefault();


    const profile = {

        business_name:
        document.getElementById("businessName").value,


        owner_name:
        document.getElementById("ownerName").value,


        phone:
        document.getElementById("phone").value,


        currency:
        document.getElementById("currency").value

    };


    try {


        const response = await fetch(
            "http://localhost:5000/api/businesses",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify(profile)

            }
        );


        const data = await response.json();


        if(data.success){

            alert("Business profile saved ✅");

        }


    } catch(error){

        console.error(error);

        alert("Unable to save profile.");

    }


});



// Start

loadProfile();
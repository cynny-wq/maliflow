const loginForm = document.getElementById("loginForm");


loginForm.addEventListener("submit", async function(event){

    event.preventDefault();


    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;



    if(!email || !password){

        alert("Please fill in all fields");

        return;

    }



    try {


        const response = await fetch(
            "/api/auth/login",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


                body: JSON.stringify({

                    email,

                    password

                })

            }
        );



        const data = await response.json();



        if(data.success){


            // Save login token

            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "user_id",
                data.user_id
            );



            alert("Welcome to MaliFlow 🚀");


            window.location.href =
            "dashboard.html";


        } else {


            alert(
                data.message || "Login failed"
            );


        }



    } catch(error){


        console.error(error);

        alert("Unable to connect to server.");

    }


});

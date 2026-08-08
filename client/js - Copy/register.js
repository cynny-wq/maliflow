const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Account created successfully! 🎉");

            window.location.href = "login.html";

        } else {

            alert(data.message || "Registration failed.");

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});
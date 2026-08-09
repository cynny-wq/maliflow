const moneyInBtn = document.getElementById("moneyIn");
const moneyOutBtn = document.getElementById("moneyOut");
const cashForm = document.getElementById("cashForm");

let transactionType = "income";

// Money In
moneyInBtn.addEventListener("click", function () {

    transactionType = "income";

    moneyInBtn.classList.add("active");
    moneyOutBtn.classList.remove("active");

});

// Money Out
moneyOutBtn.addEventListener("click", function () {

    transactionType = "expense";

    moneyOutBtn.classList.add("active");
    moneyInBtn.classList.remove("active");

});

// Save transaction
cashForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    const transaction = {

        type: transactionType,

        amount: Number(
            document.getElementById("amount").value
        ),

        category:
            document.getElementById("category").value,

        name:
            document.getElementById("name").value,

        notes:
            document.getElementById("notes").value

    };

    console.log("Sending transaction:", transaction);

    try {

        const response = await fetch(
            "/api/transactions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },

                body: JSON.stringify(transaction)
            }
        );

        const data = await response.json();

        console.log("Server response:", data);

        if (data.success) {

            alert(
                transactionType === "income"
                    ? "Money In recorded ✅"
                    : "Money Out recorded ✅"
            );

            cashForm.reset();

        } else {

            alert(
                data.message ||
                "Failed to save transaction."
            );

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

});

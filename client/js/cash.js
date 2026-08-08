const moneyInBtn = document.getElementById("moneyIn");
const moneyOutBtn = document.getElementById("moneyOut");

let transactionType = "income";


// Toggle transaction type

moneyInBtn.addEventListener("click", () => {

    transactionType = "income";

    moneyInBtn.classList.add("active");

    moneyOutBtn.classList.remove("active");

});


moneyOutBtn.addEventListener("click", () => {

    transactionType = "expense";

    moneyOutBtn.classList.add("active");

    moneyInBtn.classList.remove("active");

});



// Handle form submission

const cashForm = document.getElementById("cashForm");


cashForm.addEventListener("submit", async function(event){

    event.preventDefault();


    const token = localStorage.getItem("token");


    if(!token){

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



    try {


        const response = await fetch(
            "http://localhost:5000/api/transactions",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    "Authorization": token

                },


                body: JSON.stringify(transaction)

            }
        );



        const data = await response.json();



        if(data.success){


            alert(
                transaction.type === "income"
                ? "Money In recorded ✅"
                : "Money Out recorded ✅"
            );


            cashForm.reset();


        } else {


            alert(data.message || "Failed to save transaction.");


        }



    } catch(error){


        console.error(error);

        alert("Unable to connect to server.");


    }


});
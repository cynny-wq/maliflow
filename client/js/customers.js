const customerForm = document.getElementById("customerForm");


// Load customers from database

async function loadCustomers() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/customers"
        );

        const customers = await response.json();

        displayCustomers(customers);


    } catch(error) {

        console.error(error);
        alert("Unable to load customers.");

    }

}



// Add customer

customerForm.addEventListener("submit", async function(event){

    event.preventDefault();


    const customer = {

        name: document.getElementById("customerName").value,

        amount_owed: Number(
            document.getElementById("amountOwed").value
        )

    };


    try {


        const response = await fetch(
            "http://localhost:5000/api/customers",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify(customer)
            }
        );


        const data = await response.json();


        if(data.success){

            alert("Customer added ✅");

            customerForm.reset();

            loadCustomers();

        }


    } catch(error){

        console.error(error);

        alert("Failed to save customer.");

    }


});




// Display customers

function displayCustomers(customers){


    const customerList =
        document.getElementById("customerList");


    customerList.innerHTML = "";


    if(customers.length === 0){

        customerList.innerHTML = `
            <p>No customers yet</p>
        `;

        return;

    }



    customers.forEach(customer => {


        const item = document.createElement("div");


        item.classList.add("customer-item");


    

            item.innerHTML = `
    <div>

        <strong>${customer.name}</strong>

        <p>
            Remaining:
            KSh ${Number(customer.amount_owed).toLocaleString()}
        </p>

        <p>
            Paid:
            KSh ${Number(customer.amount_paid || 0).toLocaleString()}
        </p>

    </div>

    <button
        class="receive-payment"
        onclick="receivePayment(${customer.id})">

        Receive Payment

    </button>
`;

    

        customerList.appendChild(item);


    });


}
async function receivePayment(id) {

    const amount = prompt("Enter payment amount:");

    if (!amount) {
        return;
    }

    alert(
        `Customer ID: ${id}\nPayment: KSh ${amount}`
    );

}



// Start page

loadCustomers();
// ===============================
// MaliFlow Customers
// ===============================

const customerForm =
    document.getElementById("customerForm");

const token =
    localStorage.getItem("token");


// ===============================
// Check Login
// ===============================

if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// ===============================
// Load Customers
// ===============================

async function loadCustomers() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/customers",
            {
                headers: {
                    "Authorization": token
                }
            }
        );

        const data = await response.json();

        console.log("Customers response:", data);

        if (!response.ok) {

            console.error(
                "Customer API error:",
                data
            );

            alert(
                data.message ||
                "Unable to load customers."
            );

            return;
        }

        displayCustomers(data);

    } catch (error) {

        console.error(
            "Customer loading error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );

    }

}


// ===============================
// Add Customer
// ===============================

customerForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const customer = {

            name:
                document.getElementById(
                    "customerName"
                ).value,

            amount_owed:
                Number(
                    document.getElementById(
                        "amountOwed"
                    ).value
                )

        };


        try {

            const response = await fetch(
                "http://localhost:5000/api/customers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            token
                    },

                    body:
                        JSON.stringify(customer)
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to add customer."
                );

                return;

            }


            if (data.success) {

                alert(
                    "Customer added successfully!"
                );

                customerForm.reset();

                loadCustomers();

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );

        }

    }
);


// ===============================
// Display Customers
// ===============================

function displayCustomers(customers) {

    const customerList =
        document.getElementById(
            "customerList"
        );


    customerList.innerHTML = "";


    if (customers.length === 0) {

        customerList.innerHTML = `
            <p>No customers yet.</p>
        `;

        return;

    }


    customers.forEach(customer => {

        const item =
            document.createElement("div");


        item.className =
            "customer-item";


        item.innerHTML = `

            <strong>
                ${customer.name}
            </strong>

            <p>
                Remaining:
                KSh ${Number(
                    customer.amount_owed || 0
                ).toLocaleString()}
            </p>

            <p>
                Paid:
                KSh ${Number(
                    customer.amount_paid || 0
                ).toLocaleString()}
            </p>

            <button
                class="receive-payment"
                onclick="receivePayment(${customer.id})">

                Receive Payment

            </button>

        `;


        customerList.appendChild(item);

    });

}


// ===============================
// Receive Payment
// ===============================

async function receivePayment(id) {

    const amount =
        prompt(
            "Enter payment amount:"
        );


    if (!amount) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/customers/${id}/payment`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        token
                },

                body: JSON.stringify({
                    amount: Number(amount)
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Payment failed."
            );

            return;

        }


        alert(
            "Payment received successfully!"
        );


        loadCustomers();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );

    }

}


// ===============================
// Start
// ===============================

loadCustomers();
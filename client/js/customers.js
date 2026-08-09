// ===============================
// MaliFlow Customers
// ===============================

const customerForm =
    document.getElementById("customerForm");


// ===============================
// Load Customers
// ===============================

async function loadCustomers() {

    try {

        const response = await fetch(
            "/api/customers"
        );

        const customers =
            await response.json();

        if (!response.ok) {

            console.error(
                "Customer error:",
                customers
            );

            alert(
                customers.message ||
                "Unable to load customers."
            );

            return;

        }

        displayCustomers(customers);

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
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
                document
                    .getElementById("customerName")
                    .value,

            amount_owed:
                Number(
                    document
                        .getElementById("amountOwed")
                        .value
                )

        };


        try {

            const response = await fetch(
                "/api/customers",
                {
                    method: "POST",

                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },

                    body:
                        JSON.stringify(customer)
                }
            );


            const data =
                await response.json();


            if (data.success) {

                alert(
                    "Customer added successfully ✅"
                );

                customerForm.reset();

                loadCustomers();

            } else {

                alert(
                    data.message ||
                    "Failed to add customer."
                );

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server."
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
            <p class="empty">
                No customers yet
            </p>
        `;

        return;

    }


    customers.forEach(customer => {

        const item =
            document.createElement("div");


        item.className =
            "customer-item";


        const amountOwed =
            Number(
                customer.amount_owed || 0
            );


        const amountPaid =
            Number(
                customer.amount_paid || 0
            );


        item.innerHTML = `

            <div class="customer-info">

                <strong>
                    ${customer.name}
                </strong>

                <p>
                    Owed:
                    KSh ${amountOwed.toLocaleString()}
                </p>

                <p>
                    Paid:
                    KSh ${amountPaid.toLocaleString()}
                </p>

            </div>

<div class="customer-actions">

    <button
        class="receive-payment"
        onclick="receivePayment(${customer.id})"
    >
        Receive Payment
    </button>

    <button
        class="history-btn"
        onclick="viewPaymentHistory(${customer.id}, '${customer.name.replace(/'/g, "\\'")}')"
    >
        Payment History
    </button>

</div>


        `;


        customerList.appendChild(item);

    });

}


// ===============================
// Receive Payment
// ===============================

async function receivePayment(id) {

    const amount = prompt("Enter payment amount:");

    if (amount === null || amount.trim() === "") {
        return;
    }

    const payment = Number(amount);

    if (!Number.isFinite(payment) || payment <= 0) {
        alert("Please enter a valid payment amount.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    try {

        const response = await fetch(
            `/api/customers/${id}/payment`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },

                body: JSON.stringify({
                    amount: payment
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Payment received successfully ✅");

            loadCustomers();

        } else {

            alert(
                data.message ||
                "Failed to receive payment."
            );

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }
}
// ===============================
// View Payment History
// ===============================

async function viewPaymentHistory(id, customerName) {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    const modal =
        document.getElementById("paymentHistoryModal");

    const customerTitle =
        document.getElementById("paymentHistoryCustomer");

    const historyList =
        document.getElementById("paymentHistoryList");

    customerTitle.textContent = customerName;

    historyList.innerHTML = `
        <p class="payment-history-empty">
            Loading payment history...
        </p>
    `;

    modal.style.display = "flex";

    try {

        const response = await fetch(
            `/api/customers/${id}/payments`,
            {
                headers: {
                    "Authorization": token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            historyList.innerHTML = `
                <p class="payment-history-empty">
                    ${data.message || "Unable to load payment history."}
                </p>
            `;

            return;
        }

        if (data.payments.length === 0) {

            historyList.innerHTML = `
                <p class="payment-history-empty">
                    No payments recorded yet.
                </p>
            `;

            return;
        }

        historyList.innerHTML = "";

        data.payments.forEach(payment => {

            const item =
                document.createElement("div");

            item.className =
                "payment-history-item";

            item.innerHTML = `

                <div>

                    <div class="payment-history-amount">
                        KSh ${Number(payment.amount).toLocaleString()}
                    </div>

                    <div class="payment-history-date">
                        ${payment.created_at}
                    </div>

                </div>

            `;

            historyList.appendChild(item);

        });

    } catch (error) {

        console.error(error);

        historyList.innerHTML = `
            <p class="payment-history-empty">
                Unable to connect to server.
            </p>
        `;

    }
}
// ===============================
// Close Payment History
// ===============================

function closePaymentHistory() {

    const modal =
        document.getElementById("paymentHistoryModal");

    modal.style.display = "none";
}

// ===============================
// Start
// ===============================

loadCustomers();

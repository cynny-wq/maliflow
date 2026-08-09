// ===============================
// MaliFlow Dashboard
// ===============================

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}


// ===============================
// Load Business
// ===============================

async function loadBusiness() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/businesses",
            {
                headers: {
                    "Authorization": token
                }
            }
        );

        const business = await response.json();

        if (!response.ok) {
            console.error("Business error:", business);
            return;
        }

        if (business.owner_name) {

            document.getElementById("greeting").textContent =
                `Good Morning, ${business.owner_name} 👋`;

        }

        if (business.business_name) {

            document.getElementById("businessTitle").textContent =
                business.business_name;

        }

    } catch (error) {

        console.error("Business loading error:", error);

    }

}


// ===============================
// Load Customers
// ===============================

async function loadCustomerDebt() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/customers",
            {
                headers: {
                    "Authorization": token
                }
            }
        );

        const customers = await response.json();

        if (!response.ok) {

            console.error("Customer error:", customers);
            return;

        }

        let totalDebt = 0;

        customers.forEach(customer => {

            totalDebt += Number(
                customer.amount_owed || 0
            );

        });

        document.getElementById("customerDebt").textContent =
            `KSh ${totalDebt.toLocaleString()}`;

    } catch (error) {

        console.error("Customer loading error:", error);

    }

}


// ===============================
// Load Transactions
// ===============================

async function loadDashboard() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/transactions",
            {
                headers: {
                    "Authorization": token
                }
            }
        );

        const transactions = await response.json();

        console.log("Transactions response:", transactions);

        if (!response.ok) {

            console.error(
                "Transaction error:",
                transactions
            );

            alert(
                transactions.message ||
                "Unable to load transactions."
            );

            return;

        }

        let cashIn = 0;
        let cashOut = 0;

        const transactionList =
            document.getElementById("transactionList");

        transactionList.innerHTML = "";


        // Calculate totals

        transactions.forEach(transaction => {

            const amount =
                Number(transaction.amount || 0);

            if (transaction.type === "income") {

                cashIn += amount;

            } else {

                cashOut += amount;

            }

        });


        const balance =
            cashIn - cashOut;


        // Display totals

        document.getElementById("cashIn").textContent =
            `KSh ${cashIn.toLocaleString()}`;

        document.getElementById("cashOut").textContent =
            `KSh ${cashOut.toLocaleString()}`;

        document.getElementById("balance").textContent =
            `KSh ${balance.toLocaleString()}`;


        // No transactions

        if (transactions.length === 0) {

            transactionList.innerHTML = `
                <p class="empty">
                    No transactions yet
                </p>
            `;

            return;

        }


        // Display transactions

        transactions.forEach(transaction => {

    const item = document.createElement("div");

    item.className = "transaction-item";

    item.innerHTML = `
        <div class="transaction-info">

            <strong>${transaction.category}</strong>

            <p>${transaction.name || "No name"}</p>

            <span class="${transaction.type === "income" ? "positive" : "negative"}">
                ${transaction.type === "income" ? "+" : "-"}
                KSh ${Number(transaction.amount).toLocaleString()}
            </span>

        </div>

        <div class="transaction-actions">

            <button
                class="edit-btn"
                onclick="editTransaction(${transaction.id})">
                ✏️ Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})">
                🗑️ Delete
            </button>

        </div>
    `;

    transactionList.appendChild(item);

});

        

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        alert(
            "Unable to load dashboard."
        );

    }

}


// ===============================
// Start Dashboard
// ===============================

loadBusiness();

loadCustomerDebt();

loadDashboard();

// ===============================
// Delete Transaction
// ===============================

async function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `http://localhost:5000/api/transactions/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": token
                }
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Transaction deleted ✅");

            loadDashboard();

        } else {

            alert(data.message || "Failed to delete transaction.");

        }

    } catch (error) {

        console.error(error);

        alert("Unable to delete transaction.");

    }
}


// ===============================
// Edit Transaction
// ===============================

async function editTransaction(id) {

    const amount = prompt("Enter new amount:");

    if (amount === null) {
        return;
    }

    const category = prompt("Enter new category:");

    if (category === null) {
        return;
    }

    const name = prompt("Enter name:");

    if (name === null) {
        return;
    }

    const notes = prompt("Enter notes:");

    if (notes === null) {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `http://localhost:5000/api/transactions/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },

                body: JSON.stringify({

    type: prompt(
        "Type income for Money In or expense for Money Out:",
        "income"
    ),

    amount: Number(amount),

    category: category,

    name: name,

    notes: notes

})
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Transaction updated ✅");

            loadDashboard();

        } else {

            alert(data.message || "Failed to update transaction.");

        }

    } catch (error) {

        console.error(error);

        alert("Unable to update transaction.");

    }
}
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

            const item =
                document.createElement("div");

            item.className =
                "transaction-item";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const color =
                transaction.type === "income"
                    ? "positive"
                    : "negative";


            item.innerHTML = `

                <div>

                    <strong>
                        ${transaction.category || "Transaction"}
                    </strong>

                    <p>
                        ${transaction.name || "No name"}
                    </p>

                </div>

                <span class="${color}">

                    ${sign}
                    KSh ${Number(
                        transaction.amount || 0
                    ).toLocaleString()}

                </span>

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
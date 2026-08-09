const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

async function loadTransactions() {

    try {

        const response = await fetch(
            "/api/transactions",
            {
                headers: {
                    "Authorization": token
                }
            }
        );

        const transactions = await response.json();

        if (!response.ok) {
            alert(transactions.message || "Unable to load transactions.");
            return;
        }

        const transactionList =
            document.getElementById("transactionList");

        transactionList.innerHTML = "";

        if (transactions.length === 0) {

            transactionList.innerHTML =
                "<p>No transactions yet.</p>";

            return;
        }

        transactions.forEach(transaction => {

            const item = document.createElement("div");

            item.className = "transaction-item";

            const sign =
                transaction.type === "income" ? "+" : "-";

            const amount =
                Number(transaction.amount).toLocaleString();

            const className =
                transaction.type === "income"
                    ? "positive"
                    : "negative";

            item.innerHTML = `
                <div>
                    <strong>${transaction.category}</strong>
                    <p>${transaction.name || "No name"}</p>
                </div>

                <span class="${className}">
                    ${sign} KSh ${amount}
                </span>
            `;

            transactionList.appendChild(item);

        });

    } catch (error) {

        console.error(error);

        alert("Unable to load transactions.");

    }
}

loadTransactions();

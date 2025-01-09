const API_URL = "https://open.er-api.com/v6/latest/";

const fromSelect = document.querySelector("select[name='from']");
const toSelect = document.querySelector("select[name='to']");
const amountInput = document.querySelector(".amount input");
const msgDiv = document.querySelector(".msg");
const button = document.querySelector("button");

const loadCurrencies = async () => {
    try {
        // Fetch base data from USD as a reference point
        const response = await fetch(API_URL + "USD");
        const data = await response.json();

        if (data && data.rates) {
            const currencies = Object.keys(data.rates);

            // Populate both "from" and "to" dropdowns
            currencies.forEach(currency => {
                const optionFrom = document.createElement("option");
                optionFrom.value = currency;
                optionFrom.textContent = currency;
                fromSelect.appendChild(optionFrom);

                const optionTo = document.createElement("option");
                optionTo.value = currency;
                optionTo.textContent = currency;
                toSelect.appendChild(optionTo);
            });

            // Set default dropdown values
            fromSelect.value = "USD";
            toSelect.value = "INR";
        }
    } catch (error) {
        console.error("Error loading currencies:", error);
        msgDiv.textContent = "Failed to load currencies. Please refresh the page.";
    }
};

const getExchangeRate = async () => {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
        msgDiv.textContent = "Please enter a valid amount.";
        return;
    }

    try {
        // API call to fetch exchange rate for selected "fromCurrency"
        const response = await fetch(API_URL + fromCurrency);
        const data = await response.json();

        if (data && data.rates && data.rates[toCurrency]) {
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            msgDiv.innerHTML = `<strong>${amount} ${fromCurrency}</strong> = <strong>${convertedAmount} ${toCurrency}</strong>`;
        } else {
            msgDiv.textContent = "Conversion failed. Please try again.";
        }
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msgDiv.textContent = "Error fetching data. Please try again later.";
    }
};

// Event listeners
document.addEventListener("DOMContentLoaded", loadCurrencies);
button.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    getExchangeRate();
});

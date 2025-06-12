document.addEventListener('DOMContentLoaded', () => {
    const incomeBtn = document.getElementById('incomeBtn');
    const expenseBtn = document.getElementById('expenseBtn');
    const formContainer = document.getElementById('formContainer');
    const entriesContainer = document.getElementById('entriesContainer');

    let currentForm = null;

    // Form templates
    const incomeForm = `
        <div class="form-group" id="incomeForm">
            <h3>Add Income Entry</h3>
            <input type="text" id="clientName" placeholder="Client Name" required>
            <input type="number" id="numCars" placeholder="Number of Cars" required>
            <input type="number" id="incomeAmount" placeholder="Amount" required>
            <textarea id="incomeDescription" placeholder="Description" required></textarea>
            <button class="submit-btn" id="incomeSubmit" disabled>Submit Income</button>
        </div>
    `;

    const expenseForm = `
        <div class="form-group" id="expenseForm">
            <h3>Add Expense Entry</h3>
            <input type="text" id="expenseTitle" placeholder="Title" required>
            <input type="number" id="expenseAmount" placeholder="Amount" required>
            <button class="submit-btn" id="expenseSubmit" disabled>Submit Expense</button>
        </div>
    `;

    // Event listeners for buttons
    incomeBtn.addEventListener('click', () => showForm('income'));
    expenseBtn.addEventListener('click', () => showForm('expense'));

    // Function to show appropriate form
    function showForm(type) {
        if (currentForm) {
            currentForm.remove();
        }
        
        formContainer.innerHTML = type === 'income' ? incomeForm : expenseForm;
        currentForm = formContainer.querySelector('.form-group');
        
        // Add validation for income form
        if (type === 'income') {
            const incomeSubmit = document.getElementById('incomeSubmit');
            const inputs = [
                document.getElementById('clientName'),
                document.getElementById('numCars'),
                document.getElementById('incomeAmount'),
                document.getElementById('incomeDescription')
            ];

            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    incomeSubmit.disabled = inputs.some(input => !input.value.trim());
                });
            });

            incomeSubmit.addEventListener('click', handleIncomeSubmit);
        } else {
            const expenseSubmit = document.getElementById('expenseSubmit');
            const inputs = [
                document.getElementById('expenseTitle'),
                document.getElementById('expenseAmount')
            ];

            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    expenseSubmit.disabled = inputs.some(input => !input.value.trim());
                });
            });

            expenseSubmit.addEventListener('click', handleExpenseSubmit);
        }
    }

    // Handle income submission
    async function handleIncomeSubmit(e) {
        e.preventDefault();
        const clientName = document.getElementById('clientName').value;
        const numCars = document.getElementById('numCars').value;
        const amount = document.getElementById('incomeAmount').value;
        const description = document.getElementById('incomeDescription').value;

        // Add entry to UI
        const entry = document.createElement('div');
        entry.className = 'entry-card income-card';
        entry.innerHTML = `
            <strong>Client:</strong> ${clientName}<br>
            <strong>Cars:</strong> ${numCars}<br>
            <strong>Amount:</strong> $${amount}<br>
            <strong>Description:</strong> ${description}
        `;
        entriesContainer.appendChild(entry);

        // Send to Google Sheets
        await sendToGoogleSheets('income', {
            type: 'income',
            clientName,
            numCars,
            amount,
            description,
            timestamp: new Date().toISOString()
        });

        // Clear form
        currentForm.remove();
        currentForm = null;
    }

    // Handle expense submission
    async function handleExpenseSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('expenseTitle').value;
        const amount = document.getElementById('expenseAmount').value;

        // Add entry to UI
        const entry = document.createElement('div');
        entry.className = 'entry-card expense-card';
        entry.innerHTML = `
            <strong>Title:</strong> ${title}<br>
            <strong>Amount:</strong> $${amount}
        `;
        entriesContainer.appendChild(entry);

        // Send to Google Sheets
        await sendToGoogleSheets('expense', {
            type: 'expense',
            title,
            amount,
            timestamp: new Date().toISOString()
        });

        // Clear form
        currentForm.remove();
        currentForm = null;
    }

    // Function to send data to Google Sheets
    async function sendToGoogleSheets(type, data) {
        try {
            const response = await fetch('http://localhost:5000/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            if (result.status === 'success') {
                console.log('Successfully saved to Google Sheets');
            } else {
                console.error('Error saving to Google Sheets:', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

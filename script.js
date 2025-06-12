document.addEventListener('DOMContentLoaded', () => {
    const incomeBtn = document.getElementById('incomeBtn');
    const expenseBtn = document.getElementById('expenseBtn');
    const entriesContainer = document.getElementById('entriesContainer');

    // Event listeners for buttons
    incomeBtn.addEventListener('click', () => showForm('income'));
    expenseBtn.addEventListener('click', () => showForm('expense'));

    // Event listeners for forms
    const incomeForm = document.getElementById('incomeForm');
    const expenseForm = document.getElementById('expenseForm');

    incomeForm.addEventListener('submit', handleIncomeSubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit);

    // Form validation
    const incomeInputs = incomeForm.querySelectorAll('input, textarea');
    const expenseInputs = expenseForm.querySelectorAll('input');

    incomeInputs.forEach(input => {
        input.addEventListener('input', () => {
            const submitBtn = incomeForm.querySelector('.submit-btn');
            submitBtn.disabled = Array.from(incomeInputs).some(input => !input.value.trim());
        });
    });

    expenseInputs.forEach(input => {
        input.addEventListener('input', () => {
            const submitBtn = expenseForm.querySelector('.submit-btn');
            submitBtn.disabled = Array.from(expenseInputs).some(input => !input.value.trim());
        });
    });

    // Function to show appropriate form
    function showForm(type) {
        const incomeForm = document.getElementById('incomeForm');
        const expenseForm = document.getElementById('expenseForm');
        
        incomeForm.style.display = type === 'income' ? 'block' : 'none';
        expenseForm.style.display = type === 'expense' ? 'block' : 'none';
    }

    // Handle income submission
    async function handleIncomeSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Add entry to UI
        const entry = document.createElement('div');
        entry.className = 'entry-card income-card';
        entry.innerHTML = `
            <strong>Client:</strong> ${data.clientName}<br>
            <strong>Cars:</strong> ${data.numCars}<br>
            <strong>Amount:</strong> $${data.incomeAmount}<br>
            <strong>Description:</strong> ${data.incomeDescription}
        `;
        entriesContainer.appendChild(entry);

        // Send to Google Sheets
        await sendToGoogleSheets('income', {
            type: 'income',
            clientName: data.clientName,
            numCars: data.numCars,
            amount: data.incomeAmount,
            description: data.incomeDescription,
            timestamp: new Date().toISOString()
        });

        // Reset form
        e.target.reset();
        incomeForm.style.display = 'none';
    }

    // Handle expense submission
    async function handleExpenseSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Add entry to UI
        const entry = document.createElement('div');
        entry.className = 'entry-card expense-card';
        entry.innerHTML = `
            <strong>Title:</strong> ${data.expenseTitle}<br>
            <strong>Amount:</strong> $${data.expenseAmount}
        `;
        entriesContainer.appendChild(entry);

        // Send to Google Sheets
        await sendToGoogleSheets('expense', {
            type: 'expense',
            title: data.expenseTitle,
            amount: data.expenseAmount,
            timestamp: new Date().toISOString()
        });

        // Reset form
        e.target.reset();
        expenseForm.style.display = 'none';
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

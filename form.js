document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
});

function showIncomeForm() {
    document.getElementById('incomeForm').classList.add('active');
    document.getElementById('expenseForm').classList.remove('active');
    document.getElementById('submitButton').style.display = 'block';
}

function showExpenseForm() {
    document.getElementById('expenseForm').classList.add('active');
    document.getElementById('incomeForm').classList.remove('active');
    document.getElementById('submitButton').style.display = 'block';
}

function submitForm() {
    const date = document.getElementById('date').value;
    const submissions = document.getElementById('submissions');
    const formData = new FormData();
    
    // Get form data based on which form is active
    if (document.getElementById('incomeForm').classList.contains('active')) {
        const client = document.getElementById('client').value;
        const cars = document.getElementById('cars').value;
        const amount = document.getElementById('amount').value;
        const service = document.getElementById('service').value;
        
        // Create JSON object
        const incomeData = {
            "date": date,
            "client": client,
            "cars": cars,
            "amount": amount,
            "service": service
        };
        
        // Create display element
        const incomeDisplay = document.createElement('div');
        incomeDisplay.className = 'submission income-submission';
        incomeDisplay.textContent = `Client: ${client} - Cars: ${cars} - Amount: $${amount} - Service: ${service}`;
        submissions.insertBefore(incomeDisplay, submissions.firstChild);
        
        // Send to webhook
        sendToWebhook(incomeData);
    } else if (document.getElementById('expenseForm').classList.contains('active')) {
        const title = document.getElementById('title').value;
        const amount = document.getElementById('expenseAmount').value;
        
        // Create JSON object
        const expenseData = {
            "date": date,
            "title": title,
            "amount": amount
        };
        
        // Create display element
        const expenseDisplay = document.createElement('div');
        expenseDisplay.className = 'submission expense-submission';
        expenseDisplay.textContent = `Title: ${title} - Amount: $${amount}`;
        submissions.insertBefore(expenseDisplay, submissions.firstChild);
        
        // Send to webhook
        sendToWebhook(expenseData);
    }
}

function sendToWebhook(data) {
    // This function will be called when form is submitted
    // The actual webhook URL will be configured in n8n
    console.log('Form data submitted:', data);
    // In a real implementation, this would make an HTTP POST request to your webhook URL
    // fetch(webhookUrl, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // });
}

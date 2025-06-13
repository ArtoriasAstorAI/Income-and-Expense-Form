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

function addCarSection() {
    const container = document.getElementById('carsContainer');
    const carSection = document.createElement('div');
    carSection.className = 'car-section';
    
    const carId = container.children.length + 1;
    
    carSection.innerHTML = `
        <div class="car-header">
            <h3>Car ${carId}</h3>
            <button class="remove-car-btn" onclick="removeCarSection(this)">×</button>
        </div>
        <div class="form-group">
            <label for="service${carId}">Service Type:</label>
            <select id="service${carId}" name="service${carId}" required>
                <option value="">Select Service</option>
                <option value="Exterior">Exterior</option>
                <option value="Interior">Interior</option>
                <option value="Both">Both</option>
                <option value="Ceramic">Ceramic</option>
            </select>
        </div>
        <div class="form-group">
            <label for="price${carId}">Price:</label>
            <input type="number" id="price${carId}" name="price${carId}" step="0.01" required oninput="updateCalculatedFields()">
        </div>
    `;
    
    container.appendChild(carSection);
    updateCalculatedFields();
}

function removeCarSection(button) {
    const carSection = button.parentElement.parentElement;
    carSection.remove();
    updateCalculatedFields();
}

function updateCalculatedFields() {
    const carsContainer = document.getElementById('carsContainer');
    const carSections = carsContainer.children;
    let totalAmount = 0;
    
    // Calculate total amount from all car prices
    for (let section of carSections) {
        const price = section.querySelector('input[type="number"]').value;
        totalAmount += parseFloat(price) || 0;
    }
    
    // Update the calculated fields
    document.getElementById('numCars').textContent = carSections.length;
    document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;
}

function submitForm() {
    const date = document.getElementById('date').value;
    const submissions = document.getElementById('submissions');
    
    if (document.getElementById('incomeForm').classList.contains('active')) {
        const client = document.getElementById('client').value;
        const carsContainer = document.getElementById('carsContainer');
        const carSections = carsContainer.children;

        // Initialize aggregators
        let totalAmount = 0;
        const counts = { Exterior: 0, Interior: 0, Both: 0, Ceramic: 0 };
        const costs  = { Exterior: 0, Interior: 0, Both: 0, Ceramic: 0 };

        // Collect data from each car section
        for (let section of carSections) {
            const service = section.querySelector('select').value;
            const priceVal = section.querySelector('input[type="number"]').value;
            const price = parseFloat(priceVal) || 0;

            if (service && counts.hasOwnProperty(service)) {
                counts[service] += 1;
                costs[service]  += price;
            }
            totalAmount += price;
        }

        // Build aggregated JSON object
        const incomeData = {
            date: date,
            client: client,
            type: "income",
            number_of_cars: carSections.length,
            total_amount: totalAmount.toFixed(2),
            exterior: counts.Exterior,
            interior: counts.Interior,
            both: counts.Both,
            ceramic: counts.Ceramic,
            exterior_cost: costs.Exterior.toFixed(2),
            interior_cost: costs.Interior.toFixed(2),
            both_cost: costs.Both.toFixed(2),
            ceramic_cost: costs.Ceramic.toFixed(2)
        };
        
        // Create display element
        const incomeDisplay = document.createElement('div');
        incomeDisplay.className = 'submission income-submission';
        incomeDisplay.innerHTML = `
            <div>Client: ${client}</div>
            <div>Total Amount: $${totalAmount.toFixed(2)}</div>
            <div>Cars: ${incomeData.number_of_cars}</div>
            <div>Exterior: ${incomeData.exterior} - $${incomeData.exterior_cost}</div>
            <div>Interior: ${incomeData.interior} - $${incomeData.interior_cost}</div>
            <div>Both: ${incomeData.both} - $${incomeData.both_cost}</div>
            <div>Ceramic: ${incomeData.ceramic} - $${incomeData.ceramic_cost}</div>
        `;
        submissions.insertBefore(incomeDisplay, submissions.firstChild);
        
        // Send to webhook
        sendToWebhook(incomeData);
        
        // Clear form fields
        document.getElementById('client').value = '';
        document.getElementById('numCars').textContent = '0';
        document.getElementById('totalAmount').textContent = '$0.00';
        document.getElementById('carsContainer').innerHTML = '';
        
        // Hide the income form
        document.getElementById('incomeForm').classList.remove('active');
        document.getElementById('submitButton').style.display = 'none';
    } else if (document.getElementById('expenseForm').classList.contains('active')) {
        const title = document.getElementById('title').value;
        const amount = document.getElementById('expenseAmount').value;
        
        // Create JSON object
        const expenseData = {
            "date": date,
            "type": "expense",
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
        
        // Clear form fields
        document.getElementById('title').value = '';
        document.getElementById('expenseAmount').value = '';
    }
}


function sendToWebhook(data) {
    // This function will be called when form is submitted
    // The actual webhook URL will be configured in n8n
    console.log('Form data submitted:', data);
    // In a real implementation, this would make an HTTP POST request to your webhook URL
    fetch("https://artorias.app.n8n.cloud/webhook-test/daily-detailing-form", {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)
     });
}

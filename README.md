# Income & Expense Tracker

A web-based income and expense tracking application that integrates with Google Sheets.

## Features

- Add income entries with client name, number of cars, amount, and description
- Add expense entries with title and cost
- Real-time form validation
- Visual feedback with green cards for income and red cards for expenses
- Automatic synchronization with Google Sheets

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Google Sheets API:
   - Go to Google Cloud Console (https://console.cloud.google.com/)
   - Create a new project
   - Enable Google Sheets API
   - Create credentials (OAuth 2.0 Client IDs)
   - Download credentials.json and place it in the project directory

3. Create a Google Sheet and share it with the service account email from credentials.json

4. Run the application:
```bash
python app.py
```

5. Open your browser and navigate to http://localhost:5000

## Usage

1. Click "Add Income" or "Add Expense" button to show the form
2. Fill in the required fields
3. Click submit when all fields are filled
4. Entries will appear below the form with green cards for income and red cards for expenses
5. All entries are automatically saved to your Google Sheet

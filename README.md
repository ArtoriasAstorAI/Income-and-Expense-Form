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

## Deployment

### Using Vercel

1. Create a new repository on GitHub
2. Push your code to the repository
3. Go to Vercel (https://vercel.com)
4. Click "Import Project"
5. Connect your GitHub account
6. Select your repository
7. In the "Environment Variables" section, add:
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `GOOGLE_PROJECT_ID`: Your Google Cloud Project ID
   - `GOOGLE_AUTH_URI`: https://accounts.google.com/o/oauth2/auth
   - `GOOGLE_TOKEN_URI`: https://oauth2.googleapis.com/token
   - `GOOGLE_AUTH_PROVIDER_X509_CERT_URL`: https://www.googleapis.com/oauth2/v1/certs
   - `GOOGLE_REDIRECT_URIS`: https://your-vercel-domain/api/submit

8. Click "Deploy"
9. After deployment, update your Google Cloud Console:
   - Go to API & Services > Credentials
   - Add your Vercel domain to the authorized domains
   - Update the authorized redirect URIs to include your Vercel domain

## Local Development

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and fill in your credentials

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to http://localhost:5000

## Usage

1. Click "Add Income" or "Add Expense" button to show the form
2. Fill in the required fields
3. Click submit when all fields are filled
4. Entries will appear below the form with green cards for income and red cards for expenses
5. All entries are automatically saved to your Google Sheet

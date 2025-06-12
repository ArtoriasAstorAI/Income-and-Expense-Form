from flask import Flask, request, jsonify
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
import json

app = Flask(__name__)

# If modifying these SCOPES, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# The ID of your Google Sheet
SPREADSHEET_ID = '1B_I9Tx9taWi37nu-NtdkSiqFsNxSpDlVqu4EdtuZq7A'

# Load credentials from environment variables
def get_credentials():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            credentials = {
                "installed": {
                    "client_id": os.getenv('GOOGLE_CLIENT_ID'),
                    "project_id": os.getenv('GOOGLE_PROJECT_ID'),
                    "auth_uri": os.getenv('GOOGLE_AUTH_URI'),
                    "token_uri": os.getenv('GOOGLE_TOKEN_URI'),
                    "auth_provider_x509_cert_url": os.getenv('GOOGLE_AUTH_PROVIDER_X509_CERT_URL'),
                    "client_secret": os.getenv('GOOGLE_CLIENT_SECRET'),
                    "redirect_uris": [os.getenv('GOOGLE_REDIRECT_URIS')]
                }
            }
            
            flow = InstalledAppFlow.from_client_config(credentials, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    return creds

@app.route('/api/submit', methods=['POST'])
def submit_entry():
    try:
        data = request.json
        
        # Get credentials and create service
        creds = get_credentials()
        service = build('sheets', 'v4', credentials=creds)

        # Prepare the data to be written
        values = [
            [
                data['type'],
                data.get('clientName', ''),
                data.get('numCars', ''),
                data.get('amount', ''),
                data.get('description', ''),
                data.get('title', ''),
                data['timestamp']
            ]
        ]

        body = {
            'values': values
        }

        # Write to Google Sheets
        result = service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range='Sheet1!A:G',
            valueInputOption='RAW',
            body=body
        ).execute()

        return jsonify({'status': 'success'}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

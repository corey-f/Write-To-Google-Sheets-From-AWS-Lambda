const {google} = require('googleapis');
const RANGE = 'A1';
const SPREADSHEET_ID = '<THE ID OF THE GOOGLE SHEET THAT YOU WANT TO ADD DATA TO>';

exports.handler = async (event, context) => {
  const promise = new Promise(function(resolve, reject) {
    
    // Prepare the data that will be sent to the google sheet, in this case it's coming from a DynamoDB trigger and filtering for newly inserted records only
    const newRowData = [];
    for (const record of event.Records) {
      if(record.eventName != undefined && record.eventName == "INSERT"){
        newRowData.push([
          record['dynamodb']['NewImage']['fieldname1']['S'],
          record['dynamodb']['NewImage']['fieldname2']['S'],
          record['dynamodb']['NewImage']['fieldname3']['N'],
          "" + Math.floor(Date.now() / 1000)
        ]);
      }
    }

    // The private key and client email needed for authentication, from the service account created in https://console.developers.google.com/apis/credentials
    const key = {
      "private_key": "<FROM YOUR SERVICE ACCOUNT CREDENTIAL FILE>",
      "client_email": "<FROM YOUR SERVICE ACCOUNT CREDENTIAL FILE>"
    };
    
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
      null
    );
    
    if(newRowData.length > 0) {
      // Get authorization to make the Google sheets call
      jwtClient.authorize((err, tokens) => {
        if (err) {
          reject(Error(err));
        } else {
          const body = {
            values: newRowData,
          }
          
          // Make the Google sheets call
          const sheets = google.sheets({version: 'v4', jwtClient});
          
          sheets.spreadsheets.values.append({
            auth: jwtClient,
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: 'USER_ENTERED',
            resource: body
          }, (err, result) => {
            if(err) {
              reject(Error(err));
            } else {
              resolve(result.status);
            }
          });
        }
      });
    }
  });
  return promise;
}
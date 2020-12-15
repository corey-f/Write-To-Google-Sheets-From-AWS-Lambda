# Writing Data From AWS Lambda to Google Sheets

This code sample provides a simple demonstration of how to use a Node JS AWS Lambda to write data to a Google Sheet.

A rough overview of the process:

1. If you haven't already, download Node JS: https://nodejs.org/en/download/
2. Create a new directoy on your system, this is where you will create the lambda function, I'll refer to this directory as "lambda root"
3. Open a Git Bash terminal in the lambda root directory, and install the necessary google apis using the command "npm install googleapis@39 --save" (don't forget the @39, without that you'll get an incompatible version of the API)
4. Create a new file in the lambda root directory called "index.js", and add the code for your lambda function based on index.js in this repo
5. Create a google service account on https://console.developers.google.com/apis/credentials and download the credentials
6. Extract the credentials for private_key and client_email from step 5, and enter them into your index.js
7. Update SPREADSHEET_ID to be the ID of the spreadsheet you want to write to
8. From the lambda root directory, createa zip of all of the files
9. Deploy that zip to a nodejs lambda function and test as needed
10. Profit

const { getSheets, getAuth2Client } = require('./gsheet');

let kitrows = 'Initial value';
let flagSet = false;

let sheetIDs = [
  { name: 'Copy of KIT', id: '1012188693', firstrow: 2 },
];

function returnKitRows() {
  return kitrows;
}

function flagNotSet() {
  return ! flagSet; 
}

function getKitRows() {
  //console.log('gsheet-kit.getKitRows() setting flagSet to false');
  flagSet = false;

  getKitList();
}

function getKitList(){
  // 7/5/22 DH: Need to get the sheets once it has been authorized by 'gsheet': 
  //            'authorize()' + 'getInitialValues(auth)'
  let sheets = getSheets();
  flagSet = false;

  sheets.spreadsheets.values.get({
    // 11/11/20 DH: Accessing 'Addresses:Personal' from 'freehazell@gmail.com'
    //spreadsheetId: '11tdSmNDpvY1ATQLZvHXmJ2yi_44a94EwzUmTUUkRg1s',
    //range: 'Personal!A1:H',

    spreadsheetId: '11tdSmNDpvY1ATQLZvHXmJ2yi_44a94EwzUmTUUkRg1s',
    range:  `${sheetIDs[0].name}!A1:F`,

  }, (err, res) => {
    if (err) { 
      console.log('The API returned an error: ' + err);
      
      return;
    }

    kitrows = res.data.values;
    console.log('gsheet.getKitList() rows: '+ kitrows.length);

    if (kitrows.length) {
      //console.log('gsheet-kit.getKitList(): '+kitrows.toString() );
    } else {
      console.log('No data found.');
    }
    // 22/12/20 DH: Creating blocking mode for Angular IO
    flagSet = true;

  } );
}

// 8/5/22 DH:
//async function appendAndDelRow(fromSheetName, index, toSheetName, row) {
async function addKitRow(row) {
  let sheets = getSheets();
  let oAuth2Client = getAuth2Client()
  flagSet = false;

  const request = {
    // 24/11/20 DH: Accessing 'Addresses:Deleted' from 'freehazell@gmail.com'
    spreadsheetId: '11tdSmNDpvY1ATQLZvHXmJ2yi_44a94EwzUmTUUkRg1s',
    // 15/12/20 DH:
    //range: 'Deleted!A1',
    //range: `${toSheetName}!A1`,
    range: `${sheetIDs[0].name}!A1`,

    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      majorDimension: "ROWS",
      values: row,
    },
    auth: oAuth2Client,
  };

  try {
    console.log('await sheets.spreadsheets.values.append()...')
    const response = (await sheets.spreadsheets.values.append(request)).data;
    console.log('sheets.spreadsheets.values.append() returned: ');
    console.log(JSON.stringify(response, null, 2));

    flagSet = true;

  } catch (err) {
    console.error(err);
  }
}


module.exports = {
  // 7/5/22 DH: 'Personal' sheet in 'Addresses'
  //getRows,
  //returnRows,

  // 7/5/22 DH: 'flagNotSet()' needs to be in same file as 'flagSet'
  flagNotSet,

  // 7/5/22 DH: 'Copy of KIT' sheet in 'Addresses'
  addKitRow,
  getKitRows,
  returnKitRows,
};
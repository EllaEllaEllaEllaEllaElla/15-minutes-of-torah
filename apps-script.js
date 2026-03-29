// ─────────────────────────────────────────────────────────────────────────────
// 15 Minutes of Torah — Google Apps Script
//
// HOW TO USE:
//   1. Open your Google Sheet
//   2. Extensions → Apps Script
//   3. Delete everything and paste this entire file
//   4. Click Deploy → New deployment → Web app
//      - Execute as: Me
//      - Who has access: Anyone
//   5. Click Deploy → copy the URL
//   6. Paste the URL into index.html where it says YOUR_APPS_SCRIPT_URL_HERE
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAME = 'Responses'; // change if you want a different tab name

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Create the sheet and add headers if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Student Name',
        '1st Choice',
        '2nd Choice',
        '3rd Choice',
        'Notes',
      ]);
      // Bold the header row
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.name,
      data.first.day + ', ' + data.first.start,
      data.second.day + ', ' + data.second.start,
      data.third.day + ', ' + data.third.start,
      data.notes || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test this function manually in the Apps Script editor to verify the sheet works
function testSubmit() {
  doPost({
    postData: {
      contents: JSON.stringify({
        name: 'Test Student',
        terms: '0',
        first:  { day: 'Wednesday', period: '11', start: '11:30 AM' },
        second: { day: 'Thursday',  period: '2A', start: '2:25 PM'  },
        third:  { day: 'Monday',    period: '12', start: '12:50 PM' },
        notes: 'This is a test note.',
      })
    }
  });
}

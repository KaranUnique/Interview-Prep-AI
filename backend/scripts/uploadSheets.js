const fs = require('fs');
const path = require('path');
const axios = require('axios');

const SHEETS_DIR = path.join(__dirname, '../sheets');
const API_URL = 'https://interview-prep-ai-k6xq.onrender.com/api/sheets/upload'; // Use deployed backend for uploads

async function uploadSheet(filename) {
  const filePath = path.join(SHEETS_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  try {
    const res = await axios.post(API_URL, {
      filename,
      data
    });
  console.log(`Uploaded ${filename}:`, res.data);
  } catch (err) {
    console.error(`Error uploading ${filename}:`, err.response?.data || err.message);
    console.error('Full error:', err);
  }
}

async function main() {
  const files = fs.readdirSync(SHEETS_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    await uploadSheet(file);
  }
  console.log('All sheets attempted.');
}

main();

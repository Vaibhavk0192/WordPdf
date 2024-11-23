const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to convert docx to HTML using Mammoth
async function convertDocxToHtml(filePath) {
  const buffer = fs.readFileSync(filePath);
  const docData = await mammoth.convertToHtml({ buffer });
  return docData.value; // Returns HTML content
}

// Helper function to convert HTML to PDF using Puppeteer
async function convertHtmlToPdf(htmlContent, outputPath) {
  const browser = await puppeteer.launch({
    headless: true,          // Ensure Puppeteer runs in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'],  // Add flags for Docker compatibility
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
}

// Endpoint to upload .docx file, view metadata, and convert it to PDF
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const inputPath = file.path; // Path of the uploaded .docx file
  const outputPath = `converted/${file.originalname}.pdf`; // Path for the converted PDF

  try {
    // Step 1: Extract metadata
    const metadata = {
      originalName: file.originalname,
      size: file.size, // File size in bytes
      uploadTime: new Date().toISOString(),
    };

    // Step 2: Convert .docx to HTML
    const htmlContent = await convertDocxToHtml(inputPath);

    // Step 3: Convert HTML to PDF using Puppeteer
    await convertHtmlToPdf(htmlContent, outputPath);

    // Step 4: Respond with metadata and download link
    res.status(200).json({
      message: 'File uploaded and converted successfully!',
      metadata,
      downloadLink: `/download/${path.basename(outputPath)}`,
    });
  } catch (error) {
    console.error('Error during file conversion:', error);
    res.status(500).send('Error processing file.');
  }
});

// Endpoint to download the converted PDF
app.get('/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'converted', fileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

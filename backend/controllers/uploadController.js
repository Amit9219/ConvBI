const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const Dataset = require('../models/Dataset');

const upload = multer({ dest: 'uploads/' });

// Helper to determine type of column
const detectTypes = (results) => {
  if (results.length === 0) return [];
  const sample = results[0];
  const columns = [];
  
  for (const [key, value] of Object.entries(sample)) {
    let type = 'string';
    if (!isNaN(value) && value.trim() !== '') {
      type = 'number';
    } else if (!isNaN(Date.parse(value)) && isNaN(value)) {
      type = 'date'; // Optional logic
    }
    columns.push({ name: key, type });
  }
  return columns;
};

const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a CSV file' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const columns = detectTypes(results);
        
        // Convert number strings to actual numbers based on detected headers
        const cleanedData = results.map(row => {
          const newRow = { ...row };
          columns.forEach(col => {
            if (col.type === 'number') {
              newRow[col.name] = Number(row[col.name]);
            }
          });
          return newRow;
        });

        const dataset = await Dataset.create({
          name: req.body.name || req.file.originalname,
          user: req.user.id,
          columns,
          data: cleanedData
        });

        // Cleanup temp file
        fs.unlinkSync(req.file.path);

        res.status(201).json(dataset);
      } catch (error) {
        if(fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
      }
    });
};

const getDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find({ user: req.user.id }).select('-data');
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDatasetById = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset || dataset.user.toString() !== req.user.id) {
       return res.status(404).json({ message: 'Dataset not found' });
    }
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { upload, uploadCSV, getDatasets, getDatasetById };

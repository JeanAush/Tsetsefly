const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 5000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tsetse_fly',
  password: 'Esther13',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

// Middleware to check if a request is authenticated
const authenticateToken = (req, res, next) => {
 const authHeader = req.headers["authorization"];
    console.log(process.env.APP_SECRET);
    if (!authHeader) return res.sendStatus(403);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(" ")[1];
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      console.log("verifying");
      if (err) return res.sendStatus(403); //invalid token
  
      console.log(decoded); //for correct token
      next();
  });
};
/* 
 const authHeader = req.headers["authorization"];
    console.log(process.env.APP_SECRET);
    if (!authHeader) return res.sendStatus(403);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
      console.log("verifying");
      if (err) return res.sendStatus(403); //invalid token
  
      console.log(decoded); //for correct token
      next();
*/

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Login and generate a JWT
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.sendStatus(401);
    }

    const token = jwt.sign({ email: user.email }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Upload CSV data for the logged-in user
app.post('/api/upload-csv',authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { path } = req.file;
    console.log(req.file);
    const username = "jean"// Assuming the email is used as the username

    // Parse CSV file and insert data into the database
    const csvParsingResult = new Promise((resolve, reject) => {
      const insertionPromises = [];
      fs.createReadStream(path)
        .pipe(csvParser())
        .on('data', async (row) => {
          // Insert data into PostgreSQL database
          const insertionPromise = pool.query('INSERT INTO tsetse_fly_data (username, species, latitude, longitude, season, country, method) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [username, row.species, row.latitude, row.longitude, row.season, row.country, row.method]);
          insertionPromises.push(insertionPromise);
        })
        .on('end', () => {
          Promise.all(insertionPromises)
            .then(() => resolve())
            .catch(reject);
        });
    });

    await csvParsingResult; // Wait until all rows are processed
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


// Fetch distinct species
app.get('/api/species', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT species FROM tsetse_fly_data');
    res.json(result.rows.map(row => row.species));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Fetch distinct seasons
app.get('/api/season', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT season FROM tsetse_fly_data');
    res.json(result.rows.map(row => row.season));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Fetch distinct trap methods
app.get('/api/trap-method', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT method FROM tsetse_fly_data');
    res.json(result.rows.map(row => row.method));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Fetch distinct countries
app.get('/api/country', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tsetse_fly_data');
    res.json(result.rows.map(row => row));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Fetch tsetse fly data based on filters
app.get('/api/tsetse_fly_data', async (req, res) => {
  console.log("req data", req.query);
  try {
    const { species, season, method, country } = req.query;
    console.log("destrectured",species,season,method,country);
    const speciesArray = species ? species.split(',') : [];
    const seasonArray = season ? season.split(',') : [];
    const methodArray = method ? method.split(',') : [];
    const countryArray = country ? country.split(',') : [];
    if(!species  && !season && !method && !country){
      throw new Error('At least one filter must be provided.');

    }
     let query = 'SELECT * FROM tsetse_fly_data';
     if (species) { query += ` WHERE species = '${species}'`; }
    const data = await pool.query(
      `
      SELECT * FROM tsetse_fly_data
      WHERE species = ANY($1)
      AND season = ANY($2)
      AND method = ANY($3)
      AND country = ANY($4)
      `,
      // [speciesArray, seasonArray, methodArray, countryArray]
      [species,season,country,method]
    );
 console.log("data from maps");
    res.json(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Upload insect images (up to three)
// Upload images
app.post('/api/upload-images', upload.array('images', 3), async (req, res) => {
  try {
    const uploadedImages = req.files.map(file => ({ filename: file.originalname, filepath: file.path }));

    // Save image metadata to the database
    const insertionPromises = uploadedImages.map(image => pool.query('INSERT INTO insect_images (filename, filepath) VALUES ($1, $2) RETURNING id', [image.filename, image.filepath]));

    // Wait for all insertion operations to complete
    const insertedImageIds = await Promise.all(insertionPromises);

    res.status(200).json(insertedImageIds.map(result => result.rows[0].id));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Fetch uploaded images
app.get('/api/images', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insect_images');
    const images = result.rows;
    res.json(images);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

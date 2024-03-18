require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");

const app = express();
const port = 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: "tsetse_fly",
  password: "Esther13",
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
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
  jwt.verify(token, "your_secret_key", (err, decoded) => {
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
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Login and generate a JWT
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.sendStatus(401);
    }

    const token = jwt.sign({ email: user.email }, "your_secret_key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Upload CSV data for the logged-in user
app.post(
  "/api/upload-csv",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const { path } = req.file;
      console.log(req.file);
      const username = "jean"; // Assuming the email is used as the username

      // Parse CSV file and insert data into the database
      const csvParsingResult = new Promise((resolve, reject) => {
        const insertionPromises = [];
        fs.createReadStream(path)
          .pipe(csvParser())
          .on("data", async (row) => {
            // Insert data into PostgreSQL database
            const insertionPromise = pool.query(
              "INSERT INTO tsetse_fly_data (username, species, latitude, longitude, monthCaptured, country, CaptureMethod, tagname,  disease) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
              [
                username,
                row.species,
                row.latitude,
                row.longitude,
                row.monthCaptured,
                row.country,
                row.captureMethod,
                row.tagname,
                row.disease,
              ]
            );
            insertionPromises.push(insertionPromise);
          })
          .on("end", () => {
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
  }
);

// Upload insect images (up to three)
// Upload images
app.post("/api/upload-images", upload.single("image"), async (req, res) => {
  const { name } = req.body; // The species name
  const imageUrl = `/uploads/${req.file.filename}`; // Assuming you serve static files and uploads directory is accessible
  const findquery = await pool.query(
    `SELECT * FROM tsetse_fly_data WHERE species='${name}'`
  );
  console.log(findquery);
  try {
    const updateQuery = `
    UPDATE tsetse_fly_data
    SET images = $1
    WHERE TRIM(species) = TRIM($2) OR TRIM(tagname) = TRIM($2);
  `;
    const result = await pool.query(updateQuery, [imageUrl, name]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Species not found." });
    }

    res.json({ message: "Image uploaded and updated successfully!" });
  } catch (error) {
    console.error("Database or file error:", error);
    res.status(500).json({ message: "Failed to upload image." });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    const users = result.rows;
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.sendStatus(500);
  }
});

app.get("/api/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    const users = result.rows;
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.sendStatus(500);
  }
});

app.post("/api/users/delete", async (req, res) => {
  try {
    const { userId } = req.body;
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.sendStatus(500);
  }
});

app.post("/api/users/edit/:userId", async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.params.userId;

  try {
    let updateUserQuery = `UPDATE users SET `;
    const updateValues = [];
    if (username) {
      updateValues.push(username);
      updateUserQuery += `username = $${updateValues.length}`;
    }
    if (email) {
      if (updateValues.length > 0) updateUserQuery += ", ";
      updateValues.push(email);
      updateUserQuery += `email = $${updateValues.length}`;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (updateValues.length > 0) updateUserQuery += ", ";
      updateValues.push(hashedPassword);
      updateUserQuery += `password = $${updateValues.length}`;
    }
    updateUserQuery += ` WHERE id = ${userId}`;
    await pool.query(updateUserQuery, updateValues);
    res.json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.sendStatus(500);
  }
});

// Fetch tsetse fly data based on filters
app.get("/api/tsetse_fly_data", async (req, res) => {
  const { country, species, monthCaptured, captureMethod, disease } = req.query;

  let queryParts = {
    text: "SELECT * FROM tsetse_fly_data",
    values: [],
    conditions: [],
  };

  // Helper function to add conditions for each parameter
  const addCondition = (param, paramName) => {
    if (param) {
      const values = Array.isArray(param) ? param : [param];
      // For each value in the array, add a condition using the ANY construct
      values.forEach((value, index) => {
        queryParts.conditions.push(
          `${paramName} = ANY($${queryParts.values.length + 1})`
        );
        queryParts.values.push(values);
      });
    }
  };

  // Add conditions for all parameters
  addCondition(country, "country");
  addCondition(species, "species");
  addCondition(monthCaptured, "monthCaptured");
  addCondition(captureMethod, "captureMethod");
  addCondition(disease, "disease");

  // If there are any conditions, add them to the query
  if (queryParts.conditions.length > 0) {
    queryParts.text += " WHERE " + queryParts.conditions.join(" AND ");
  }

  try {
    const result = await pool.query(queryParts.text, queryParts.values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/tsetse_fly_data/:dataId", async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const result = await pool.query(
      "SELECT * FROM tsetse_fly_data WHERE id = $1",
      [dataId]
    );
    const data = result.rows;
    res.json(data);
  } catch (error) {
    console.error("Error fetching tsetse fly data:", error);
    res.sendStatus(500);
  }
});

app.post("/api/tsetse_fly_data/delete", async (req, res) => {
  try {
    const { dataId } = req.body;
    await pool.query("DELETE FROM tsetse_fly_data WHERE id = $1", [dataId]);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting tsetse fly data:", error);
    res.sendStatus(500);
  }
});

app.post(
  "/api/tsetse_fly_data/edit/:dataId",
  upload.single("image"),
  async (req, res) => {
    const { dataId } = req.params;
    const {
      username,
      species,
      latitude,
      longitude,
      monthCaptured,
      country,
      captureMethod,
      tagname,
      disease,
    } = req.body;
    let imageUrl = undefined;

    // Check if an image was uploaded and set the new image URL
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    try {
      let updateDataQuery = `UPDATE tsetse_fly_data SET `;
      const updateValues = [];
      const fieldsToUpdate = {
        username,
        species,
        latitude,
        longitude,
        monthCaptured,
        country,
        captureMethod,
        tagname,
        disease,
        images: imageUrl,
      };

      Object.entries(fieldsToUpdate).forEach(([key, value], index) => {
        // Skip if value is not provided (undefined)
        if (value !== undefined) {
          if (updateValues.length > 0) updateDataQuery += ", ";
          updateValues.push(value);
          updateDataQuery += `${key} = $${updateValues.length}`;
        }
      });

      if (updateValues.length === 0) {
        return res
          .status(400)
          .json({ message: "No fields or image provided for update." });
      }

      updateDataQuery += ` WHERE id = $${updateValues.length + 1}`;
      updateValues.push(dataId);

      await pool.query(updateDataQuery, updateValues);
      res.json({ message: "Tsetse fly data updated successfully." });
    } catch (error) {
      console.error("Error updating tsetse fly data:", error);
      res.status(500).json({ error: "Failed to update tsetse fly data." });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

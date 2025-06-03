require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


console.log("🔥🔥🔥 Backend restarted and running latest code");

console.log('📦 PREDICTION_KEY:', process.env.PREDICTION_KEY);
console.log('🌍 ENDPOINT:', process.env.ENDPOINT);
console.log('🆔 PROJECT_ID:', process.env.PROJECT_ID);
console.log('📸 ITERATION_NAME:', process.env.ITERATION_NAME);

const app = express();
const PORT = 5000;
const SECRET_KEY = "12345678"
// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://pothole-spotter-git-main-stevens-projects-8a9fb357.vercel.app',
  'https://pothole-spotter.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL connection
let db;
async function initDb() {
  try {
    db = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'wmL0/m3wXDc/UcIn',
      database: 'smartroads',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // ✅ ACTUAL connection check
    const [rows] = await db.query('SELECT 1');
    console.log('✅ MySQL connection and query successful');
  } catch (err) {
    console.error('❌ MySQL connection/query error:', err.message);
  }
}
initDb();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `pothole-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  const imageFile = req.file;
  // const { lat, lng } = req.body;

  console.log(req.files);
  res.send('Files uploaded');
  if (!imageFile) {
    return res.status(400).json({ error: 'Invalid file or coordinates' });
  }

  console.log('✅ Received image:', imageFile.path);
  return res.json({ message: 'Upload successful', filename: imageFile.filename });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Login,sign up


const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }


    const users = []// get users from database 

    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Return user and token
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = []// get users from database 
    // Mock database users
  
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    // Return user and token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});



app.post('/api/contact_us_messages', async (req, res) => {
  try {
    const { email, content, name, isPublic } = req.body;

    // Validate input
    if (!email || !content) {
      return res.status(400).json({ message: 'Email and message content are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // In a real application, we will:
    // 1. Save to database
    // 2. Possibly send email notification
    // 3. Handle public/private messages differently

    // Mock database save
    const newMessage = {
      id: Date.now().toString(),
      name: name || 'Anonymous',
      email,
      content,
      isPublic: isPublic !== false, // default to true if not specified
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      adminReply: null
    };

 

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return success response
    res.status(201).json({
      message: isPublic ? 'Message posted publicly!' : 'Private message received!',
      data: newMessage
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      message: 'An error occurred while processing your message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// end

// POST /analyze
app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;
    const {
      lat, lng,
      stretchStartLat, stretchStartLng,
      stretchEndLat, stretchEndLng
    } = req.body;

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (!imageFile || isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({ error: 'Missing image or location data' });
    }

    console.log('✅ Received image:', imageFile.path);
    console.log('📍 Location:', parsedLat, parsedLng);

    const imageBuffer = fs.readFileSync(imageFile.path);

    const endpoint = process.env.ENDPOINT.replace(/\/$/, '');
    const url = `${endpoint}/customvision/v3.0/Prediction/${process.env.PROJECT_ID}/classify/iterations/${process.env.ITERATION_NAME}/image`;

    console.log('➡️ Sending to Azure:', url);
    console.log('➡️ Headers:', {
      'Content-Type': 'application/octet-stream',
      'Prediction-Key': process.env.PREDICTION_KEY,
    });
    console.log('➡️ Image Buffer length:', imageBuffer.length);

    if (imageBuffer.length === 0) throw new Error('Image buffer is empty');

    const response = await axios.post(
      url,
      imageBuffer,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Prediction-Key': process.env.PREDICTION_KEY,
        },
      }
    );

    const topPrediction = response.data.predictions[0];
    const label = topPrediction.tagName;
    const confidence = topPrediction.probability;
    const imagePath = imageFile.path;

    await db.query(
      `INSERT INTO detections
       (label, image_url, lat, lng, stretch_start_lat, stretch_start_lng, stretch_end_lat, stretch_end_lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        label,
        imagePath,
        parsedLat,
        parsedLng,
        parseFloat(stretchStartLat) || null,
        parseFloat(stretchStartLng) || null,
        parseFloat(stretchEndLat) || null,
        parseFloat(stretchEndLng) || null,
      ]
    );

    console.log('✅ Detection saved to DB');
    const imageUrl = `http://localhost:${PORT}/uploads/${path.basename(imagePath)}`;

    res.json({
      label,
      confidence,
      location: { lat: parsedLat, lng: parsedLng },
      imageUrl,
    });
  } catch (err) {
    console.error('🔥 Error during analysis:', err.message);

    if (err.response) {
      console.error('Azure API response error:', err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Other error:', err);
    }

    res.status(500).json({ error: 'Server error during analysis' });
  }
});

// GET /detections/:id
app.get('/detections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM detections WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Detection not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('🔥 DB error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /detections
app.get('/detections', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM detections ORDER BY created_at DESC');
    res.json(results);
  } catch (err) {
    console.error('❌ Failed to fetch detections:', err.message);
    res.status(500).json({ error: 'Database error fetching detections' });
  }
});

// GET /api/spot
app.get('/api/spot', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM detections
       WHERE lat = ? AND lng = ?
       ORDER BY created_at DESC`,
      [parseFloat(lat), parseFloat(lng)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No data available yet.' });
    }

    res.json(rows);
  } catch (err) {
    console.error('🔥 Error fetching spot info:', err.message);
    res.status(500).json({ error: 'Server error fetching spot info' });
  }
});


// /heatmap-data Endpoint
app.get('/heatmap-data', async (req, res) => {
  try {
    
    const [rows] = await db.query(`
      SELECT
        ROUND(lat, 3) AS lat,
        ROUND(lng, 3) AS lng,
        SUM(
          CASE 
            WHEN label = 'major' THEN 3
            WHEN label = 'minor' THEN 2
            ELSE 0
          END
        ) AS weighted_score,
        COUNT(*) AS total
      FROM detections
      GROUP BY ROUND(lat, 3), ROUND(lng, 3);
    `);

    // Calculate intensity for each cluster 
    const heatmapPoints = rows.map(row => {
      const intensity = row.total === 0 ? 0 : row.weighted_score / (row.total * 3);
      return {
        lat: row.lat,
        lng: row.lng,
        intensity: parseFloat(intensity.toFixed(2))
      };
    });

    // Send JSON response
    res.json(heatmapPoints);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
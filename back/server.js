const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Sample data (in-memory storage, replace with a real database in production)
let users = [];
let places = [];

// Registration route
app.post('/api/auth/register', (req, res) => {
   console.log('Register route accessed. This is the register endpoint.');

  const { name, email, password, profileUrl } = req.body;

  if (!name || !email || !password || !profileUrl) {
    console.log('Missing required fields'); // Debug message
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    console.log('Email already in use:', email); // Debug message
    return res.status(400).json({ message: 'Email is already in use' });
  }

  const newUser = { id: Date.now(), name, email, password, profileUrl };
  users.push(newUser);
  console.log('User registered successfully:', newUser); // Debug message
  res.status(201).json(newUser);
});

// Login route
app.post('/api/auth/login', (req, res) => {
  console.log('Received login request:', req.body); // Debug message
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    console.log('Login successful for user:', user); // Debug message
    return res.json(user);
  }

  console.log('Invalid credentials for email:', email); // Debug message
  return res.status(400).json({ message: 'Invalid credentials' });
});

// Get all places
app.get('/api/places', (req, res) => {
  console.log('Fetching all places'); // Debug message
  res.json(places);
});

// Add a new place
app.post('/api/places', (req, res) => {
  console.log('Received new place request:', req.body); // Debug message
  const { place, imageUrl , lat, lng, userId} = req.body;

  if (!place || !lat || !lng || !userId || !imageUrl) {
    console.log('Missing required fields for place'); // Debug message
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newPlace = { id: Date.now(), place, lat, lng, userId, imageUrl };
  places.push(newPlace);
  console.log('New place added:', newPlace); // Debug message
  res.status(201).json(newPlace);
});

//all places
app.get('/api/users', (req, res) => {
    console.log('Fetching all users'); // Debug message
    res.json(users);
  });

// Delete a place
app.delete('/api/places/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete place with ID: ${id}`); // Debug message

  const placeIndex = places.findIndex(place => place.id === parseInt(id));

  if (placeIndex === -1) {
    console.log(`Place with ID ${id} not found`); // Debug message
    return res.status(404).json({ message: 'Place not found' });
  }

  places.splice(placeIndex, 1);
  console.log(`Place with ID ${id} deleted successfully`); // Debug message
  res.status(200).json({ message: 'Place deleted successfully' });
});

// Update a place
app.put('/api/places/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Received request to update place with ID: ${id}`, req.body); // Debug message
  const { place, lat, lng, userId, imageUrl } = req.body;

  const placeIndex = places.findIndex(place => place.id === parseInt(id));

  if (placeIndex === -1) {
    console.log(`Place with ID ${id} not found`); // Debug message
    return res.status(404).json({ message: 'Place not found' });
  }

  // Update place details
  places[placeIndex] = { id: parseInt(id), place, lat, lng, userId, imageUrl };
  console.log(`Place with ID ${id} updated successfully:`, places[placeIndex]); // Debug message
  res.status(200).json(places[placeIndex]);
});

// Get a single place by ID
app.get('/api/places/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Received request to fetch place with ID: ${id}`); // Debug message
  const place = places.find(place => place.id === parseInt(id));

  if (!place) {
    console.log(`Place with ID ${id} not found`); // Debug message
    return res.status(404).json({ message: 'Place not found' });
  }

  console.log(`Place with ID ${id} found:`, place); // Debug message
  res.json(place);
});

// Catch-all route for invalid endpoints (optional, for better error handling)
app.all('*', (req, res) => {
  console.log(`Invalid route requested: ${req.originalUrl}`); // Debug message
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); // Debug message
});

app.put('/api/users', (req, res) => {
    const { id, profileUrl } = req.body;  // Expecting id and profileUrl in the request body
  
    // Find the user by ID
    const userIndex = users.findIndex(user => user.id === parseInt(id));
  
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Update the user's profileUrl
    users[userIndex].profileUrl = profileUrl;
  
    // Return the updated user object
    res.status(200).json(users[userIndex]);
  });

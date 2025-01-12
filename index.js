const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const { resolve } = require('path')

const app = express()
const port = 3000

app.use(cors())
app.use(express.static('static'))

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to the SQLite database.')
  }
})

// Get All Restaurants
app.get('/restaurants', (req, res) => {
  const query = 'SELECT * FROM restaurants'
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ restaurants: rows })
  })
})

// Get Restaurant by ID
app.get('/restaurants/details/:id', (req, res) => {
  const query = 'SELECT * FROM restaurants WHERE id = ?'
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Restaurant not found' })
      return
    }
    res.json({ restaurant: row })
  })
})

// Get Restaurants by Cuisine
app.get('/restaurants/cuisine/:cuisine', (req, res) => {
  const query = 'SELECT * FROM restaurants WHERE cuisine = ?'
  db.all(query, [req.params.cuisine], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ restaurants: rows })
  })
})

// Get Restaurants by Filter
app.get('/restaurants/filter', (req, res) => {
  const { isVeg, hasOutdoorSeating, isLuxury } = req.query
  let query = 'SELECT * FROM restaurants WHERE 1=1'
  const params = []

  if (isVeg) {
    query += ' AND isVeg = ?'
    params.push(isVeg)
  }
  if (hasOutdoorSeating) {
    query += ' AND hasOutdoorSeating = ?'
    params.push(hasOutdoorSeating)
  }
  if (isLuxury) {
    query += ' AND isLuxury = ?'
    params.push(isLuxury)
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ restaurants: rows })
  })
})

// Get Restaurants Sorted by Rating
app.get('/restaurants/sort-by-rating', (req, res) => {
  const query = 'SELECT * FROM restaurants ORDER BY rating DESC'
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ restaurants: rows })
  })
})

// Get All Dishes
app.get('/dishes', (req, res) => {
  const query = 'SELECT * FROM dishes'
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ dishes: rows })
  })
})

// Get Dish by ID
app.get('/dishes/details/:id', (req, res) => {
  const query = 'SELECT * FROM dishes WHERE id = ?'
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Dish not found' })
      return
    }
    res.json({ dish: row })
  })
})

// Get Dishes by Filter
app.get('/dishes/filter', (req, res) => {
  const { isVeg } = req.query
  let query = 'SELECT * FROM dishes'
  const params = []

  if (isVeg) {
    query += ' WHERE isVeg = ?'
    params.push(isVeg)
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ dishes: rows })
  })
})

// Get Dishes Sorted by Price
app.get('/dishes/sort-by-price', (req, res) => {
  const query = 'SELECT * FROM dishes ORDER BY price ASC'
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ dishes: rows })
  })
})

// Default route
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'))
})

// Start the server
app.listen(port, () => {
  console.log(`FoodieFinds API listening at http://localhost:${port}`)
})

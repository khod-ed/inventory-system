const jwt = require('jsonwebtoken')
const { users } = require('../data/users')

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = users.find(u => u.id === decoded.userId)
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' })
  }
}

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' })
    }
    next()
  })
}

module.exports = { auth, adminAuth } 
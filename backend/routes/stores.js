const express = require('express');
const { 
  createStore, 
  getStores, 
  getStoreById, 
  updateStore, 
  deleteStore, 
  uploadImage 
} = require('../controllers/storeController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Store routes
router.post('/', uploadImage, createStore);
router.get('/', getStores);
router.get('/:storeId', getStoreById);
router.put('/:storeId', uploadImage, updateStore);
router.delete('/:storeId', deleteStore);

module.exports = router;

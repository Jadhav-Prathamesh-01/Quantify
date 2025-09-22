const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getStoresForRating,
  submitReview,
  getUserReviews,
  getStoreReviews,
  deleteReview
} = require('../controllers/reviewController');

// Get all stores for rating (public)
router.get('/stores', getStoresForRating);

// Get user's reviews (protected)
router.get('/my-reviews', authenticateToken, getUserReviews);

// Get store reviews (public)
router.get('/store/:storeId', getStoreReviews);

// Submit a review (protected)
router.post('/submit', authenticateToken, submitReview);

// Delete a review (protected)
router.delete('/:storeId', authenticateToken, deleteReview);

module.exports = router;

const Review = require('../models/Review');
const Store = require('../models/Store');

// Get all stores for rating
const getStoresForRating = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json({ success: true, stores });
  } catch (error) {
    console.error('Error fetching stores for rating:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stores' });
  }
};

// Submit a review
const submitReview = async (req, res) => {
  try {
    const { storeId, rating, reviewText } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid rating data. Rating must be between 1 and 5.' 
      });
    }

    // Create or update review
    const review = await Review.create(userId, storeId, rating, reviewText);
    
    // Update store rating
    await Review.updateStoreRating(storeId);

    res.json({ 
      success: true, 
      message: 'Review submitted successfully',
      review 
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.findByUserId(userId);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// Get store reviews
const getStoreReviews = async (req, res) => {
  try {
    const { storeId } = req.params;
    const reviews = await Review.findByStoreId(storeId);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching store reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch store reviews' });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const deleted = await Review.delete(userId, storeId);
    
    if (deleted) {
      // Update store rating after deletion
      await Review.updateStoreRating(storeId);
      res.json({ success: true, message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Review not found' });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

module.exports = {
  getStoresForRating,
  submitReview,
  getUserReviews,
  getStoreReviews,
  deleteReview
};

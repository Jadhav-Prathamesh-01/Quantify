const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin routes (simplified for now - no auth middleware)
router.get('/pending-stores', adminController.getPendingStores);
router.put('/approve-store/:storeId', adminController.approveStore);
router.put('/reject-store/:storeId', adminController.rejectStore);
router.get('/all-users', adminController.getAllUsers);
router.post('/add-user', adminController.addUser);
router.put('/update-user/:userId', adminController.updateUser);
router.delete('/delete-user/:userId', adminController.deleteUser);

// Store management routes
router.get('/all-stores', adminController.getAllStores);
router.post('/add-store', adminController.addStore);
router.put('/update-store/:storeId', adminController.updateStore);
router.delete('/delete-store/:storeId', adminController.deleteStore);

// Reviews and stats routes
router.get('/all-reviews', adminController.getAllReviews);
router.get('/stats', adminController.getStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin routes (simplified for now - no auth middleware)
router.get('/pending-stores', adminController.getPendingStores);
router.put('/approve-store/:storeId', adminController.approveStore);
router.put('/reject-store/:storeId', adminController.rejectStore);
router.get('/all-users', adminController.getAllUsers);
router.post('/add-user', adminController.addUser);

module.exports = router;

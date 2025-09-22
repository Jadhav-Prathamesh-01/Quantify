const User = require('../models/User');
const Store = require('../models/Store');
const Review = require('../models/Review');

// Get all pending store registrations
const getPendingStores = async (req, res) => {
  try {
    const pendingStores = await User.findByStatus('pending');
    res.json({ stores: pendingStores });
  } catch (error) {
    console.error('Get pending stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve a store registration
const approveStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const user = await User.findById(storeId);
    if (!user) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    if (user.role !== 'store') {
      return res.status(400).json({ message: 'User is not a store owner' });
    }
    
    if (user.status !== 'pending') {
      return res.status(400).json({ message: 'Store is not pending approval' });
    }
    
    // Update status to active
    await User.updateStatus(storeId, 'active');
    
    res.json({ 
      message: 'Store approved successfully',
      store: {
        id: user.id,
        name: user.name,
        email: user.email,
        storeName: user.store_name,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Approve store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reject a store registration
const rejectStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const user = await User.findById(storeId);
    if (!user) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    if (user.role !== 'store') {
      return res.status(400).json({ message: 'User is not a store owner' });
    }
    
    if (user.status !== 'pending') {
      return res.status(400).json({ message: 'Store is not pending approval' });
    }
    
    // Update status to inactive (rejected)
    await User.updateStatus(storeId, 'inactive');
    
    res.json({ 
      message: 'Store registration rejected',
      store: {
        id: user.id,
        name: user.name,
        email: user.email,
        storeName: user.store_name,
        status: 'inactive'
      }
    });
  } catch (error) {
    console.error('Reject store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add new user (admin only)
const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Check if email already exists
    const emailExists = await User.checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create user with active status
    const user = await User.create({
      name,
      email,
      password,
      address,
      role,
      status: 'active'
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        address: user.address,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all stores (admin only)
const getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json({ stores });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all reviews (admin only)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json({ reviews });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get statistics (admin only)
const getStats = async (req, res) => {
  try {
    const users = await User.findAll();
    const stores = await Store.findAll();
    const reviews = await Review.findAll();
    
    const totalUsers = users.length;
    const totalStores = stores.length;
    const totalRatings = reviews.length;
    
    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add store (admin only)
const addStore = async (req, res) => {
  try {
    const { storeName, description, address, phone, email, category, ownerId } = req.body;

    // Validate required fields
    if (!storeName || !address || !category || !ownerId) {
      return res.status(400).json({ message: 'Store name, address, category, and owner ID are required' });
    }

    // Check if owner exists
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Create store
    const store = await Store.create({
      owner_id: ownerId,
      store_name: storeName,
      description: description || '',
      address,
      phone: phone || '',
      email: email || '',
      image_url: 'https://res.cloudinary.com/dooljt6ah/image/upload/v1758524473/quantify-rating/defaults/default-store.jpg',
      category,
      rating: 0.00,
      total_reviews: 0,
      status: 'active'
    });

    res.status(201).json({
      message: 'Store created successfully',
      store: {
        id: store.id,
        store_name: store.store_name,
        description: store.description,
        address: store.address,
        phone: store.phone,
        email: store.email,
        category: store.category,
        status: store.status,
        createdAt: store.created_at
      }
    });
  } catch (error) {
    console.error('Add store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update store (admin only)
const updateStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { storeName, description, address, phone, email, category, status } = req.body;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Update store
    const updatedStore = await Store.update(storeId, {
      store_name: storeName,
      description: description || '',
      address,
      phone: phone || '',
      email: email || '',
      category,
      status: status || 'active'
    });

    res.json({
      message: 'Store updated successfully',
      store: updatedStore
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete store (admin only)
const deleteStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Delete store
    await Store.delete(storeId);

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, address, role, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    const updatedUser = await User.updateProfile(userId, {
      name,
      email,
      address,
      role,
      status
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await User.delete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPendingStores,
  approveStore,
  rejectStore,
  getAllUsers,
  addUser,
  getAllStores,
  getAllReviews,
  getStats,
  addStore,
  updateStore,
  deleteStore,
  updateUser,
  deleteUser
};

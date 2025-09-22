const User = require('../models/User');

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

module.exports = {
  getPendingStores,
  approveStore,
  rejectStore,
  getAllUsers,
  addUser
};

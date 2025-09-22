const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, address, role, storeName, phone } = req.body;

    // Check if email already exists
    const emailExists = await User.checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Set status based on role - store owners start as pending
    const userStatus = role === 'store' ? 'pending' : 'active';

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      address,
      role,
      status: userStatus,
      storeName,
      phone
    });

    // Generate token
    const token = generateToken(user.id);

    const message = role === 'store' 
      ? 'Store registration submitted successfully! Your account is pending admin approval. You will be notified once approved.'
      : 'User registered successfully';

    res.status(201).json({
      message,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        status: user.status,
        storeName: user.store_name,
        phone: user.phone,
        createdAt: user.created_at
      },
      token: role === 'store' ? null : token // Don't provide token for pending store owners
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (user.status !== 'active') {
      if (user.status === 'pending') {
        return res.status(401).json({ 
          message: 'Your store registration is pending admin approval. Please wait for approval before logging in.' 
        });
      }
      return res.status(401).json({ message: 'Account is not active' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        status: user.status,
        storeName: user.store_name,
        phone: user.phone,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Change password
    await User.changePassword(userId, currentPassword, newPassword);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    if (error.message === 'Current password is incorrect') {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address, storeName } = req.body;

    // Validate input
    if (!name && !email && !phone && !address && storeName === undefined) {
      return res.status(400).json({ message: 'At least one field must be provided for update' });
    }

    // Validate email format if provided
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate name length if provided
    if (name && (name.length < 2 || name.length > 60)) {
      return res.status(400).json({ message: 'Name must be between 2 and 60 characters' });
    }

    // Update profile
    const updatedUser = await User.updateProfile(userId, {
      name,
      email,
      phone,
      address,
      storeName
    });
    
    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.message === 'No fields to update') {
      return res.status(400).json({ message: 'No fields to update' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  updateProfile
};

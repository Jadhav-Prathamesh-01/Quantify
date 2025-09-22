const Store = require('../models/Store');
const { cloudinary, CLOUDINARY_ENABLED } = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const uploadSingle = upload.single('image');

const uploadImage = async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (!req.file) {
      // No image uploaded, use default
      if (CLOUDINARY_ENABLED) {
        // Use Cloudinary default image URL
        req.imageUrl = 'https://res.cloudinary.com/dooljt6ah/image/upload/v1758524473/quantify-rating/defaults/default-store.jpg';
      } else {
        // Use local default image
        req.imageUrl = '/default.jpg';
      }
      return next();
    }

    if (!CLOUDINARY_ENABLED) {
      // Cloudinary is disabled, use default image for now
      console.log('Cloudinary is disabled, using default image');
      req.imageUrl = '/default.jpg';
      return next();
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'quantify-rating/stores',
            transformation: [
              { width: 800, height: 600, crop: 'fill' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              // If Cloudinary fails, use default image
              resolve({ secure_url: '/default.jpg' });
            } else {
              resolve(result);
            }
          }
        ).end(req.file.buffer);
      });

      req.imageUrl = result.secure_url;
      next();
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      // If Cloudinary fails, use default image
      req.imageUrl = '/default.jpg';
      next();
    }
  });
};

const createStore = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { 
      storeName, 
      description, 
      address, 
      phone, 
      email, 
      category 
    } = req.body;

    // Validate required fields
    if (!storeName || !address) {
      return res.status(400).json({ 
        message: 'Store name and address are required' 
      });
    }

    // Check if user already has a store
    const existingStores = await Store.findByOwnerId(ownerId);
    if (existingStores.length > 0) {
      return res.status(400).json({ 
        message: 'You already have a store. You can only create one store per account.' 
      });
    }

    const storeData = {
      ownerId,
      storeName,
      description: description || '',
      address,
      phone: phone || '',
      email: email || '',
      imageUrl: req.imageUrl || '/default.jpg',
      category: category || 'General'
    };

    const store = await Store.create(storeData);
    
    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const stores = await Store.findByOwnerId(ownerId);
    
    res.json({ stores });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await Store.findById(storeId);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user owns this store
    if (store.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ store });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const ownerId = req.user.id;
    const { 
      storeName, 
      description, 
      address, 
      phone, 
      email, 
      category 
    } = req.body;

    // Check if store exists and user owns it
    const existingStore = await Store.findById(storeId);
    if (!existingStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    if (existingStore.owner_id !== ownerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = {
      storeName,
      description,
      address,
      phone,
      email,
      imageUrl: req.imageUrl, // Only update if new image was uploaded
      category
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const store = await Store.update(storeId, updateData);
    
    res.json({
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const ownerId = req.user.id;

    // Check if store exists and user owns it
    const existingStore = await Store.findById(storeId);
    if (!existingStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    if (existingStore.owner_id !== ownerId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Store.delete(storeId);
    
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
  uploadImage
};

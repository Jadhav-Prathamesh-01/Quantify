import { useState } from 'react';

interface StoreForm {
  storeName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  category: string;
  image: File | null;
}

interface AddStoreProps {
  onStoreCreated?: () => void;
  onCancel?: () => void;
}

export function AddStore({ onStoreCreated, onCancel }: AddStoreProps) {
  const [form, setForm] = useState<StoreForm>({
    storeName: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    category: 'General',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof StoreForm, value: string | File | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setMessage({ type: 'error', text: 'Please log in to access this feature.' });
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const user = JSON.parse(userData);
      if (user.role !== 'store') {
        setMessage({ type: 'error', text: 'Access denied. This feature is only available for store owners.' });
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/profile';
        }, 2000);
        return;
      }

      const formData = new FormData();
      formData.append('storeName', form.storeName);
      formData.append('description', form.description);
      formData.append('address', form.address);
      formData.append('phone', form.phone);
      formData.append('email', form.email);
      formData.append('category', form.category);
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await fetch('http://localhost:3001/api/stores', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });


      if (response.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Store created successfully!' });
        setForm({
          storeName: '',
          description: '',
          address: '',
          phone: '',
          email: '',
          category: 'General',
          image: null
        });
        setImagePreview(null);
        
        if (onStoreCreated) {
          onStoreCreated();
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create store' });
      }
    } catch (error) {
      console.error('Create store error:', error);
      setMessage({ type: 'error', text: 'Failed to create store. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Your Store</h1>
              <p className="mt-2 text-gray-600">Create your store profile to start getting reviews</p>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Image
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <img
                      className="w-32 h-32 rounded-lg object-cover border border-gray-300"
                      src={imagePreview}
                      alt="Store preview"
                    />
                  ) : (
                    <img
                      className="w-32 h-32 rounded-lg object-cover border border-gray-300"
                      src="/default.jpg"
                      alt="Default store image"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a store image (optional). If not provided, a default store image will be used.
                  </p>
                </div>
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Enter your store name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Describe your store, what you sell, your specialties..."
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                required
                value={form.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="Enter your store address"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Enter store email"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="General">General</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Retail">Retail</option>
                <option value="Services">Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Store...' : 'Create Store'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStore;

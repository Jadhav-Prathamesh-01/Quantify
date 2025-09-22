import { useState, useEffect } from 'react';

interface Store {
  id: number;
  store_name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  image_url: string;
  category: string;
  rating: number | string | null;
  total_reviews: number | null;
  status: string;
  created_at: string;
}

interface EditStoreProps {
  store: Store;
  onSave: (updatedStore: Store) => void;
  onCancel: () => void;
}

export function EditStore({ store, onSave, onCancel }: EditStoreProps) {
  const [formData, setFormData] = useState({
    store_name: store.store_name,
    description: store.description || '',
    address: store.address,
    phone: store.phone || '',
    email: store.email || '',
    category: store.category || 'General'
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.store_name.trim() || !formData.address.trim()) {
      setMessage({ type: 'error', text: 'Store name and address are required' });
      return;
    }

    const updatedStore: Store = {
      ...store,
      ...formData
    };

    onSave(updatedStore);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Store</h1>
              <p className="mt-2 text-gray-600">Update your store information</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
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

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Name */}
              <div className="md:col-span-2">
                <label htmlFor="store_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  id="store_name"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="General">General</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Retail">Retail</option>
                  <option value="Services">Services</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health & Beauty">Health & Beauty</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStore;

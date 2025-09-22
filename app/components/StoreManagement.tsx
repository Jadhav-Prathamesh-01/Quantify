import { useState, useEffect } from 'react';
import { AddStore } from './AddStore';
import { EditStore } from './EditStore';
import { API_ENDPOINTS } from '../config/api';

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

interface Review {
  id: number;
  user_id: number;
  store_id: number;
  rating: number;
  review_text: string;
  created_at: string;
  user_name: string;
  user_email: string;
}

export function StoreManagement() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStore, setShowAddStore] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [storeReviews, setStoreReviews] = useState<{ [storeId: number]: Review[] }>({});
  const [loadingReviews, setLoadingReviews] = useState<{ [storeId: number]: boolean }>({});

  // Helper function to safely get rating as number
  const getRating = (rating: number | string | null): number => {
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') {
      const parsed = parseFloat(rating);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      fetchStores();
    }
  }, []);

  // Auto-load reviews when stores are loaded
  useEffect(() => {
    if (stores.length > 0) {
      console.log('Stores loaded, checking image URLs:');
      stores.forEach(store => {
        console.log(`Store ${store.id} (${store.store_name}): image_url = "${store.image_url}"`);
        fetchStoreReviews(store.id);
      });
    }
  }, [stores]);

  const fetchStores = async () => {
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

      const response = await fetch(API_ENDPOINTS.STORES, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
        setLoading(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        console.log('Fetched stores data:', data);
        setStores(data.stores || []);
      } else {
        console.error('Failed to fetch stores:', data);
        setMessage({ type: 'error', text: data.message || 'Failed to fetch stores' });
      }
    } catch (error) {
      console.error('Fetch stores error:', error);
      setMessage({ type: 'error', text: 'Failed to fetch stores. Please check if the server is running.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStoreCreated = () => {
    setShowAddStore(false);
    fetchStores();
    setMessage({ type: 'success', text: 'Store created successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchStoreReviews = async (storeId: number) => {
    try {
      setLoadingReviews(prev => ({ ...prev, [storeId]: true }));
      const response = await fetch(API_ENDPOINTS.REVIEWS_BY_STORE(storeId));
      const data = await response.json();
      
      if (response.ok) {
        console.log(`Reviews for store ${storeId}:`, data.reviews);
        setStoreReviews(prev => ({ ...prev, [storeId]: data.reviews || [] }));
      } else {
        console.error('Failed to fetch reviews:', data.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(prev => ({ ...prev, [storeId]: false }));
    }
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
  };

  const handleSaveEdit = async (updatedStore: Store) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.STORE_BY_ID(updatedStore.id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storeName: updatedStore.store_name,
          description: updatedStore.description,
          address: updatedStore.address,
          phone: updatedStore.phone,
          email: updatedStore.email,
          category: updatedStore.category
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Store updated successfully!' });
        setEditingStore(null);
        fetchStores();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update store' });
      }
    } catch (error) {
      console.error('Error updating store:', error);
      setMessage({ type: 'error', text: 'Failed to update store' });
    }
  };

  const handleCancelEdit = () => {
    setEditingStore(null);
  };

  if (showAddStore) {
    return <AddStore onStoreCreated={handleStoreCreated} onCancel={() => setShowAddStore(false)} />;
  }

  if (editingStore) {
    return (
      <EditStore 
        store={editingStore} 
        onSave={handleSaveEdit} 
        onCancel={handleCancelEdit} 
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Stores</h1>
              <p className="mt-2 text-gray-600">Manage your store profiles and information</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Home Button */}
              <a
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </a>
              {/* Only show Add New Store button if no stores exist */}
              {stores.length === 0 && (
                <button
                  onClick={() => setShowAddStore(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Store
                </button>
              )}
            </div>
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

        {/* Stores List */}
        {stores.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stores yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first store.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddStore(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Store
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Store Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Store Image */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {(() => {
                          const imageUrl = store.image_url || '/default.jpg';
                          console.log(`Rendering image for store ${store.id}:`, {
                            storeName: store.store_name,
                            imageUrl: imageUrl,
                            isCloudinary: imageUrl.includes('cloudinary.com'),
                            isDefault: imageUrl.includes('default')
                          });
                          
                          // Test if the image URL is accessible
                          if (imageUrl.includes('cloudinary.com')) {
                            fetch(imageUrl, { mode: 'no-cors' })
                              .then(() => console.log(`✅ Cloudinary image accessible via fetch for store ${store.id}`))
                              .catch(err => console.error(`❌ Cloudinary image fetch failed for store ${store.id}:`, err));
                          }
                          
                          return (
                            <img
                              src={imageUrl}
                              alt={store.store_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(`❌ Image failed to load for store ${store.id}:`, {
                                  attemptedUrl: imageUrl,
                                  error: e,
                                  target: e.currentTarget,
                                  naturalWidth: e.currentTarget.naturalWidth,
                                  naturalHeight: e.currentTarget.naturalHeight,
                                  complete: e.currentTarget.complete
                                });
                                console.error('Image error - switching to default');
                                e.currentTarget.src = '/default.jpg';
                              }}
                              onLoad={() => {
                                console.log(`✅ Successfully loaded image for store ${store.id}:`, imageUrl);
                              }}
                            />
                          );
                        })()}
                      </div>
                      
                      {/* Store Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{store.store_name}</h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            store.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : store.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {store.status}
                          </span>
                        </div>
                        
                        <p className="text-lg text-gray-600 mb-2">{store.category}</p>
                        
                        {store.description && (
                          <p className="text-gray-700 mb-4">{store.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Address:</span> {store.address}
                          </div>
                          {store.phone && (
                            <div>
                              <span className="font-medium">Phone:</span> {store.phone}
                            </div>
                          )}
                          {store.email && (
                            <div>
                              <span className="font-medium">Email:</span> {store.email}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Created:</span> {new Date(store.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                          <svg className="w-5 h-5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-lg font-medium text-gray-900">
                            {getRating(store.rating).toFixed(1)} 
                            <span className="text-sm text-gray-500 ml-1">({store.total_reviews || 0} reviews)</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditStore(store)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Store
                    </button>
                  </div>
                </div>
                
                {/* Reviews Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Customer Reviews</h4>
                    <button
                      onClick={() => fetchStoreReviews(store.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {loadingReviews[store.id] ? 'Loading...' : 'Refresh Reviews'}
                    </button>
                  </div>
                  
                  {loadingReviews[store.id] ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p>Loading reviews...</p>
                    </div>
                  ) : storeReviews[store.id] && storeReviews[store.id].length > 0 ? (
                    <div className="space-y-4">
                      {storeReviews[store.id].map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="font-medium text-gray-900">{review.user_name}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {review.review_text && (
                            <p className="text-gray-700">{review.review_text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>No reviews yet for this store.</p>
                      <p className="text-sm mt-2">Encourage customers to leave reviews!</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreManagement;

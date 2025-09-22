// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://quantify-rating.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/change-password`,
  
  // Store endpoints
  STORES: `${API_BASE_URL}/api/stores`,
  STORE_BY_ID: (id: number) => `${API_BASE_URL}/api/stores/${id}`,
  
  // Review endpoints
  REVIEWS_STORES: `${API_BASE_URL}/api/reviews/stores`,
  REVIEWS_MY_REVIEWS: `${API_BASE_URL}/api/reviews/my-reviews`,
  REVIEWS_SUBMIT: `${API_BASE_URL}/api/reviews/submit`,
  REVIEWS_BY_STORE: (storeId: number) => `${API_BASE_URL}/api/reviews/store/${storeId}`,
  REVIEWS_BY_ID: (reviewId: number) => `${API_BASE_URL}/api/reviews/${reviewId}`,
  
  // Admin endpoints
  ADMIN_PENDING_STORES: `${API_BASE_URL}/api/admin/pending-stores`,
  ADMIN_ALL_USERS: `${API_BASE_URL}/api/admin/all-users`,
  ADMIN_ALL_STORES: `${API_BASE_URL}/api/admin/all-stores`,
  ADMIN_ALL_REVIEWS: `${API_BASE_URL}/api/admin/all-reviews`,
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  ADMIN_ADD_USER: `${API_BASE_URL}/api/admin/add-user`,
  ADMIN_APPROVE_STORE: (storeId: number) => `${API_BASE_URL}/api/admin/approve-store/${storeId}`,
  ADMIN_REJECT_STORE: (storeId: number) => `${API_BASE_URL}/api/admin/reject-store/${storeId}`,
  ADMIN_ADD_STORE: `${API_BASE_URL}/api/admin/add-store`,
  ADMIN_UPDATE_USER: (userId: number) => `${API_BASE_URL}/api/admin/update-user/${userId}`,
  ADMIN_DELETE_USER: (userId: number) => `${API_BASE_URL}/api/admin/delete-user/${userId}`,
  ADMIN_UPDATE_STORE: (storeId: number) => `${API_BASE_URL}/api/admin/update-store/${storeId}`,
  ADMIN_DELETE_STORE: (storeId: number) => `${API_BASE_URL}/api/admin/delete-store/${storeId}`,
};

export default API_BASE_URL;

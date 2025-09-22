import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import type { Route } from "./+types/login";

export function meta() {
  return [
    { title: "Login & Register - Quantify Rating" },
    { name: "description", content: "Login or register for your Quantify Rating account" },
  ];
}

export default function Login() {
  const [animationData, setAnimationData] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Load the Lottie animation
    fetch('/animations/login.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (activeTab === 'register') {
      // Name validation
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 20 || formData.name.length > 60) {
        newErrors.name = 'Name must be between 20 and 60 characters';
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
      }

      // Confirm Password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Address validation
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      } else if (formData.address.length > 400) {
        newErrors.address = 'Address must not exceed 400 characters';
      }

      // Store name validation (for business owners)
      if (userType === 'store' && !formData.storeName.trim()) {
        newErrors.storeName = 'Store name is required';
      }

      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    } else {
      // Login validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = activeTab === 'login' ? 'http://localhost:3001/api/login' : 'http://localhost:3001/api/register';
      const payload = {
        ...formData,
        role: userType,
        status: 'active'
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (activeTab === 'login') {
          // Store user data and token, then redirect to profile
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          window.location.href = '/profile';
        } else {
          // Handle registration response
          if (data.user.role === 'store' && data.user.status === 'pending') {
            alert('Store registration submitted successfully! Your account is pending admin approval. You will be notified once approved.');
          } else {
            alert('Registration successful! Please login.');
          }
          setActiveTab('login');
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            storeName: '',
            phone: '',
            address: ''
          });
        }
      } else {
        alert(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left side - Animation */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
            {animationData && (
              <div className="w-full h-96 lg:h-[500px]">
                <Lottie
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )}
          </div>
          
          {/* Title below animation */}
          <div className="text-center mt-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to Quantify Rating
            </h1>
          </div>
        </div>

        {/* Right side - Forms */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Tab Navigation */}
          <div className="flex mb-8 bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-xl transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-xl transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </span>
            </button>
          </div>

          {/* User Type Selection (only for register) */}
          {activeTab === 'register' && (
            <div className="mb-6">
              <label htmlFor="userType" className="block text-sm font-semibold text-gray-800 mb-2">
                Account Type
              </label>
              <select
                id="userType"
                name="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 bg-white/80 backdrop-blur-sm"
              >
                <option value="user">Individual User - Rate and review products</option>
                <option value="store">Business Owner - Manage your business</option>
              </select>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                  {userType === 'store' ? 'Owner Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder={userType === 'store' ? 'Enter owner name' : 'Enter your full name'}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            {activeTab === 'register' && userType === 'store' && (
              <div>
                <label htmlFor="storeName" className="block text-sm font-semibold text-gray-800 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm ${
                    errors.storeName ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter store name"
                />
                {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {activeTab === 'register' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            )}

            {activeTab === 'register' && (
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-800 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm resize-none ${
                    errors.address ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your full address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {activeTab === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg shadow-md"
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {activeTab === 'login' ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create Account
                      </>
                    )}
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
              >
                {activeTab === 'login' ? 'Create one here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import IconifyIcon from '@/components/client-wrapper/IconifyIcon';
import PageMeta from '@/components/PageMeta';
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { login } from '@/service/serviceApi';

const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Clear any existing data when component mounts
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await login({
        email,
        password
      });

      // Handle successful login
      const { data } = response;

      // Store token and user data in localStorage
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
      }

      // Show success message
      toast.success(data.message || 'Login berhasil! Selamat datang kembali.', {
        position: "top-center",
        autoClose: 2000,
      });

      // Redirect to message page
      setTimeout(() => {
        navigate('/message');
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        switch (status) {
          case 400:
            toast.error(data.message || 'Email atau password tidak valid');
            break;
          case 401:
            toast.error('Email atau password salah');
            break;
          case 403:
            toast.error('Akun Anda tidak aktif. Silakan hubungi administrator');
            break;
          case 404:
            toast.error('User tidak ditemukan');
            break;
          case 422:
            // Validation errors
            if (data.errors) {
              const newErrors = {};
              data.errors.forEach(err => {
                newErrors[err.field] = err.message;
              });
              setErrors(newErrors);
            }
            toast.error(data.message || 'Data tidak valid');
            break;
          case 429:
            toast.error('Terlalu banyak percobaan login. Silakan coba lagi nanti');
            break;
          case 500:
            toast.error(data.message || 'Server error. Silakan coba lagi nanti');
            break;
          default:
            toast.error(data.message || 'Terjadi kesalahan. Silakan coba lagi');
        }
      } else if (error.request) {
        // Network error
        toast.error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda');
      } else {
        // Other errors
        toast.error('Terjadi kesalahan yang tidak terduga');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email diperlukan';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password diperlukan';
    } else if (password.length < 3) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear specific field error when user starts typing
  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  return <>
    <PageMeta title="Login" />
    <div className="relative min-h-screen w-full flex justify-center items-center px-4 py-10 md:py-16 bg-white dark:bg-gray-900">

      {/* Main Card */}
      <div className="card w-full max-w-md md:max-w-lg z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="text-center px-6 py-8 sm:px-10 sm:py-12">
          {/* Logo */}
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <Link to="/login" className="flex justify-center">
              <img src={logoDark} alt="logo dark" className="w-20 h-20 flex dark:hidden drop-shadow-lg" />
              <img src={logoLight} alt="logo light" className="w-20 h-20 hidden dark:flex drop-shadow-lg" />
            </Link>
          </div>

          {/* Welcome Text */}
          <div className="mb-8 fade-in-up">
            <h4 className="mb-2 text-2xl sm:text-3xl font-bold gradient-text">
              Selamat Datang!
            </h4>
            <h3 className='mb-2'>
              Bisikberbisik
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="text-left w-full space-y-5">
            {/* Email Field */}
            <div className="group fade-in-up">
              <label htmlFor="email" className="block font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2 transition-colors group-focus-within:text-blue-600">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconifyIcon icon="heroicons:envelope" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-200 group-focus-within:scale-110" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  onKeyPress={handleKeyPress}
                  className={`form-input h-12 pl-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 hover:shadow-sm ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                  placeholder="Masukkan email Anda"
                  disabled={isLoading}
                />
                {email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <IconifyIcon icon="heroicons:check-circle" className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center animate-pulse">
                  <IconifyIcon icon="heroicons:exclamation-triangle" className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="group fade-in-up">
              <label htmlFor="password" className="block font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2 transition-colors group-focus-within:text-blue-600">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconifyIcon icon="heroicons:lock-closed" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-200 group-focus-within:scale-110" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  onKeyPress={handleKeyPress}
                  className={`form-input h-12 pl-10 pr-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 hover:shadow-sm ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                  placeholder="Masukkan password Anda"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-500 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconifyIcon
                    icon={showPassword ? "heroicons:eye-slash" : "heroicons:eye"}
                    className="h-5 w-5 text-gray-400"
                  />
                </button>
                {password && !errors.password && (
                  <div className="absolute inset-y-0 right-8 flex items-center">
                    <IconifyIcon icon="heroicons:check-circle" className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center animate-pulse">
                  <IconifyIcon icon="heroicons:exclamation-triangle" className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>


            {/* Submit Button */}
            <div className="pt-2 fade-in-up">
              <button
                type="submit"
                disabled={isLoading}
                className="btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full h-12 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none glow-animation"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <IconifyIcon icon="heroicons:arrow-right-on-rectangle" className="w-5 h-5 mr-2" />
                    Masuk
                  </div>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

    </div>
  </>;
};
export default Index;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { sendMessage, getMessageStats, getConfiguration, getUsers } from '@/service/serviceApi';
import Leaderboard from '@/components/Leaderboard';

const Activities = () => {
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(null);
  const [showNickname, setShowNickname] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    total_private: 0,
    total_public: 0
  });

  // Configuration state - loaded from API
  const [configurations, setConfigurations] = useState({});
  const [configLoading, setConfigLoading] = useState(true);

  // Users state - loaded from API
  const [recipients, setRecipients] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false); // default public
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Data pengguna tidak valid. Silakan login kembali.');
      navigate('/login');
    }

    // Load configurations from API
    const loadConfigurations = async () => {
      try {
        setConfigLoading(true);
        const response = await getConfiguration();
        console.log(response);
        if (response?.data?.success) {
          const configs = {};
          response?.data?.data?.forEach(config => {
            configs[config.code] = config.is_active;
          });
          setConfigurations(configs);
          console.log(configs);
        }
      } catch (error) {
        console.error('Error loading configurations:', error);
        toast.error('Gagal memuat konfigurasi sistem');
      } finally {
        setConfigLoading(false);
      }
    };

    // Load message stats
    const loadStats = async () => {
      try {
        const response = await getMessageStats();
        if (response?.data?.success) {
          setStats(response?.data?.data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    // Load users from API
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await getUsers();
        if (response?.data?.success) {
          setRecipients(response?.data?.data);
        } else {
          toast.error(response?.data?.message || 'Gagal memuat daftar pengguna');
        }
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Gagal memuat daftar pengguna');
      } finally {
        setUsersLoading(false);
      }
    };

    loadConfigurations();
    loadStats();
    loadUsers();
  }, [navigate]);

  const maxChars = 240;
  const remaining = maxChars - message.length;

  // Transform recipients for react-select
  const recipientOptions = recipients.map(recipient => ({
    value: recipient.id,
    label: recipient.name,
    ...recipient
  }));

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!selectedRecipient) {
      newErrors.recipient = 'Pilih penerima pesan';
    } else if (selectedRecipient.value === user?.id) {
      newErrors.recipient = 'Tidak bisa mengirim pesan ke diri sendiri';
    }

    if (!message.trim()) {
      newErrors.message = 'Pesan tidak boleh kosong';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = () => {
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSend = async () => {
    try {
      // Double-check validation before sending
      if (selectedRecipient?.value === user?.id) {
        toast.error('Tidak bisa mengirim pesan ke diri sendiri');
        setShowConfirmModal(false);
        return;
      }

      setIsSending(true);

      // Prepare data for API
      const messageData = {
        recipient_to: selectedRecipient?.value,
        is_private: isPrivate,
        message: message.trim()
      };

      // Show loading state
      setShowConfirmModal(false);

      // Call API to send message
      const response = await sendMessage(messageData);

      // Success handling
      toast.success(response?.data?.message || 'Pesan berhasil dikirim!');

      // Reset form
      setMessage('');
      setSelectedRecipient(null);
      setErrors({});

      // Reload stats and configuration after sending message
      try {
        // Reload stats
        const statsResponse = await getMessageStats();
        if (statsResponse?.data?.success) {
          setStats(statsResponse?.data?.data);
        }

        // Reload configuration
        const configResponse = await getConfiguration();
        if (configResponse?.data?.success) {
          const configs = {};
          configResponse?.data?.data?.forEach(config => {
            configs[config.code] = config.is_active;
          });
          setConfigurations(configs);
        }
      } catch (error) {
        console.error('Error reloading stats and configuration:', error);
      }

    } catch (error) {
      console.error('Send message error:', error);

      // Error handling is already done in the service interceptor
      // But we can add specific handling here if needed
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const newErrors = {};
        error?.response?.data?.errors?.forEach(err => {
          newErrors[err.field] = err.message;
        });
        setErrors(newErrors);
      }

      // Reopen modal for user to retry
      setShowConfirmModal(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelSend = () => {
    setShowConfirmModal(false);
  };

  const handleRecipientChange = (selectedOption) => {
    setSelectedRecipient(selectedOption);

    // Clear previous errors
    if (errors.recipient) {
      setErrors(prev => ({ ...prev, recipient: '' }));
    }

    // Check if user is trying to send message to themselves
    if (selectedOption && selectedOption.value === user?.id) {
      setErrors(prev => ({
        ...prev,
        recipient: 'Tidak bisa mengirim pesan ke diri sendiri'
      }));
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    // Clear message error when typing
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: '' }));
    }
  };

  return <div className="mb-5 space-y-5">
    {/* Welcome Message */}
    {user && (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 sm:p-6 mb-6 border border-blue-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Selamat Datang! 🎉
            </h2>
            <div className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold text-blue-600 dark:text-blue-400">Hi {user?.name}</span>
              </p>
              {showNickname && (
                <p className="mt-1">
                  Nickname kamu adalah <span className="font-bold text-purple-600 dark:text-purple-400">"{user?.nickname}"</span>
                </p>
              )}
            </div>
          </div>

          {/* Toggle Nickname Button */}
          <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-2">
            <span className="text-xs sm:text-xs text-gray-600 dark:text-gray-400 font-medium order-2 sm:order-2">
              {showNickname ? 'Sembunyikan' : 'Tampilkan'} Nickname
            </span>
            <button
              onClick={() => setShowNickname(!showNickname)}
              className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 order-1 sm:order-1 ${showNickname ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              aria-pressed={showNickname}
            >
              <span
                className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-200 ${showNickname ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Message Statistics */}
    {user && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pesan Rahasia untuk mu!</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.total_private || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pesan Public</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats?.total_public || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Conditional Action Buttons */}
    {!configLoading && (configurations.SHOW_INDIVIDUAL_MESSAGE || configurations.SHOW_ALL_MESSAGE) && (
      <div className="flex flex-wrap gap-4 justify-between">
        {configurations.SHOW_INDIVIDUAL_MESSAGE && (
          <button
            onClick={() => navigate('/message/list-personal')}
            className="btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 flex-1 min-w-0 py-4 px-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Lihat Pesan Yang Ditujukan untuk Mu</span>
            <span className="sm:hidden">Pesan Personal</span>
          </button>
        )}
        {configurations.SHOW_ALL_MESSAGE && (
          <button
            onClick={() => navigate('/message/list')}
            className="btn bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all duration-300 flex-1 min-w-0 py-4 px-6 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="hidden sm:inline">Lihat Semua Pesan Teman-teman Mu</span>
            <span className="sm:hidden">Semua Pesan</span>
          </button>
        )}
      </div>
    )}


    {/* Message Sending Section - Conditional based on SEND_MESSAGE setting */}
    {!configLoading && configurations.SEND_MESSAGE ? (
      <div>
        <div className="card">
          <div className="card-body">
            <h5 className="mb-2 text-lg md:text-xl text-default-800 font-semibold">Tulis Pesan</h5>
            <p className="mb-5 text-sm md:text-base text-default-600">Hai! Sudah kasih pesan ke teman-teman hari ini? Yuk, bagikan cerita atau kata-kata motivasi!</p>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label htmlFor="recipient" className="block mb-2 text-xs sm:text-sm font-medium text-default-900">Pilih Teman</label>
                <Select
                  id="recipient"
                  value={selectedRecipient}
                  onChange={handleRecipientChange}
                  options={recipientOptions}
                  placeholder={usersLoading ? "Memuat daftar pengguna..." : "Cari nama teman..."}
                  isSearchable
                  isClearable
                  isLoading={usersLoading}
                  isDisabled={usersLoading || isSending}
                  className={`react-select-container ${errors.recipient ? 'react-select-error' : ''}`}
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      minHeight: '44px',
                      borderColor: errors.recipient ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                      '&:hover': {
                        borderColor: errors.recipient ? '#ef4444' : '#9ca3af'
                      }
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected
                        ? '#3b82f6'
                        : state.isFocused
                          ? '#f3f4f6'
                          : 'white',
                      color: state.isSelected ? 'white' : '#374151'
                    })
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#3b82f6',
                      primary75: '#60a5fa',
                      primary50: '#93c5fd',
                      primary25: '#dbeafe'
                    }
                  })}
                />
                {errors.recipient && (
                  <p className="mt-1 text-xs text-danger">{errors.recipient}</p>
                )}
                {!usersLoading && recipients.length === 0 && (
                  <p className="mt-1 text-xs text-warning">Tidak ada pengguna tersedia</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-xs sm:text-sm font-medium text-default-900">Tipe Pesan</label>
                <div className="flex items-center justify-between rounded-lg border border-default-200 p-3">
                  <div>
                    <p className="font-medium text-default-900 text-sm">{isPrivate ? 'Rahasia' : 'Terbuka'}</p>
                    <p className="text-xs text-default-600">
                      {isPrivate
                        ? 'Hanya kalian berdua yang bisa baca pesan ini'
                        : 'Semua orang bisa lihat dan baca pesan ini'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(v => !v)}
                    className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-colors duration-200 ${isPrivate ? 'bg-primary' : 'bg-default-300'}`}
                    aria-pressed={isPrivate}
                  >
                    <span className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-200 ${isPrivate ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`}></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="block mb-2 text-xs sm:text-sm font-medium text-default-900">Tulis Pesanmu</label>
              <textarea
                id="message"
                rows={4}
                className={`form-input w-full resize-y min-h-[120px] md:min-h-[160px] text-sm bg-white dark:bg-default-800 border-default-200 dark:border-default-600 text-default-900 dark:text-white focus:border-primary focus:ring-primary/20 ${errors.message ? 'border-danger' : ''}`}
                placeholder={selectedRecipient ? `Hai ${selectedRecipient.name}! Apa kabar? Tulis pesan keren di sini...` : 'Pilih teman dulu, lalu tulis pesan keren di sini...'}
                value={message}
                maxLength={maxChars}
                onChange={handleMessageChange}
              />
              <div className="mt-1 flex items-center justify-between text-[11px] sm:text-xs">
                <span className={remaining < 0 ? 'text-danger' : 'text-default-500'}>{remaining} karakter tersisa</span>
                <span className="text-default-400">{message.length}/{maxChars}</span>
              </div>
              {errors.message && (
                <p className="mt-1 text-xs text-danger">{errors.message}</p>
              )}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="btn bg-primary text-white disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isSending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengirim...
                  </div>
                ) : (
                  'Kirim Sekarang'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessage('');
                  setSelectedRecipient(null);
                  setErrors({});
                }}
                disabled={isSending}
                className="btn bg-default-200 text-default-900 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Hapus Semua
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <div className="card">
          <div className="card-body text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-default-200 dark:bg-default-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-default-500 dark:text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h5 className="text-lg font-semibold text-default-800 dark:text-white mb-2">Fitur Pengiriman Pesan Dinonaktifkan</h5>
            <p className="text-default-600 dark:text-default-400 mb-4">
              Fitur pengiriman pesan telah di non aktifkan. Hubungi admin untuk membukanya yah..
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Confirmation Modal */}
    {showConfirmModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
        <div className="card w-full max-w-md animate-in zoom-in-95 duration-200 shadow-2xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-default-800 dark:text-white">Konfirmasi Pengiriman</h5>
                <p className="text-sm text-default-600 dark:text-default-400">Cek dulu pesanmu sebelum kirim, ya!</p>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
              <p className="text-sm text-default-700 dark:text-default-300 leading-relaxed">
                <span className="font-medium">Kamu akan kirim pesan ini ke </span>
                <span className={`font-semibold ${selectedRecipient?.value === user?.id ? 'text-red-600 dark:text-red-400' : 'text-primary'}`}>
                  {selectedRecipient?.label}
                </span>
                <span className="font-medium"> dengan tipe </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isPrivate ? 'bg-default-900 text-white dark:bg-default-700' : 'bg-primary text-white'}`}>
                  {isPrivate ? 'Rahasia' : 'Terbuka'}
                </span>
                <span className="font-medium">. {isPrivate ? 'Hanya kalian berdua yang bisa baca!' : 'Semua orang bisa lihat pesan ini!'}</span>
              </p>
              {selectedRecipient?.value === user?.id && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-medium">Peringatan:</span>
                    <span>Anda tidak bisa mengirim pesan ke diri sendiri!</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-default-50 dark:bg-default-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-default-600 dark:text-default-400">Penerima:</span>
                </div>
                <span className="font-medium text-default-800 dark:text-white">{selectedRecipient?.label}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-default-50 dark:bg-default-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-default-200 dark:bg-default-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-default-600 dark:text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-default-600 dark:text-default-400">Tipe Pesan:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPrivate ? 'bg-default-900 text-white dark:bg-default-700' : 'bg-primary/10 text-primary dark:bg-primary/20'}`}>
                    {isPrivate ? 'Private' : 'Public'}
                  </span>
                  <span className="text-xs text-default-500 dark:text-default-400">
                    {isPrivate ? '🔒 Rahasia' : '🌐 Terbuka'}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-default-200 dark:bg-default-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-default-600 dark:text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-sm text-default-600 dark:text-default-400 font-medium">Isi Pesan:</span>
                </div>
                <div className="rounded-lg border border-default-200 dark:border-default-600 p-4 bg-white dark:bg-default-800">
                  <p className="text-sm text-default-700 dark:text-default-300 whitespace-pre-wrap leading-relaxed">{message}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelSend}
                className="btn bg-default-200 text-default-900 dark:bg-default-700 dark:text-white flex-1 hover:bg-default-300 dark:hover:bg-default-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                disabled={isSending || selectedRecipient?.value === user?.id}
                className="btn bg-primary text-white flex-1 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengirim...
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Kirim Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>;
};
export default Activities;
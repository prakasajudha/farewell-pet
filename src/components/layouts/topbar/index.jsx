import ArabianFlag from '@/assets/images/flags/arebian.svg';
import FrenchFlag from '@/assets/images/flags/french.jpg';
import GermanyFlag from '@/assets/images/flags/germany.jpg';
import ItalyFlag from '@/assets/images/flags/italy.jpg';
import JapaneseFlag from '@/assets/images/flags/japanese.svg';
import RussiaFlag from '@/assets/images/flags/russia.jpg';
import SpainFlag from '@/assets/images/flags/spain.jpg';
import UsFlag from '@/assets/images/flags/us.jpg';
import avatar1 from '@/assets/images/user/avatar-1.png';
import avatar3 from '@/assets/images/user/avatar-3.png';
import avatar5 from '@/assets/images/user/avatar-5.png';
import avatar7 from '@/assets/images/user/avatar-7.png';
import { Link, useNavigate } from 'react-router';
import { TbSearch } from 'react-icons/tb';
import SimpleBar from 'simplebar-react';
import SidenavToggle from './SidenavToggle';
import ThemeModeToggle from './ThemeModeToggle';
import { LuBellRing, LuClock, LuGem, LuHeart, LuLogOut, LuMail, LuMessagesSquare, LuMoveRight, LuSettings, LuShoppingBag, LuKey } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { changePassword, logout } from '@/service/serviceApi';
const languages = [{
  src: UsFlag,
  label: 'English'
}, {
  src: SpainFlag,
  label: 'Spanish'
}, {
  src: GermanyFlag,
  label: 'German'
}, {
  src: FrenchFlag,
  label: 'French'
}, {
  src: JapaneseFlag,
  label: 'Japanese'
}, {
  src: ItalyFlag,
  label: 'Italian'
}, {
  src: RussiaFlag,
  label: 'Russian'
}, {
  src: ArabianFlag,
  label: 'Arabic'
}];
const tabs = [{
  id: 'tabsViewall',
  title: 'View all',
  active: true
}, {
  id: 'tabsMentions',
  title: 'Mentions'
}, {
  id: 'tabsFollowers',
  title: 'Followers'
}, {
  id: 'tabsInvites',
  title: 'Invites'
}];
const notifications = {
  tabsViewall: [{
    type: 'follow',
    avatar: avatar3,
    text: <>
      <b>@willie_passem</b> followed you
    </>,
    time: 'Wednesday 03:42 PM',
    ago: '4 sec'
  }, {
    type: 'comment',
    avatar: avatar5,
    text: <>
      <b>@caroline_jessica</b> commented <br />
      on your post
    </>,
    time: 'Wednesday 03:42 PM',
    ago: '15 min',
    comment: 'Amazing! Fast, to the point, professional and really amazing to work with them!!!'
  }, {
    type: 'purchase',
    icon: <LuShoppingBag className="size-5 text-danger" />,
    text: <>
      Successfully purchased a business plan for <span className="text-danger">$199.99</span>
    </>,
    time: 'Monday 11:26 AM',
    ago: 'yesterday'
  }, {
    type: 'like',
    avatar: avatar7,
    icon: <LuHeart className="size-3.5 fill-orange-500" />,
    text: <>
      <b>@scott</b> liked your post
    </>,
    time: 'Thursday 06:59 AM',
    ago: '1 Week'
  }],
  tabsMentions: [{
    type: 'comment',
    avatar: avatar5,
    text: <>
      <b>@caroline_jessica</b> commented <br />
      on your post
    </>,
    time: 'Wednesday 03:42 PM',
    ago: '15 min',
    comment: 'Amazing! Fast, to the point, professional and really amazing to work with them!!!'
  }, {
    type: 'like',
    avatar: avatar7,
    icon: <LuHeart className="size-3.5 fill-orange-500" />,
    text: <>
      <b>@scott</b> liked your post
    </>,
    time: 'Thursday 06:59 AM',
    ago: '1 Week'
  }],
  tabsFollowers: [{
    type: 'follow',
    avatar: avatar3,
    text: <>
      <b>@willie_passem</b> followed you
    </>,
    time: 'Wednesday 03:42 PM',
    ago: '4 sec'
  }],
  tabsInvites: [{
    type: 'purchase',
    icon: <LuShoppingBag className="size-5 text-danger" />,
    text: <>
      Successfully purchased a business plan for <span className="text-danger">$199.99</span>
    </>,
    time: 'Monday 11:26 AM',
    ago: 'yesterday'
  }]
};
const profileMenu = [{
  icon: <LuKey className="size-4" />,
  label: 'Change Password',
  action: 'changePassword'
}, {
  icon: <LuLogOut className="size-4" />,
  label: 'Sign Out'
}];
const Topbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [changePasswordErrors, setChangePasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleProfileMenuClick = (item) => {
    if (item.action === 'changePassword') {
      setShowChangePasswordModal(true);
    } else if (item.label === 'Sign Out') {
      handleLogout();
    }
  };

  const handleLogout = () => {
    try {
      logout();
      toast.success('Logout berhasil! Sampai jumpa lagi.');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout. Silakan coba lagi.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!changePasswordData.old_password) {
      errors.old_password = 'Password lama diperlukan';
    }
    if (!changePasswordData.new_password) {
      errors.new_password = 'Password baru diperlukan';
    } else if (changePasswordData.new_password.length < 6) {
      errors.new_password = 'Password baru minimal 6 karakter';
    }
    if (!changePasswordData.confirm_password) {
      errors.confirm_password = 'Konfirmasi password diperlukan';
    } else if (changePasswordData.new_password !== changePasswordData.confirm_password) {
      errors.confirm_password = 'Konfirmasi password tidak sama';
    }

    setChangePasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await changePassword({
        old_password: changePasswordData.old_password,
        new_password: changePasswordData.new_password
      });

      toast.success('Password berhasil diubah!');
      setShowChangePasswordModal(false);
      setChangePasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      setChangePasswordErrors({});

    } catch (error) {
      console.error('Change password error:', error);

      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            toast.error(data.message || 'Data tidak valid');
            break;
          case 401:
            toast.error('Password lama salah');
            break;
          case 403:
            toast.error('Akses ditolak');
            break;
          case 422:
            if (data.errors) {
              const newErrors = {};
              data.errors.forEach(err => {
                newErrors[err.field] = err.message;
              });
              setChangePasswordErrors(newErrors);
            }
            toast.error(data.message || 'Validasi gagal');
            break;
          default:
            toast.error(data.message || 'Terjadi kesalahan');
        }
      } else if (error.request) {
        toast.error('Tidak dapat terhubung ke server');
      } else {
        toast.error('Terjadi kesalahan yang tidak terduga');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleInputChange = (field, value) => {
    setChangePasswordData(prev => ({ ...prev, [field]: value }));
    if (changePasswordErrors[field]) {
      setChangePasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return <>
    <div className="app-header min-h-topbar-height flex items-center sticky top-0 z-30 bg-(--topbar-background) border-b border-default-200">
      <div className="w-full flex items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <SidenavToggle />

          <div className="lg:flex hidden items-center relative">
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeModeToggle />

          <div className="topbar-item hs-dropdown relative inline-flex">
            <button className="cursor-pointer bg-pink-100 rounded-full">
              <img src={avatar1} alt="user" className="hs-dropdown-toggle rounded-full size-9.5" />
            </button>
            <div className="hs-dropdown-menu min-w-48">
              <div className="p-2">
                <Link to="#!" className="flex gap-3">
                  <div className="relative inline-block">
                    <img src={avatar1} alt="user" className="size-12 rounded" />
                    <span className="-top-1 -end-1 absolute w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h6 className="mb-1 text-sm font-semibold text-default-800">
                      {user ? user.name : 'Loading...'}
                    </h6>
                    <p className="text-default-500">
                      {user ? (user.is_admin ? 'Administrator' : 'User') : 'Loading...'}
                    </p>
                    {user?.nickname && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        "{user.nickname}"
                      </p>
                    )}
                  </div>
                </Link>
              </div>

              <div className="border-t border-default-200 -mx-2 my-2"></div>

              <div className="flex flex-col gap-y-1">
                {profileMenu.map((item, i) =>
                  item.divider ?
                    <div key={i} className="border-t border-default-200 -mx-2 my-1"></div> :
                    item.action ?
                      <button
                        key={i}
                        onClick={() => handleProfileMenuClick(item)}
                        className="flex items-center gap-x-3.5 py-1.5 px-3 text-default-600 hover:bg-default-150 rounded font-medium w-full text-left"
                      >
                        {item.icon}
                        {item.label}
                        {item.badge && <span className="size-4.5 font-semibold bg-danger rounded text-white flex items-center justify-center text-xs">
                          {item.badge}
                        </span>}
                      </button> :
                      <Link key={i} to={item.to || '#!'} className="flex items-center gap-x-3.5 py-1.5 px-3 text-default-600 hover:bg-default-150 rounded font-medium">
                        {item.icon}
                        {item.label}
                        {item.badge && <span className="size-4.5 font-semibold bg-danger rounded text-white flex items-center justify-center text-xs">
                          {item.badge}
                        </span>}
                      </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Change Password Modal */}
    {showChangePasswordModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="card w-full max-w-md shadow-2xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <LuKey className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h5 className="text-lg font-semibold text-default-800 dark:text-white">Ubah Password</h5>
                <p className="text-sm text-default-600 dark:text-default-400">Masukkan password lama dan password baru</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Old Password */}
              <div>
                <label htmlFor="old_password" className="block text-sm font-medium text-default-900 dark:text-white mb-2">
                  Password Lama
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old_password ? "text" : "password"}
                    id="old_password"
                    value={changePasswordData.old_password}
                    onChange={(e) => handleInputChange('old_password', e.target.value)}
                    className={`form-input w-full h-11 pr-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${changePasswordErrors.old_password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    placeholder="Masukkan password lama"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old_password')}
                    disabled={isChangingPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPasswords.old_password ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {changePasswordErrors.old_password && (
                  <p className="mt-1 text-sm text-red-600">{changePasswordErrors.old_password}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-default-900 dark:text-white mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new_password ? "text" : "password"}
                    id="new_password"
                    value={changePasswordData.new_password}
                    onChange={(e) => handleInputChange('new_password', e.target.value)}
                    className={`form-input w-full h-11 pr-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${changePasswordErrors.new_password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    placeholder="Masukkan password baru"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new_password')}
                    disabled={isChangingPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPasswords.new_password ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {changePasswordErrors.new_password && (
                  <p className="mt-1 text-sm text-red-600">{changePasswordErrors.new_password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-default-900 dark:text-white mb-2">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm_password ? "text" : "password"}
                    id="confirm_password"
                    value={changePasswordData.confirm_password}
                    onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                    className={`form-input w-full h-11 pr-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${changePasswordErrors.confirm_password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    placeholder="Konfirmasi password baru"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm_password')}
                    disabled={isChangingPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPasswords.confirm_password ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {changePasswordErrors.confirm_password && (
                  <p className="mt-1 text-sm text-red-600">{changePasswordErrors.confirm_password}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setChangePasswordData({
                      old_password: '',
                      new_password: '',
                      confirm_password: ''
                    });
                    setChangePasswordErrors({});
                  }}
                  className="btn bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white flex-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  disabled={isChangingPassword}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn bg-blue-600 text-white flex-1 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengubah...
                    </div>
                  ) : (
                    'Ubah Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </>;
};
export default Topbar;
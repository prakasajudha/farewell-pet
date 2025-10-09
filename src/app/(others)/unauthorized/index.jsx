import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/message');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <PageMeta title="Unauthorized" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Akses Ditolak
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleGoBack}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            <i className="ri-arrow-left-line mr-2"></i>
                            Kembali ke Halaman Sebelumnya
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            <i className="ri-home-line mr-2"></i>
                            Kembali ke Dashboard
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            <i className="ri-logout-box-line mr-2"></i>
                            Logout
                        </button>
                    </div>

                    <div className="mt-8 text-xs text-gray-400 dark:text-gray-600">
                        <p>Error Code: 403 - Forbidden</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Unauthorized;

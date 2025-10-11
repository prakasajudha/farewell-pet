import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminSemiAdminRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAdminSemiAdminAuth = () => {
            try {
                // Check if token exists in localStorage
                const token = localStorage.getItem('token');

                if (!token) {
                    toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
                    navigate('/login', {
                        state: { from: location.pathname },
                        replace: true
                    });
                    return;
                }

                // Check if user data exists
                const userData = localStorage.getItem('user');
                if (!userData) {
                    toast.error('Data user tidak ditemukan. Silakan login kembali.');
                    navigate('/login', {
                        state: { from: location.pathname },
                        replace: true
                    });
                    return;
                }

                const user = JSON.parse(userData);

                // Check if user is admin or semi-admin
                if (!user.is_admin && !user.is_semi_admin) {
                    toast.error('Anda tidak memiliki izin untuk mengakses halaman ini.');
                    navigate('/unauthorized', {
                        state: { from: location.pathname },
                        replace: true
                    });
                    return;
                }

                // Check if token is expired (basic check)
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const currentTime = Date.now() / 1000;

                    if (payload.exp && payload.exp < currentTime) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        toast.error('Token telah expired. Silakan login kembali.');
                        navigate('/login', {
                            state: { from: location.pathname },
                            replace: true
                        });
                        return;
                    }
                } catch (error) {
                    console.error('Error parsing token:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    toast.error('Token tidak valid. Silakan login kembali.');
                    navigate('/login', {
                        state: { from: location.pathname },
                        replace: true
                    });
                    return;
                }

                // If all checks pass, allow access
                setIsChecking(false);

            } catch (error) {
                console.error('Admin/Semi-admin auth check error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                toast.error('Terjadi kesalahan autentikasi. Silakan login kembali.');
                navigate('/login', {
                    state: { from: location.pathname },
                    replace: true
                });
            }
        };

        checkAdminSemiAdminAuth();
    }, [navigate, location.pathname]);

    // Show loading while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memverifikasi izin admin/semi-admin...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminSemiAdminRoute;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import { getFavoriteMessages, toggleMessageFavorite } from '@/service/serviceApi';
import { toast } from 'react-toastify';

const MessageListFavorite = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Load user data
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // Check if user is admin or semi-admin
            if (!parsedUser.is_admin && !parsedUser.is_semi_admin) {
                toast.error('Hanya admin atau semi admin yang dapat mengakses halaman ini');
                navigate('/message');
                return;
            }
        } else {
            navigate('/login');
            return;
        }
    }, [navigate]);

    // Load favorite messages from API
    useEffect(() => {
        const loadFavoriteMessages = async () => {
            try {
                setLoading(true);
                const response = await getFavoriteMessages();
                if (response?.data?.success) {
                    setMessages(response?.data?.data);
                } else {
                    toast.error(response?.data?.message || 'Gagal memuat pesan favorit');
                }
            } catch (error) {
                console.error('Error loading favorite messages:', error);
                toast.error('Gagal memuat pesan favorit');
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_admin || user?.is_semi_admin) {
            loadFavoriteMessages();
        }
    }, [user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleToggleFavorite = async (messageId) => {
        try {
            const response = await toggleMessageFavorite(messageId);
            if (response?.data?.success) {
                // Remove the message from the list since it's no longer favorited
                setMessages(prevMessages =>
                    prevMessages.filter(msg => msg.id !== messageId)
                );
                toast.success(response.data.message || 'Pesan dihapus dari favorit');
            } else {
                toast.error(response?.data?.message || 'Gagal mengubah status favorit');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Gagal mengubah status favorit');
        }
    };

    if (loading) {
        return (
            <>
                <PageMeta title="Best Message" />
                <div className="container-fluid px-4 py-6">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Memuat pesan favorit...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageMeta title="Best Message" />
            <div className="container-fluid px-4 py-6">
                <div className="d-flex justify-content-end mb-4">
                    <button
                        className="btn bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        onClick={() => navigate('/message')}
                    >
                        <i className="ri-arrow-left-line me-2"></i>
                        Kembali
                    </button>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex p-6 justify-content-between align-items-center">
                                    <div>
                                        <h4 className="card-title mb-0">Best Message</h4>
                                        <p className="text-muted mb-0">Pesan-pesan terbaik yang telah dipilih</p>
                                    </div>
                                    <div className="d-flex items-center gap-2">
                                        <i className="ri-heart-fill text-red-500 text-xl"></i>
                                        <span className="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                                            {messages.length} Pesan Favorit
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {messages.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <h5 className="text-lg font-semibold text-default-800 dark:text-white mb-2">Belum Ada Pesan Favorit</h5>
                                        <p className="text-default-600 dark:text-default-400">
                                            Belum ada pesan yang ditandai sebagai favorit. Mulai tandai pesan-pesan terbaik!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message?.id}
                                                className="p-6 rounded-xl border border-green-300 bg-green-50/30 dark:bg-green-900/20 dark:border-green-600 shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <h6 className="font-bold text-xl text-default-800 dark:text-white mb-2">
                                                                {message?.sender?.nickname}
                                                            </h6>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${message?.is_private
                                                                ? 'bg-default-900 text-white dark:bg-default-700'
                                                                : 'bg-secondary/10 text-secondary'
                                                                }`}>
                                                                <i className={`me-1 ${message?.is_private ? 'ri-lock-line' : 'ri-global-line'}`}></i>
                                                                {message?.is_private ? 'Rahasia' : 'Public'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                                            <i className="ri-heart-fill"></i>
                                                            Favorit
                                                        </span>
                                                        <button
                                                            onClick={() => handleToggleFavorite(message?.id)}
                                                            className="p-2 rounded-full transition-all duration-300 border bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-200 dark:hover:bg-red-800/40"
                                                            title="Hapus dari favorit"
                                                        >
                                                            <i className="ri-heart-fill text-lg"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-4 p-4 rounded-lg bg-default-50 dark:bg-default-700/50">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <i className="ri-user-line text-primary"></i>
                                                        <span className="text-sm font-medium text-default-700 dark:text-default-300">
                                                            Untuk: <span className="font-semibold text-primary">{message?.recipient?.name}</span>
                                                        </span>
                                                    </div>
                                                    <p className="text-default-700 dark:text-default-300 leading-relaxed text-base">
                                                        {message?.message}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-default-500 dark:text-default-400">
                                                    <span className="flex items-center gap-1">
                                                        <i className="ri-time-line"></i>
                                                        {formatDate(message?.created_at)}
                                                    </span>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageListFavorite;
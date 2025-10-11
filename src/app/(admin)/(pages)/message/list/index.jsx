import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import { getNonPrivateMessages, getConfiguration, toggleMessageFavorite } from '@/service/serviceApi';
import { toast } from 'react-toastify';

const MessageList = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [configurations, setConfigurations] = useState({});
    const [configLoading, setConfigLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Load user data
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Load configurations and messages from API
    useEffect(() => {
        const loadData = async () => {
            try {
                setConfigLoading(true);
                setLoading(true);

                // Load configurations first
                const configResponse = await getConfiguration();
                if (configResponse?.data?.success) {
                    const configs = {};
                    configResponse?.data?.data?.forEach(config => {
                        configs[config.code] = config.is_active;
                    });
                    setConfigurations(configs);

                    // Check if feature is enabled
                    if (!configs.SHOW_ALL_MESSAGE) {
                        setLoading(false);
                        setConfigLoading(false);
                        return;
                    }
                }

                // Load messages if feature is enabled
                const response = await getNonPrivateMessages();
                if (response?.data?.success) {
                    setMessages(response?.data?.data);
                } else {
                    toast.error(response?.data?.message || 'Gagal memuat pesan');
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Gagal memuat data');
            } finally {
                setLoading(false);
                setConfigLoading(false);
            }
        };

        loadData();
    }, []);

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
        if (!user?.is_admin && !user?.is_semi_admin) {
            toast.error('Hanya admin atau semi admin yang dapat menandai pesan sebagai favorit');
            return;
        }

        try {
            const response = await toggleMessageFavorite(messageId);
            if (response?.data?.success) {
                // Update the message in the local state
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === messageId
                            ? { ...msg, is_favorited: response.data.data.is_favorited }
                            : msg
                    )
                );
                toast.success(response.data.message || 'Status favorit berhasil diubah');
            } else {
                toast.error(response?.data?.message || 'Gagal mengubah status favorit');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Gagal mengubah status favorit');
        }
    };

    if (configLoading || loading) {
        return (
            <>
                <PageMeta title="Semua Pesan" />
                <div className="container-fluid px-4 py-6">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Memuat semua pesan...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Check if feature is disabled
    if (!configurations.SHOW_ALL_MESSAGE) {
        return (
            <>
                <PageMeta title="Semua Pesan" />
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
                                <div className="card-body text-center py-5">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <h5 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                        Fitur Semua Pesan Dinonaktifkan
                                    </h5>
                                    <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                                        Saat ini fitur semua pesan sedang dinonaktifkan oleh administrator.
                                    </p>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                        Silakan hubungi administrator untuk informasi lebih lanjut.
                                    </p>
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
            <PageMeta title="Semua Pesan" />
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
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="card-title mb-0">Semua Pesan Teman-teman Mu</h4>
                                        <p className="text-muted mb-0">Pesan publik yang dibagikan oleh teman-teman Anda</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {messages.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h5 className="text-lg font-semibold text-default-800 dark:text-white mb-2">Belum Ada Pesan</h5>
                                        <p className="text-default-600 dark:text-default-400">
                                            Belum ada pesan publik yang dibagikan oleh teman-teman Anda.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message?.id}
                                                className={`p-6 rounded-xl border bg-white dark:bg-default-800 relative transition-all duration-300 ${(user.is_admin || user?.is_semi_admin) && message?.is_favorited
                                                    ? 'border-green-300 bg-green-50/30 dark:bg-green-900/20 dark:border-green-600 shadow-lg hover:shadow-xl'
                                                    : 'border border-default-200'
                                                    }`}
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
                                                    {(user?.is_admin || user?.is_semi_admin) && (
                                                        <button
                                                            onClick={() => handleToggleFavorite(message?.id)}
                                                            className={`p-2 rounded-full transition-all duration-300 border ${message?.is_favorited
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-800/40'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                }`}
                                                            title={message?.is_favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                                        >
                                                            <i className={`${message?.is_favorited ? 'ri-heart-fill' : 'ri-heart-line'} text-lg`}></i>
                                                        </button>
                                                    )}
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
                                                    {(message?.is_favorited && (user?.is_admin || user?.is_semi_admin)) && (
                                                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                                            <i className="ri-heart-fill"></i>
                                                            Favorit
                                                        </span>
                                                    )}
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

export default MessageList;

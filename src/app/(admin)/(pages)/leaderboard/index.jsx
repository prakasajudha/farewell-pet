import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import { getLeaderboard, getConfiguration, getGlobalStats } from '@/service/serviceApi';
import { toast } from 'react-toastify';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [configurations, setConfigurations] = useState({});
    const [configLoading, setConfigLoading] = useState(true);
    const [globalStats, setGlobalStats] = useState({
        total_private_message: 0,
        total_public_message: 0,
        total_message: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setConfigLoading(true);
                setLoading(true);
                setStatsLoading(true);

                // Load configurations first
                const configResponse = await getConfiguration();
                if (configResponse?.data?.success) {
                    const configs = {};
                    configResponse?.data?.data?.forEach(config => {
                        configs[config.code] = config.is_active;
                    });
                    setConfigurations(configs);

                    // Check if feature is enabled
                    if (!configs.SHOW_LEADER_BOARD) {
                        setLoading(false);
                        setConfigLoading(false);
                        setStatsLoading(false);
                        return;
                    }
                }

                // Load global stats
                try {
                    const statsResponse = await getGlobalStats();
                    if (statsResponse?.data?.success) {
                        setGlobalStats(statsResponse?.data?.data);
                    }
                } catch (statsError) {
                    console.error('Error loading global stats:', statsError);
                }

                // Load leaderboard if feature is enabled
                const response = await getLeaderboard();
                if (response?.data?.success) {
                    setLeaderboard(response?.data?.data);
                } else {
                    toast.error(response?.data?.message || 'Gagal memuat leaderboard');
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Gagal memuat data');
            } finally {
                setLoading(false);
                setConfigLoading(false);
                setStatsLoading(false);
            }
        };

        loadData();
    }, []);

    const getRankEmoji = (index) => {
        switch (index) {
            case 0:
                return '🥇'; // Gold medal
            case 1:
                return '🥈'; // Silver medal
            case 2:
                return '🥉'; // Bronze medal
            default:
                return '🏆'; // Trophy for others
        }
    };

    const getRankStyle = (index) => {
        switch (index) {
            case 0:
                return {
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#8B4513',
                    border: '2px solid #FFD700',
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                    transform: 'scale(1.02)'
                };
            case 1:
                return {
                    background: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
                    color: '#2F4F4F',
                    border: '2px solid #C0C0C0',
                    boxShadow: '0 6px 20px rgba(192, 192, 192, 0.3)',
                    transform: 'scale(1.01)'
                };
            case 2:
                return {
                    background: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
                    color: '#8B4513',
                    border: '2px solid #CD7F32',
                    boxShadow: '0 4px 15px rgba(205, 127, 50, 0.3)'
                };
            default:
                return {
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    color: '#495057',
                    border: '1px solid #dee2e6',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                };
        }
    };

    const getRankBadge = (index) => {
        switch (index) {
            case 0:
                return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
            case 1:
                return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800';
            case 2:
                return 'bg-gradient-to-r from-orange-400 to-orange-600 text-orange-900';
            default:
                return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
        }
    };

    if (configLoading || loading || statsLoading) {
        return (
            <>
                <PageMeta title="Leaderboard" />
                <div className="container-fluid px-4 py-6">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Memuat leaderboard...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Check if feature is disabled
    if (!configurations.SHOW_LEADER_BOARD) {
        return (
            <>
                <PageMeta title="Leaderboard" />
                <div className="container-fluid px-4 py-6">
                    <div className="d-flex justify-content-end mb-4">
                        <button
                            className="btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
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
                                        Fitur Leaderboard Dinonaktifkan
                                    </h5>
                                    <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                                        Saat ini fitur leaderboard sedang dinonaktifkan oleh administrator.
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

    if (leaderboard.length === 0) {
        return (
            <>
                <PageMeta title="Leaderboard" />
                <div className="container-fluid px-4 py-6">
                    <div className="d-flex justify-content-end mb-4">
                        <button
                            className="btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
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
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Belum Ada Data Leaderboard</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Mulai kirim pesan untuk masuk ke leaderboard!</p>
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
            <PageMeta title="Leaderboard" />
            <div className="container-fluid px-4 py-6">
                <div className="d-flex justify-content-end mb-4">
                    <button
                        className="btn bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        onClick={() => navigate('/message')}
                    >
                        <i className="ri-arrow-left-line me-2"></i>
                        Kembali
                    </button>
                </div>

                {/* Message Statistics */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-md size-12 bg-primary/10">
                                        <svg className="size-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <p className="mb-1 text-default-500">Total Pesan</p>
                                        <h5 className="font-semibold text-default-800">{globalStats.total_message}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-md size-12 bg-success/10">
                                        <svg className="size-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <p className="mb-1 text-default-500">Pesan Pribadi</p>
                                        <h5 className="font-semibold text-default-800">{globalStats.total_private_message}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center rounded-md size-12 bg-info/10">
                                        <svg className="size-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm">
                                        <p className="mb-1 text-default-500">Pesan Publik</p>
                                        <h5 className="font-semibold text-default-800">{globalStats.total_public_message}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header pt-5 pb-5">
                                <div className="flex w-full justify-between align-items-center items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="card-title mb-0">🏆 Leaderboard</h4>
                                            <p className="text-muted mb-0">Top penerima pesan teraktif</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Pesan</div>
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {leaderboard.reduce((sum, user) => sum + user.total_messages, 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {leaderboard.map((user, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-between p-5 rounded-xl transition-all duration-300 hover:shadow-lg ${index < 3 ? 'animate-pulse-slow' : ''}`}
                                            style={getRankStyle(index)}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-lg">
                                                    <span className="text-3xl">{getRankEmoji(index)}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h5 className="font-bold text-xl mb-0">{user.name}</h5>
                                                        {index < 3 && (
                                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRankBadge(index)}`}>
                                                                #{index + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm opacity-80 mb-0">
                                                        {user.total_messages} pesan diterima
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-3xl font-bold mb-1">
                                                    {user.total_messages}
                                                </div>
                                                <div className="text-sm opacity-70">
                                                    pesan
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Leaderboard;

import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/service/serviceApi';
import { toast } from 'react-toastify';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await getLeaderboard();

                if (response?.data?.success) {
                    setLeaderboard(response?.data?.data);
                } else {
                    toast.error(response?.data?.message || 'Gagal memuat leaderboard');
                }
            } catch (error) {
                console.error('Error loading leaderboard:', error);
                toast.error('Gagal memuat leaderboard');
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
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

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Memuat leaderboard...</span>
                </div>
            </div>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Belum Ada Data Leaderboard</h3>
                    <p className="text-gray-600 dark:text-gray-400">Mulai kirim pesan untuk masuk ke leaderboard!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">🏆 Leaderboard</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Top penerima pesan</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Pesan</div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {leaderboard.reduce((sum, user) => sum + user.total_messages, 0)}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {leaderboard.map((user, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:shadow-md ${index < 3 ? 'animate-pulse-slow' : ''}`}
                        style={getRankStyle(index)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md">
                                <span className="text-2xl">{getRankEmoji(index)}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-lg">{user.name}</h4>
                                    {index < 3 && (
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRankBadge(index)}`}>
                                            #{index + 1}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm opacity-80">
                                    {user.total_messages} pesan diterima
                                </p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;

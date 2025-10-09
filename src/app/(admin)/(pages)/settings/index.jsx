import { useState, useEffect } from 'react';
import PageMeta from '@/components/PageMeta';
import { toast } from 'react-toastify';
import { getConfiguration, updateConfiguration } from '@/service/serviceApi';

const Settings = () => {
    const [settings, setSettings] = useState({
        SHOW_INDIVIDUAL_MESSAGE: false,
        SHOW_ALL_MESSAGE: false,
        SEND_MESSAGE: false,
        SHOW_LEADER_BOARD: false
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Load configurations from API
    useEffect(() => {
        const loadConfigurations = async () => {
            try {
                setInitialLoading(true);
                const response = await getConfiguration();

                if (response?.data?.success) {
                    const configs = {};
                    response?.data?.data?.forEach(config => {
                        configs[config.code] = config.is_active;
                    });
                    setSettings(configs);
                } else {
                    toast.error('Gagal memuat konfigurasi');
                }
            } catch (error) {
                console.error('Error loading configurations:', error);
                toast.error('Gagal memuat konfigurasi sistem');
            } finally {
                setInitialLoading(false);
            }
        };

        loadConfigurations();
    }, []);

    const handleToggle = async (code) => {
        const newValue = !settings[code];
        setLoading(true);

        try {
            // Call API to update configuration
            const response = await updateConfiguration({
                code: code,
                is_active: newValue
            });

            if (response?.data?.success) {
                // Update local state
                const newSettings = {
                    ...settings,
                    [code]: newValue
                };
                setSettings(newSettings);

                // Show success toast
                const settingName = getSettingLabel(code);
                const shortName = settingName.replace('Aktifkan ', '');
                toast.success(`${shortName} ${newValue ? 'Aktif' : 'Nonaktif'}`);
            } else {
                toast.error(response?.data?.message || 'Gagal mengupdate konfigurasi');
            }
        } catch (error) {
            console.error('Error updating configuration:', error);
            toast.error('Gagal mengupdate konfigurasi');
        } finally {
            setLoading(false);
        }
    };

    const getSettingLabel = (code) => {
        switch (code) {
            case 'SHOW_INDIVIDUAL_MESSAGE':
                return 'Aktifkan Melihat Pesan Individu';
            case 'SHOW_ALL_MESSAGE':
                return 'Aktifkan Melihat Semua Pesan';
            case 'SEND_MESSAGE':
                return 'Aktifkan Mengirim Pesan';
            case 'SHOW_LEADER_BOARD':
                return 'Aktifkan Leaderboard';
            default:
                return '';
        }
    };

    const getSettingDescription = (code) => {
        switch (code) {
            case 'SHOW_INDIVIDUAL_MESSAGE':
                return 'Izinkan melihat pesan yang dikirim khusus untuk Anda';
            case 'SHOW_ALL_MESSAGE':
                return 'Izinkan melihat semua pesan publik yang ada';
            case 'SEND_MESSAGE':
                return 'Izinkan mengirim pesan ke teman-teman';
            case 'SHOW_LEADER_BOARD':
                return 'Izinkan melihat leaderboard dan ranking pengguna';
            default:
                return '';
        }
    };

    return (
        <>
            <PageMeta title="Pengaturan" />
            <div className="container-fluid px-4 py-6">
                {initialLoading ? (
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Memuat pengaturan...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Pengaturan Pesan</h4>
                                    <p className="text-muted mb-0">Kelola izin dan preferensi pesan Anda</p>
                                </div>
                                <div className="card-body">
                                    <div className="space-y-6">
                                        {Object.keys(settings).map((code) => (
                                            <div key={code} className="flex items-center justify-between p-4 rounded-lg border border-default-200 dark:border-default-600 bg-white dark:bg-default-800">
                                                <div className="flex-1">
                                                    <h6 className="text-lg font-semibold text-default-800 dark:text-white mb-1">
                                                        {getSettingLabel(code)}
                                                    </h6>
                                                    <p className="text-sm text-default-600 dark:text-default-400">
                                                        {getSettingDescription(code)}
                                                    </p>
                                                </div>
                                                <div className="ml-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggle(code)}
                                                        disabled={loading}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${settings[code] ? 'bg-primary' : 'bg-default-300'
                                                            }`}
                                                        aria-pressed={settings[code]}
                                                    >
                                                        <span
                                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${settings[code] ? 'translate-x-5' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h6 className="font-semibold text-default-800 dark:text-white mb-1">Informasi</h6>
                                                <p className="text-sm text-default-600 dark:text-default-400">
                                                    Pengaturan ini akan mempengaruhi fitur yang dapat Anda akses di halaman pesan.
                                                    Pastikan untuk mengaktifkan izin yang sesuai dengan kebutuhan Anda.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Settings;

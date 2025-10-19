import { useState } from 'react';
import { toast } from 'react-toastify';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import { registerUser } from '@/service/serviceApi';

const Index = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        nickname: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await registerUser(formData);
            toast.success('User berhasil didaftarkan!');
            setFormData({
                name: '',
                email: '',
                password: '',
                nickname: ''
            });
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Gagal mendaftarkan user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageMeta title="Register User" />
            <main>
                <PageBreadcrumb subtitle="Users" title="Register New User" />

                <div className="card">
                    <div className="card-body">
                        <div className="text-center mb-6">
                            <h4 className="mb-2 text-xl font-semibold text-primary">
                                Register New User
                            </h4>
                            <p className="text-base text-default-500">
                                Daftarkan user baru ke dalam sistem
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                            <div className="mb-4">
                                <label htmlFor="name" className="block font-medium text-default-900 text-sm mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input w-full"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block font-medium text-default-900 text-sm mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input w-full"
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="nickname" className="block font-medium text-default-900 text-sm mb-2">
                                    Nickname *
                                </label>
                                <input
                                    type="text"
                                    id="nickname"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                    className="form-input w-full"
                                    placeholder="Enter nickname"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block font-medium text-default-900 text-sm mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="form-input w-full"
                                    placeholder="Enter password"
                                    required
                                    minLength="6"
                                />
                                <p className="text-xs text-default-500 mt-1">
                                    Password minimal 6 karakter
                                </p>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`btn bg-primary text-white w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isLoading ? 'Mendaftarkan...' : 'Register User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Index;

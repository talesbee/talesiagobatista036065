import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

import { Button } from '../components';

import '../i18n';

export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await login({ username, password });
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('refreshToken', res.refresh_token);
            navigate('/pets');
        } catch {
            setError(t('login.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 items-center justify-center">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-blue-100 mt-20">
                    <div className="flex justify-center mb-4 text-5xl">🐾</div>
                    <h2 className="text-2xl font-bold mb-2 text-center">{t('login.title')}</h2>
                    <p className="text-gray-500 text-center mb-6">{t('login.welcome')}</p>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">{t('login.username')}</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">{t('login.password')}</label>
                        <input
                            type="password"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? t('login.loading') : t('login.submit')}
                    </Button>
                </form>
            </div>
        </div>
    );
}

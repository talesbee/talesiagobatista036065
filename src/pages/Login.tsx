
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
            setError('Usuário ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Usuário</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Senha</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}

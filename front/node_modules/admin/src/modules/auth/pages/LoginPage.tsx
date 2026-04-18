import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { authApi } from '../api/auth.api';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.login(email, password);
            if (response.success && response.data?.token) {
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Giriş uğursuz oldu. Məlumatları yoxlayın.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
            <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-700">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-6">
                        <Landmark className="text-white w-9 h-9" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Xoş Gəlmisiniz</h1>
                    <p className="text-slate-500 font-medium">Karabakh Admin Portalına giriş edin</p>
                </div>

                <Card className="!p-10 shadow-2xl shadow-slate-200/50 border-none">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-700 ml-1">E-poçt ünvanı</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Mail className="w-[18px] h-[18px]" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@discoverkarabakh.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[13px] font-bold text-slate-700">Şifrə</label>
                                <button type="button" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700">Şifrəni unutmusunuz?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock className="w-[18px] h-[18px]" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-12 text-sm font-medium outline-none focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2 ml-1">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="remember" className="text-[13px] font-medium text-slate-500 cursor-pointer">Məni xatırla</label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-4 text-base shadow-indigo-100"
                            isLoading={isLoading}
                        >
                            Giriş Et
                        </Button>
                    </form>
                </Card>

                {/* Footer Link */}
                <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                    Hesabınız yoxdur? <span className="text-indigo-600 cursor-help border-b border-indigo-200">Sistem admini ilə əlaqə saxlayın</span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

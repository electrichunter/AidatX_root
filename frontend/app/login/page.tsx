"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const res = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.access_token);
                router.push("/dashboard");
            } else {
                alert("Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.");
            }
        } catch (err) {
            alert("Sunucuya bağlanırken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-800">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>Ana Sayfaya Dön</span>
            </Link>

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mb-4 shadow-sm">
                        A
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Yönetim Paneline Giriş</h1>
                    <p className="text-slate-500 mt-2 text-sm text-center">Hesabınıza erişmek için bilgilerinizi girin.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@apartman.com"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow text-slate-900"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-700">Şifre</label>
                                <Link href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow text-slate-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Giriş Yap"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                        Hesabınız yok mu? <Link href="/contact" className="font-semibold text-blue-600 hover:text-blue-800">Yöneticiyle İletişime Geçin</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

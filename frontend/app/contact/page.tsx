"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/contact/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Mesaj gönderilirken bir hata oluştu.");
            }

            setSuccess(true);
            setFormData({ full_name: "", email: "", subject: "", message: "" });
        } catch (err: any) {
            setError(err.message || "Bilinmeyen bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
            <Navbar />

            <section className="flex-1 py-16 px-6 flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">Yöneticiyle İletişime Geçin</h1>
                        <p className="text-slate-600">
                            Sisteme giriş yapamıyorsanız veya hesabınız henüz oluşturulmadıysa aşağıdaki formu doldurarak bina yönetiminize mesaj gönderebilirsiniz.
                        </p>
                    </div>

                    {success ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Mesajınız Gönderildi!</h3>
                            <p className="mb-6">Yönetim en kısa sürede size dönüş yapacaktır.</p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                            >
                                Yeni Mesaj Gönder
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        required
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                        placeholder="Adınız Soyadınız"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Konu</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                    placeholder="Hangi konuda yardıma ihtiyacınız var?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mesajınız</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-y"
                                    placeholder="Mesajınızı buraya yazın..."
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">
                                    Giriş Ekranına Dön
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : "Mesajı Gönder"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}

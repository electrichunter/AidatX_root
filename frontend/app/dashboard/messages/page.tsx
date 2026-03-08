"use client";

import { useState, useEffect } from "react";

interface ContactMessage {
    id: number;
    full_name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function MessagesDashboard() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    // In a real app, this would fetch from the API using the admin token
    // useEffect(() => { ... fetch('/contact/') ... }, []);

    // Simulated data for UI demonstration
    useEffect(() => {
        setTimeout(() => {
            setMessages([
                {
                    id: 1,
                    full_name: "Ahmet Yılmaz",
                    email: "ahmet@example.com",
                    subject: "A Blok Asansör Arızası",
                    message: "Merhaba, A blok asansörü 2 gündür çalışmıyor. Ne zaman tamir edilecek?",
                    is_read: false,
                    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
                },
                {
                    id: 2,
                    full_name: "Ayşe Demir",
                    email: "ayse.demir@example.com",
                    subject: "Sisteme Giriş Hatası",
                    message: "Uygulamaya şifrem ile giremiyorum. Şifre sıfırlama maili de gelmedi. Lütfen hesabımı kontrol edebilir misiniz? Daire: B Blok No: 15",
                    is_read: true,
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const markAsRead = (id: number) => {
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: true } : m));
        // Simulated API Call
        // fetch(`/contact/${id}/read`, { method: "PATCH" })
    };

    const deleteMessage = (id: number) => {
        setMessages(msgs => msgs.filter(m => m.id !== id));
        setSelectedMessage(null);
        // Simulated API Call
        // fetch(`/contact/${id}`, { method: "DELETE" })
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Messages List (Left Sidebar) */}
            <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Gelen Kutusu</h2>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                        {messages.filter(m => !m.is_read).length} Yeni
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {messages.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">Mesaj kutunuz boş.</div>
                    ) : (
                        messages.map(msg => (
                            <button
                                key={msg.id}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    if (!msg.is_read) markAsRead(msg.id);
                                }}
                                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selectedMessage?.id === msg.id ? "bg-blue-50/50" : ""
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-semibold ${msg.is_read ? "text-slate-700" : "text-slate-900"}`}>
                                        {msg.full_name}
                                    </span>
                                    {!msg.is_read && (
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                                    )}
                                </div>
                                <div className="text-sm font-medium text-slate-800 truncate mb-1">{msg.subject}</div>
                                <div className="text-sm text-slate-500 truncate">{msg.message}</div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Message Reader (Right Panel) */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {selectedMessage ? (
                    <>
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedMessage.subject}</h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                                        {selectedMessage.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">{selectedMessage.full_name}</div>
                                        <div className="text-sm text-slate-500">{selectedMessage.email}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-500 flex flex-col items-end gap-3">
                                {new Date(selectedMessage.created_at).toLocaleString('tr-TR')}
                                <button
                                    onClick={() => deleteMessage(selectedMessage.id)}
                                    className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Sil
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {selectedMessage.message}
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-slate-50">
                            <a
                                href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                E-posta ile Yanıtla
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <p className="text-lg font-medium text-slate-600 mb-1">Mesaj Seçilmedi</p>
                        <p className="text-sm">Okumak için sol taraftaki listeden bir mesaj seçin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";

interface Due {
    id: number;
    apartment_id: number;
    period_year: number;
    period_month: number;
    amount: number;
    due_date: string;
    status: "unpaid" | "paid" | "partial" | "cancelled";
    description: string | null;
}

interface Payment {
    id: number;
    due_id: number;
    payer_id: number | null;
    amount: number;
    payment_date: string;
    method: string;
    status: string;
}

export default function DuesAndPaymentsDashboard() {
    const [activeTab, setActiveTab] = useState<"dues" | "payments">("dues");

    const [dues, setDues] = useState<Due[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Due Modal
    const [isAddDueModalOpen, setIsAddDueModalOpen] = useState(false);
    const [dueForm, setDueForm] = useState({
        apartment_id: "",
        period_year: new Date().getFullYear().toString(),
        period_month: (new Date().getMonth() + 1).toString(),
        amount: "",
        due_date: new Date().toISOString().split('T')[0],
        description: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { "Authorization": `Bearer ${token}` };

            if (activeTab === "dues") {
                const res = await fetch("http://localhost:8000/dues/", { headers });
                if (res.ok) setDues(await res.json());
            } else {
                const res = await fetch("http://localhost:8000/payments/", { headers });
                if (res.ok) setPayments(await res.json());
            }
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleCreateDue = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const payload = {
                apartment_id: parseInt(dueForm.apartment_id),
                period_year: parseInt(dueForm.period_year),
                period_month: parseInt(dueForm.period_month),
                amount: parseFloat(dueForm.amount),
                due_date: dueForm.due_date,
                description: dueForm.description
            };

            const res = await fetch("http://localhost:8000/dues/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsAddDueModalOpen(false);
                setDueForm({ ...dueForm, amount: "", description: "", apartment_id: "" });
                await fetchData();
            } else {
                alert("Aidat eklenirken hata oluştu.");
            }
        } catch (err) {
            alert("Sunucu bağlantı hatası.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Aidat ve Tahsilat</h2>
                    <p className="text-sm text-slate-500 mt-1">Daire borçlandırmalarını ve alınan ödemeleri takip edin.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setActiveTab("dues")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'dues' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Aidatlar (Tahakkuk)
                        </button>
                        <button
                            onClick={() => setActiveTab("payments")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'payments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Tahsilatlar
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex gap-2">
                    <input type="month" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                {activeTab === "dues" && (
                    <button
                        onClick={() => setIsAddDueModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Aidat Ekle
                    </button>
                )}
                {activeTab === "payments" && (
                    <button
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tahsilat Gir
                    </button>
                )}
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center flex-col items-center h-48 gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-slate-500">Yükleniyor...</span>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    {activeTab === "dues" ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                                        <th className="py-3 px-4">Dönem</th>
                                        <th className="py-3 px-4">Daire ID</th>
                                        <th className="py-3 px-4">Tutar</th>
                                        <th className="py-3 px-4">Son Ödeme</th>
                                        <th className="py-3 px-4">Durum</th>
                                        <th className="py-3 px-4 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dues.length === 0 ? (
                                        <tr><td colSpan={6} className="py-8 text-center text-slate-500 text-sm">Kayıtlı aidat bulunamadı.</td></tr>
                                    ) : (
                                        dues.map((due) => (
                                            <tr key={due.id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                                                <td className="py-3 px-4 font-medium">{due.period_month}/{due.period_year}</td>
                                                <td className="py-3 px-4">{due.apartment_id}</td>
                                                <td className="py-3 px-4 font-semibold text-slate-900">{due.amount} ₺</td>
                                                <td className="py-3 px-4">{due.due_date}</td>
                                                <td className="py-3 px-4">
                                                    {due.status === "paid" ? (
                                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Ödendi</span>
                                                    ) : due.status === "unpaid" ? (
                                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Ödenmedi</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">{due.status}</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Ödeme Al</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                                        <th className="py-3 px-4">Tarih</th>
                                        <th className="py-3 px-4">Tutar</th>
                                        <th className="py-3 px-4">Aidat ID</th>
                                        <th className="py-3 px-4">Yöntem</th>
                                        <th className="py-3 px-4">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payments.length === 0 ? (
                                        <tr><td colSpan={5} className="py-8 text-center text-slate-500 text-sm">Kayıtlı ödeme bulunamadı.</td></tr>
                                    ) : (
                                        payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                                                <td className="py-3 px-4">{p.payment_date}</td>
                                                <td className="py-3 px-4 font-semibold text-green-600">+{p.amount} ₺</td>
                                                <td className="py-3 px-4">{p.due_id}</td>
                                                <td className="py-3 px-4 uppercase">{p.method}</td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{p.status}</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Add Due Modal */}
            {isAddDueModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-900 text-lg">Yeni Aidat Tahakkuk Ettir</h3>
                            <button onClick={() => setIsAddDueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateDue}>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Daire ID <span className="text-red-500">*</span></label>
                                        <input
                                            required type="number"
                                            value={dueForm.apartment_id}
                                            onChange={e => setDueForm({ ...dueForm, apartment_id: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
                                            placeholder="Örn: 101"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Yıl <span className="text-red-500">*</span></label>
                                        <input required type="number" value={dueForm.period_year} onChange={e => setDueForm({ ...dueForm, period_year: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Ay <span className="text-red-500">*</span></label>
                                        <input required type="number" min="1" max="12" value={dueForm.period_month} onChange={e => setDueForm({ ...dueForm, period_month: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tutar (₺) <span className="text-red-500">*</span></label>
                                        <input required type="number" step="0.01" value={dueForm.amount} onChange={e => setDueForm({ ...dueForm, amount: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Son Ödeme Tarihi <span className="text-red-500">*</span></label>
                                        <input required type="date" value={dueForm.due_date} onChange={e => setDueForm({ ...dueForm, due_date: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                                        <input type="text" value={dueForm.description} onChange={e => setDueForm({ ...dueForm, description: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" placeholder="İhtiyari..." />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddDueModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">İptal</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

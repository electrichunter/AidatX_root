"use client";

import { useState, useEffect } from "react";

interface DashboardSummary {
    total_buildings: number;
    total_apartments: number;
    total_dues_amount: number;
    total_collected: number;
    total_overdue: number;
    pending_count: number;
    overdue_count: number;
    total_expenses: number;
}

interface DebtorItem {
    apartment_id: number;
    apartment_number: string;
    block_name: string;
    building_name: string;
    total_debt: number;
    due_count: number;
}

export default function DashboardOverview() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [debtors, setDebtors] = useState<DebtorItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { "Authorization": `Bearer ${token}` };

                const [summaryRes, debtorsRes] = await Promise.all([
                    fetch("http://localhost:8000/reports/summary", { headers }),
                    fetch("http://localhost:8000/reports/debtors", { headers })
                ]);

                if (summaryRes.ok) {
                    setSummary(await summaryRes.json());
                }
                if (debtorsRes.ok) {
                    setDebtors(await debtorsRes.json());
                }
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center flex-col items-center h-64 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-sm text-slate-500">Raporlar Yükleniyor...</span>
            </div>
        );
    }

    const {
        total_collected = 0,
        total_dues_amount = 0,
        total_expenses = 0,
        total_overdue = 0,
        total_apartments = 0,
        total_buildings = 0,
        overdue_count = 0
    } = summary || {};

    // Net Kasa: Tahsil Edilen - Giderler
    const netBalance = total_collected - total_expenses;

    const stats = [
        { name: "Net Kasa Bakiyesi", value: `₺${netBalance.toLocaleString()}`, change: "Güncel", positive: netBalance >= 0 },
        { name: "Bekleyen Tahsilat", value: `₺${total_dues_amount.toLocaleString()}`, change: `${total_apartments} Daire`, positive: true },
        { name: "Toplam Giderler", value: `₺${total_expenses.toLocaleString()}`, change: "Gider", positive: false },
        { name: "Geciken Ödemeler", value: `₺${total_overdue.toLocaleString()}`, change: `${overdue_count} Adet`, positive: false },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Genel Bakış</h2>
                <p className="text-slate-500 mt-1">AidatX Site Yönetim Finansal Durumu ve Özet Raporlar.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-slate-500 mb-2">{stat.name}</h3>
                        <div className="flex items-baseline gap-3 cursor-default" title="Detaylı Rapor Çok Yakında!">
                            <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Debtors List */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-base font-bold text-slate-900">En Çok Borcu Olan Daireler</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">Tümünü Gör</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {debtors.length === 0 ? (
                            <div className="px-6 py-10 text-center text-slate-500 text-sm">Harika! Gecikmiş aidat borcu bulunan daire yok.</div>
                        ) : (
                            debtors.map((debtor: DebtorItem) => (
                                <div key={debtor.apartment_id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {debtor.building_name} / {debtor.block_name} Blok / No: {debtor.apartment_number}
                                            </p>
                                            <p className="text-sm text-slate-500">Gecikmiş {debtor.due_count} Aidat</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-red-600">
                                        -{debtor.total_debt.toLocaleString()} ₺
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Scope Summary & Quick Links */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                        <h3 className="text-base font-bold text-slate-900">Sistem Özeti</h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                <span className="font-medium text-slate-700">Toplam Bina</span>
                            </div>
                            <span className="text-lg font-bold text-slate-900">{total_buildings}</span>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                <span className="font-medium text-slate-700">Toplam Daire</span>
                            </div>
                            <span className="text-lg font-bold text-slate-900">{total_apartments}</span>
                        </div>

                        <button onClick={() => window.location.href = '/dashboard/dues'} className="mt-auto w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                            Finansal Detaylara Git →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

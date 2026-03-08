export default function DashboardOverview() {
    const stats = [
        { name: "Toplam Kasa Bakiyesi", value: "₺240,500", change: "+4.7%", positive: true },
        { name: "Bekleyen Aidatlar", value: "₺12,450", change: "-1.2%", positive: true },
        { name: "Bu Ayki Giderler", value: "₺34,200", change: "+12.5%", positive: false },
        { name: "Geciken Ödeme Sayısı", value: "8", change: "-2", positive: true },
    ];

    const recentTransactions = [
        { id: 1, type: "income", description: "B Blok 12 Nolu Daire Aidat Ödemesi", amount: "₺850", date: "Bugün, 14:30" },
        { id: 2, type: "expense", description: "Asansör Aylık Bakım Ücreti (A Blok)", amount: "₺1,200", date: "Dün, 09:15" },
        { id: 3, type: "income", description: "C Blok 4 Nolu Daire Aidat Ödemesi", amount: "₺850", date: "12 Mar, 16:45" },
        { id: 4, type: "expense", description: "Ortak Alan Elektrik Faturası", amount: "₺3,450", date: "10 Mar, 10:20" },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Genel Bakış</h2>
                <p className="text-slate-500 mt-1">AidatX Demo Sitesi için güncel finansal durum ve özet bilgiler.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-slate-500 mb-2">{stat.name}</h3>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-base font-bold text-slate-900">Son İşlemler</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">Tümünü Gör</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentTransactions.map((tx) => (
                            <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        {tx.type === 'income' ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{tx.description}</p>
                                        <p className="text-sm text-slate-500">{tx.date}</p>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                    {tx.type === 'income' ? '+' : '-'}{tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Important Notes */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                        <h3 className="text-base font-bold text-slate-900">Duyurular & Aktiviteler</h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex items-center gap-2 text-amber-800 font-bold mb-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Dikkat
                            </div>
                            <p className="text-sm text-amber-700">A Blok asansör revizyonu bu Cuma saat 10:00'da başlayacaktır. (2 Gün Önce)</p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Bilgilendirme
                            </div>
                            <p className="text-sm text-blue-700">Nisan ayı aidatları sisteme tanımlandı ve sakinelere mail/sms gönderildi. (Bugün)</p>
                        </div>

                        <button className="mt-auto w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Yeni Duyuru Ekle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

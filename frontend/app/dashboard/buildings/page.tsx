"use client";

import { useState, useEffect } from "react";

interface Building {
    id: number;
    name: string;
    address: string;
    city: string;
    manager_id: number | null;
    created_at: string;
}

export default function BuildingsDashboard() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({ name: "", city: "", address: "" });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBuildings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/buildings/", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setBuildings(data);
            }
        } catch (err) {
            console.error("Error connecting to backend", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuildings();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/buildings/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsAddModalOpen(false);
                setFormData({ name: "", city: "", address: "" });
                await fetchBuildings();
            } else {
                setError("Bina eklenirken bir hata oluştu.");
            }
        } catch (err) {
            setError("Sunucuya bağlanılamadı.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu binayı silmek istediğinize emin misiniz?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8000/buildings/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                setBuildings(buildings.filter(b => b.id !== id));
            } else {
                alert("Silme işlemi başarısız oldu.");
            }
        } catch (err) {
            alert("Sunucuya bağlanılamadı.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Binalar ve Siteler</h2>
                    <p className="text-sm text-slate-500 mt-1">Sisteme kayıtlı bina ve sitelerinizi yönetin.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Bina Ekle
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center flex-col items-center h-48 gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-slate-500">Yükleniyor...</span>
                </div>
            ) : buildings.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Henüz bina bulunmuyor</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">
                        Sistemde kayıtlı hiçbir bina veya site bulunamadı. Hemen yeni bir bina ekleyerek yönetime başlayın.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
                    >
                        İlk Binayı Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {buildings.map((building) => (
                        <div key={building.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                            <div className="p-5 flex-1 w-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <button onClick={() => handleDelete(building.id)} className="text-slate-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity" title="Binayı Sil">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1 leading-tight">{building.name}</h3>
                                <div className="flex items-start gap-1.5 text-slate-500 mt-2">
                                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-sm line-clamp-2">{building.address}, {building.city}</p>
                                </div>
                            </div>
                            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between mt-auto">
                                <span className="text-xs font-medium text-slate-500">
                                    {new Date(building.created_at).toLocaleDateString('tr-TR')}
                                </span>
                                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                    Yönet →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Minimal Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-900 text-lg">Yeni Bina/Site Ekle</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="p-6 space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bina / Site Adı <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        placeholder="Örn: Flora Evleri"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Şehir <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                            placeholder="Örn: İstanbul"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Açık Adres <span className="text-red-500">*</span></label>
                                        <textarea
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                                            rows={3}
                                            placeholder="Açık adresi giriniz..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                                    disabled={formLoading}
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
                                >
                                    {formLoading ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : null}
                                    Ekle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

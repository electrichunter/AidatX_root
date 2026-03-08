"use client";

import { useState, useEffect } from "react";

interface Apartment {
    id: number;
    number: string;
    floor: number | null;
    area_sqm: number | null;
    is_occupied: boolean;
    block_id: number;
    resident_id: number | null;
}

export default function ApartmentsDashboard() {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        number: "",
        floor: "",
        area_sqm: "",
        block_id: ""
    });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApartments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/apartments/", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setApartments(data);
            }
        } catch (err) {
            console.error("Error fetching apartments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApartments();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const payload = {
                number: formData.number,
                floor: formData.floor ? parseInt(formData.floor) : null,
                area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
                block_id: parseInt(formData.block_id)
            };

            const res = await fetch("http://localhost:8000/apartments/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsAddModalOpen(false);
                setFormData({ number: "", floor: "", area_sqm: "", block_id: "" });
                await fetchApartments();
            } else {
                setError("Daire eklenirken bir hata oluştu.");
            }
        } catch (err) {
            setError("Sunucuya bağlanılamadı.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu daireyi silmek istediğinize emin misiniz?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8000/apartments/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setApartments(apartments.filter(a => a.id !== id));
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
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Daire Yönetimi</h2>
                    <p className="text-sm text-slate-500 mt-1">Tüm daireleri görüntüleyin ve yönetin.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Daire Ekle
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center flex-col items-center h-48 gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-slate-500">Yükleniyor...</span>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                                    <th className="py-3 px-4">Daire No</th>
                                    <th className="py-3 px-4">Blok ID</th>
                                    <th className="py-3 px-4">Kat</th>
                                    <th className="py-3 px-4">Alan (m²)</th>
                                    <th className="py-3 px-4">Durum</th>
                                    <th className="py-3 px-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {apartments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500">
                                            Kayıtlı daire bulunamadı.
                                        </td>
                                    </tr>
                                ) : (
                                    apartments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                                            <td className="py-3 px-4 font-semibold text-slate-900">{apt.number}</td>
                                            <td className="py-3 px-4">{apt.block_id}</td>
                                            <td className="py-3 px-4">{apt.floor !== null ? apt.floor : '-'}</td>
                                            <td className="py-3 px-4">{apt.area_sqm !== null ? `${apt.area_sqm} m²` : '-'}</td>
                                            <td className="py-3 px-4">
                                                {apt.is_occupied ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Dolu</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Boş</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button onClick={() => handleDelete(apt.id)} className="text-red-500 hover:text-red-700 p-1 font-medium transition-colors">
                                                    Sil
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Minimal Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-900 text-lg">Yeni Daire Ekle</h3>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Daire No <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.number}
                                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            placeholder="Örn: 12"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Blok ID <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.block_id}
                                            onChange={(e) => setFormData({ ...formData, block_id: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            placeholder="Blok ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Kat</label>
                                        <input
                                            type="number"
                                            value={formData.floor}
                                            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            placeholder="Örn: 3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Alan (m²)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.area_sqm}
                                            onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            placeholder="Örn: 120"
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

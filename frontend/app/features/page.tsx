import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Features() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            <Navbar />

            <section className="flex-1 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                            Özelliklerimiz
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Bina yönetimi ile ilgili tüm ihtiyaçlarınız tek platformda toplandı.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {/* Feature 1 */}
                        <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex-1">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Otomatik Aidat ve Gider Yönetimi</h2>
                                <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                    Her ay yüzlerce daire için tek tek aidat tanımlamakla uğraşmayın. Toplu borçlandırma özelliği ile saniyeler içinde tüm dairelerin borçlarını oluşturup, online ödeme entegrasyonu ile tahsilatlarınızı hızlandırın.
                                </p>
                                <ul className="list-disc pl-5 text-slate-600 space-y-2">
                                    <li>Toplu veya kişiye özel borçlandırma</li>
                                    <li>Gecikme faizi ve ceza takibi</li>
                                    <li>Online ödeme (çok yakında)</li>
                                    <li>Gelir/Gider makbuzu ve fiş ekleme</li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full bg-slate-100 rounded-xl aspect-[4/3] flex items-center justify-center border border-slate-200 text-slate-400">
                                [Aidat Yönetim Görseli]
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex-1">
                                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Şeffaf Raporlar ve Analizler</h2>
                                <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                    Yönetim şeffaflıkla başlar. AidatX apartman sakinlerine anlık borç durumlarını ve bina kasasındaki meblağı görme imkanı tanıyarak apartman içindeki soru işaretlerini ortadan kaldırır.
                                </p>
                                <ul className="list-disc pl-5 text-slate-600 space-y-2">
                                    <li>Borçlular listesi Excel/PDF çıktısı</li>
                                    <li>Güncel kasa/bakiye raporlaması</li>
                                    <li>Geçmişe dönük ödeme tarihçesi (Sakin özel)</li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full bg-slate-100 rounded-xl aspect-[4/3] flex items-center justify-center border border-slate-200 text-slate-400">
                                [Raporlar Görseli]
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex-1">
                                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Duyurular ve İletişim</h2>
                                <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                    Apartman genel kurul toplantıları, su/elektrik kesintileri veya bina kuralları gibi konularda tek tıkla sistem üzerinden herkese aynı anda mesaj iletin.
                                </p>
                                <ul className="list-disc pl-5 text-slate-600 space-y-2">
                                    <li>Sistem içi panoda duyuru yayınlama</li>
                                    <li>Yönetici-Sakin arası mesajlaşma alt yapısı</li>
                                    <li>Apartman kural belgeleri yükleme alanı</li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full bg-slate-100 rounded-xl aspect-[4/3] flex items-center justify-center border border-slate-200 text-slate-400">
                                [Duyuru Görseli]
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <Link
                            href="/login"
                            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Paneli Keşfedin
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

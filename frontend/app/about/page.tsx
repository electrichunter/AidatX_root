import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function About() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            <Navbar />

            <section className="flex-1 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                            Hakkımızda
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Bina ve site yönetimini şeffaf, güvenilir ve zahmetsiz hale getirmek için yola çıktık.
                        </p>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Vizyonumuz</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            AidatX olarak vizyonumuz, teknolojinin gücünü kullanarak apartman ve site yönetim süreçlerini modernize etmektir. Geleneksel Excel tabloları ve kapı kapı dolaşılan aidat toplama devrini kapatıp, herkesin güvenle kullanabileceği dijital bir platform sunuyoruz. Amacımız, yöneticilerin iş yükünü hafifletirken kat sakinlerine şeffaf bir iletişim kanalı açmaktır.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Neden AidatX?</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-slate-600">
                            <div>
                                <h3 className="font-semibold text-blue-600 mb-2">Şeffaflık</h3>
                                <p className="text-sm leading-relaxed">Toplanan gelirlerin ve yapılan tüm masrafların her an herkes tarafından görüntülenebilir olmasını sağlarız. Güven ortamı oluştururuz.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-600 mb-2">Zaman Tasarrufu</h3>
                                <p className="text-sm leading-relaxed">Yöneticiler için saatler alan aidat takibi ve borçlu listesi hazırlama işlemlerini tek tıklamaya indirgeriz.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-600 mb-2">Erişilebilirlik</h3>
                                <p className="text-sm leading-relaxed">Bulut tabanlı mimarimiz sayesinde apartmanınızın finansal durumu ve duyurularına istediğiniz cihazdan, istediğiniz an ulaşabilirsiniz.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-600 mb-2">Kolay İletişim</h3>
                                <p className="text-sm leading-relaxed">Duyuru panoları ve sms/mail bildirimleri yerine sistem içi entegre iletişim araçlarıyla hızlı kararlar alınmasını kolaylaştırırız.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center bg-blue-50 border border-blue-100 rounded-2xl py-12 px-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Hemen Başlayın</h2>
                        <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                            Profesyonel yönetim araçlarıyla tanışın. Sitenizi daha akıllı yönetmeye bugün başlayın.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Yönetici Paneline Giriş
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

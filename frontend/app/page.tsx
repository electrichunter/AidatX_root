import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-32 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm mb-8 text-blue-700 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>AidatX v2.0 Yayında</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
          Profesyonel Bina Yönetimi.
        </h1>

        <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Apartman ve site yönetimini dijitalleştirin.
          Aidat tahsilatı, gelir-gider takibi ve şeffaf raporlama araçları
          ile kontrol tamamen sizin elinizde.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Yönetim Paneline Git
          </Link>
          <Link
            href="#features"
            className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition-colors shadow-sm"
          >
            Özellikleri İncele
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center text-slate-900">Her Şey Tek Bir Yerde.</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-slate-100 rounded-xl bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Kolay Tahsilat</h3>
              <p className="text-slate-600 leading-relaxed">Toplu aidat borçlandırması yapın ve ödemeleri anlık olarak sistem üzerinden takip edin.</p>
            </div>

            <div className="p-8 border border-slate-100 rounded-xl bg-slate-50 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Şeffaf Raporlar</h3>
              <p className="text-slate-600 leading-relaxed">Gelir-gider tablolarını ve borçlu listelerini tek tıklamayla oluşturup apartman sakinleriyle paylaşın.</p>
            </div>

            <div className="p-8 border border-slate-100 rounded-xl bg-slate-50 hover:border-amber-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Hızlı İletişim</h3>
              <p className="text-slate-600 leading-relaxed">Önemli duyuruları sisteme ekleyin, tüm site sakinlerinin aynı anda haberdar olmasını sağlayın.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function Footer() {
    return (
        <footer className="py-12 border-t border-slate-200 bg-white text-center text-sm text-slate-500">
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
                <p className="mb-4 text-slate-900 font-bold text-lg">AidatX Yönetim Sistemleri</p>
                <p>© {new Date().getFullYear()} AidatX. Tüm hakları saklıdır. Aidat hesaplama ve site yönetim yazılımı.</p>
            </div>
        </footer>
    );
}

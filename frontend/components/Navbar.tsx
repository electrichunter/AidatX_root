import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                            A
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">AidatX</span>
                    </Link>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                        Hakkımızda
                    </Link>
                    <Link href="/#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                        Özellikler
                    </Link>
                    <Link href="/login" className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                        Giriş Yap
                    </Link>
                </div>
            </div>
        </nav>
    );
}

# AidatX

AidatX, apartman ve site yönetimleri için geliştirilmiş modern, hızlı ve kullanıcı dostu bir yönetim aracıdır. Yönetim süreçlerini kolaylaştırmak için sıfır dikkat dağıtıcı (zero-distraction) Vercel stili arayüz tasarımı hedeflenerek oluşturulmuştur.

## 🚀 Teknolojiler
- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** FastAPI, Python, SQLAlchemy, JWT Authentication
- **Veritabanı:** MySQL
- **Önbellekleme:** Redis
- **Altyapı:** Docker & Docker Compose

## 🛠 Kurulum ve Çalıştırma

Proje Docker Compose ile kolayca ayağa kaldırılabilir şekilde yapılandırılmıştır.

```bash
# Depoyu klonlayın
git clone https://github.com/electrichunter/Aidatx.git

# Proje dizinine girin
cd AidatX_root

# Docker Compose ile tüm servisleri başlatın
docker-compose up -d --build
```

Servisler ayağa kalktığında aşağıdaki adreslerden erişebilirsiniz:
- **Frontend (Yönetici Paneli):** `http://localhost:3000`
- **Backend API:** `http://localhost:8000` (Swagger Dokümantasyonu: `http://localhost:8000/docs`)
- **phpMyAdmin:** `http://localhost:8080`

## 🌟 Temel Özellikler (Mevcut Durum)
* **Kullanıcı ve Rol Yönetimi:** JWT tabanlı güvenli giriş ve yetkilendirme sistemi.
* **Bina ve Daire Yönetimi:** Site, blok ve daire (alan, kat, doluluk durumu) kayıtlarının tutulması.
* **Aidat ve Kasa:** Dairelere periyodik aidat tahakkuk ettirilmesi ve alınan tahsilatların işlenmesi.
* **İletişim Sistemi:** Sakinlerin site yönetimiyle uygulama üzerinden iletişime geçmesi (`/contact`).

## 📋 Geliştirme Yol Haritası (Roadmap)
- [x] Faz 4: Backend Docker Servisleri, Login ve Güvenlik Altyapısı
- [x] Faz 6: İletişim Formları ve Rol Senaryoları
- [x] Faz 7: Vercel Tasarımlı Binalar ve Daireler Paneli
- [x] Faz 8: Aidat Tahakkuk ve Tahsilat Ekranlarının Tasarımı
- [ ] Faz 9: Sakin (Kullanıcı) Yönetimi ve Kapsamlı Finansal Raporlar
- [ ] Faz 10: Gider Yönetimi ve Bakım/Arıza Takip

## 📌 Lisans
Bu proje özel kullanım (Private) olarak listelenmiştir. İzinsiz kopyalanamaz veya çoğaltılamaz.

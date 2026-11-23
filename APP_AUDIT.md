# Audit Aplikasi SmartGym Mobile

Tanggal audit: 24 November 2026

## Ringkasan status

Kode terbaru telah memperbaiki beberapa area yang sebelumnya bermasalah:

- Data trainer pada halaman jadwal dan konfirmasi booking kini sebagian besar berasal dari Redux/API.
- Konfirmasi booking menerima parameter slot, tanggal, waktu, dan deskripsi dari halaman slot.
- Tombol reschedule kini kembali ke halaman jadwal sebelumnya.
- Kirim ulang OTP kini memanggil API forgot password dan mengatur ulang timer.
- Riwayat check-in, check-out, update profil, transaksi, dan pembayaran memiliki integrasi API yang sudah lebih lengkap.

Namun, aplikasi masih belum bebas dari error build dan masih memiliki beberapa fitur yang memakai data hardcoded atau tombol tanpa aksi.

## Belum terintegrasi dengan benar

- **AI Workout masih mock**, bukan integrasi AI sungguhan.
  - `generateAndSavePlan()` menunggu dua detik lalu membuat data workout tetap.
  - Rencana disimpan hanya ke SecureStore.
  - Tidak ada detail rencana, hapus rencana, atau sinkronisasi backend.
  - File terkait: `src/service/ai.service.ts:40`

- **Membership pada profil masih hardcoded**.
  - Nama SmartGym Elite Gold, billing tahunan, masa aktif 18 Desember 2025, dan benefit tidak berasal dari data user/API.
  - Tombol Perpanjang Sekarang menerima callback kosong.
  - File terkait:
    - `src/app/(gym)/navigation/profile.tsx:120`
    - `src/components/gym/membership/membershipActiveCard.tsx:35`
    - `src/components/gym/membership/membershipActiveCard.tsx:135`

- **MembershipCard dashboard masih berpotensi menampilkan tanggal tidak valid**.
  - Komponen membuat objek `Date` dari `membershipExpiredAt` yang mungkin kosong.
  - Status tampil selalu ACTIVE meskipun status membership aktual belum diverifikasi.
  - File terkait: `src/components/gym/dashboard/MembershipCard.tsx:4`

- **Digital Pass belum tersedia**.
  - Tombol “Lihat Digital Pass” pada detail transaksi tidak memiliki `onPress`.
  - Pesan UI menyebut menu Pass yang belum tersedia.
  - File terkait: `src/app/(gym)/profile/transactionDetail.tsx:320`

- **Filter riwayat transaksi masih placeholder**.
  - Tab Booking Trainer, Membership, periode, dan status belum memiliki state/filter.
  - Dropdown periode/status tidak membuka pilihan.
  - File terkait: `src/app/(gym)/profile/historyTransaction.tsx:56`

- **Beberapa aksi UI belum terhubung**:
  - Tombol notifikasi pada dashboard.
  - Concierge dan Personal Trainer VIP pada profil.
  - Tombol “Pindai otomatis” pada scanner QR.
  - Beberapa card statistik dashboard yang hanya UI.

- **Active check-in masih bergantung pada Redux lokal**.
  - Check-in disimpan ke Redux dan persistor, bukan sinkron penuh dari endpoint riwayat/check-in.
  - Setelah app mati dan dibuka kembali, status aktif dapat stale jika backend sudah checkout atau sesi kedaluwarsa.
  - File terkait:
    - `src/store/slice/checkinSlice.ts:1`
    - `src/store/store.ts`

## Bug yang terverifikasi

### Mencegah build atau typecheck

- **Nama fungsi export autentikasi tidak konsisten**.
  - Context mengimpor `LogoutAPI`, tetapi service mengekspor `logoutAPI`.
  - Reset password mengimpor `ResetPassword`, tetapi service mengekspor `resetPassword`.
  - OTP mengimpor atau mengekspor nama lama/baru yang tidak konsisten; perlu memastikan seluruh callsite menggunakan satu nama.
  - File terkait:
    - `src/context/authContext.tsx:2`
    - `src/app/(auth)/reset-password.tsx:5`
    - `src/service/auth.service.ts:16`

- **Route detail transaksi salah**.
  - Riwayat transaksi mengarahkan ke `/(gym)/profile/detailHistory`, tetapi route aktual bernama `transactionDetail`.
  - Ini menghasilkan error TypeScript pada typed routes.
  - File terkait:
    - `src/app/(gym)/profile/historyTransaction.tsx:38`
    - `src/app/(gym)/profile/transactionDetail.tsx:1`

- **Fixture transaksi memakai status lama**.
  - `dummyTransaction.ts` memakai `"PAID"` sedangkan type hanya menerima `"SUCCESS"`.
  - File terkait:
    - `src/data/dummyTransaction.ts:9`
    - `src/type/Transaction.type.ts:1`

- **TypeScript masih gagal**.
  - `npx tsc --noEmit` menemukan:
    - 1 nama `ResetPassword` yang tidak diekspor.
    - 1 nama `LogoutAPI` yang tidak diekspor.
    - 1 route `detailHistory` yang tidak terdaftar.
    - 3 status `"PAID"` yang tidak sesuai type.

### Validasi alur dan penanganan error

- **Konfirmasi booking belum memvalidasi `slotId`**.
  - `canSubmit` memeriksa trainer, metode pembayaran, checkbox, dan loading, tetapi tidak memeriksa `slotId`.
  - Booking dapat dipanggil meskipun slot tidak tersedia pada parameter navigasi.
  - File terkait: `src/app/(gym)/trainer/booking-confirm.tsx:80`

- **Konfirmasi membership belum memvalidasi paket dan pemilihan pembayaran**.
  - Tidak ada guard jika `id` tidak ditemukan atau Redux membership belum termuat.
  - Tidak ada loading/submitting state dan error API tidak ditampilkan sebagai toast.
  - File terkait: `src/app/(gym)/dashboard/membershipComfirm.tsx:33`

- **Konfirmasi booking tidak menampilkan error kepada pengguna**.
  - Error hanya dicetak ke console.
  - Pengguna tidak tahu apakah slot sudah penuh, booking gagal, atau server bermasalah.
  - File terkait: `src/app/(gym)/trainer/booking-confirm.tsx:83`

- **Auth error hanya dibaca di beberapa jalur**.
  - Refresh gagal sudah membersihkan sesi dan memanggil session-expired handler.
  - Beberapa callsite logout/reset/password masih memakai nama atau penanganan yang tidak konsisten.
  - File terkait:
    - `src/context/authContext.tsx:57`
    - `src/service/api.ts:88`

- **Async thunk dapat mengubah hasil menjadi fulfilled tanpa data**.
  - Catch pada membership, trainer, dan transaksi hanya log error lalu mengembalikan `undefined`.
  - Akibatnya `fulfilled` dapat menulis `undefined` ke state.
  - File terkait:
    - `src/store/slice/trainerSlice.ts:13`
    - `src/store/slice/membershipSlice.ts:18`
    - `src/store/slice/transactionSlice.ts:20`

- **Reset password memiliki nama komponen rendah/konvensi dan state mata terpisah**.
  - Tombol visibility konfirmasi perlu memastikan menggunakan `showConfirmPassword`, bukan `showPassword`.
  - Nama fungsi komponen sebaiknya diawali huruf kapital agar aturan React Hook jelas.
  - File terkait: `src/app/(auth)/reset-password.tsx:33`

- **OTP state email dapat hilang saat route dibuka langsung**.
  - `email` diambil dari parameter route. Jika pengguna refresh atau membuka route tanpa parameter, proses resend gagal aman.
  - File terkait: `src/app/(auth)/otp.tsx:35`

## Perbaikan yang sudah diterapkan pada kode terbaru

- Kirim ulang OTP sudah memanggil `forgotPassword(email)` dan memiliki state loading.
- Jadwal trainer menghitung status slot berdasarkan waktu sekarang.
- Konfirmasi trainer sudah menampilkan nama, pengalaman, spesialisasi, tanggal, waktu, dan durasi dari data/parameter.
- Tombol pilih ulang slot sudah menggunakan `router.back()`.
- Riwayat transaksi menggunakan endpoint API dan detail transaksi memiliki cek status, countdown, bayar lanjut, dan batal transaksi.
- Riwayat check-in mendukung pagination, refresh, dan infinite scroll.
- Pemilihan metode membership/trainer sudah mendukung QRIS dan bank.
- Update profil dan upload foto sudah terintegrasi dengan API.

## Saran

### Keandalan dan sinkronisasi data

- Sinkronkan active check-in dengan backend saat dashboard di-focus atau app kembali dari background.
- Sinkronkan membership aktif agar profile/dashboard tidak menampilkan informasi hardcoded.
- Gunakan `rejectWithValue` pada async thunk dan tampilkan state `error` serta retry.
- Tambahkan `AbortController` atau guard mounted untuk request yang dapat selesai setelah pengguna meninggalkan halaman.
- Pisahkan persisted Redux state: jangan persist data yang dapat berubah, misalnya active check-in atau membership, kecuali memang dibutuhkan offline.

### Integrasi fitur

- Hubungkan AI ke backend atau provider AI yang resmi, jangan hanya menghasilkan response statis.
- Tambahkan detail, hapus, dan reschedule untuk rencana AI.
- Implementasikan Digital Pass:
  - QR unik.
  - Masa berlaku.
  - Status membership.
  - Pencegahan screenshot QR atau mekanisme rotasi token.
- Tambahkan filter riwayat transaksi berdasarkan tipe, periode, dan status.
- Hubungkan notifikasi dan concierge/support ke endpoint atau jalur bantuan yang nyata.

### UX dan validasi

- Tambahkan loading button saat booking dan pembayaran.
- Tampilkan pesan error API pada membership, booking, reset password, OTP, dan transaksi.
- Tambahkan guard jika data paket, trainer, slot, atau `slotId` tidak tersedia.
- Tambahkan empty state yang jelas ketika daftar transaksi, check-in, membership, atau trainer kosong.
- Pastikan nama komponen diawali huruf kapital dan nama service/export konsisten.
- Tambahkan fallback gambar untuk trainer dan profile, bukan hanya membaca URL.

### Keamanan dan kualitas

- Pastikan refresh dan logout selalu menghapus seluruh token serta data user.
- Jangan menyimpan payload sensitif dalam log console.
- Tambahkan refresh token race handling; pengecekan 401 dan refresh sudah ada, tetapi perlu diuji pada beberapa request bersamaan.
- Gunakan HTTPS base URL yang sudah ada, tetapi hindari menyisipkan token melalui cookie/manual header dalam mode yang tidak perlu.
- Tambahkan test untuk:
  - Login, refresh, dan logout.
  - Booking slot yang valid/tidak valid.
  - Pembayaran pending/success/failure.
  - Route detail transaksi.
  - Checkout tanpa active check-in.

## Hasil validasi kode saat ini

- `npx tsc --noEmit`
  - Gagal dengan 6 error:
    - `ResetPassword` bukan export.
    - `LogoutAPI` bukan export.
    - `detailHistory` bukan route terdaftar.
    - 3 fixture `"PAID"` tidak sesuai type.

- `npx expo lint`
  - Tidak berhasil menyelesaikan instalasi config lint Expo secara otomatis.
  - Karena itu hasil lint sebelumnya tidak dijadikan hasil akhir untuk audit kode saat ini.

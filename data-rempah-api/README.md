# API Data Rempah
API ini adalah API CRUD buat database rempah aplikasi Spicify.

## Step by step pakai API ini
1. Clone repository ini, ketik `git clone https://github.com/spicefyapp/cloud-computing.git spicefy-api` di terminal (command prompt).
2. Masuk ke folder dengan perintah `cd spicefy-api/data-rempah-api` di terminal (command prompt).
3. Download file [.env](https://drive.google.com/file/d/1J0XuOYQBCiDK0NN1XhwNWN0iDdGDMrsy/view?usp=sharing) dan simpan di folder yang sama dengan API ini. Mohon dijaga kerahasiaan file ini soalnya ada konten instance cloud.
4. Run kode `npm init -y` di terminal.
5. Jalankan API pake perintah `node index.js`.
6. Aplikasi jalan di port 3000, atau bisa liat ketika server berhasil jalan akan nampilin port nya.

## Note Error:
* Kalo dapet error terkait credentials Google Cloud, [baca ini](https://cloud.google.com/docs/authentication/provide-credentials-adc).
* Kalo dapet error "ps1 cannot be loaded because running scripts is disabled on this system", [baca ini](https://stackoverflow.com/questions/41117421/ps1-cannot-be-loaded-because-running-scripts-is-disabled-on-this-system).

## Endpoints
* **/add** = buat nambahin data. API ini nerima 3 data, yaitu : name, description, image. Untuk 'image' itu pakai link GDrive buat sementara
* **/show** = buat nampilin semua data
* **/spice/[id]** = nampilin salah satu data berdasarkan id nya, buat sekarang (16/12/2023) datanya ada 25
* **/edit** = ngubah data, ditrigger pake id. List id dan rempahnya ada [di sini](https://drive.google.com/file/d/1Lx8b_gZCQFGRmpRbNQve__7s8G0xILWl/view?usp=sharing). Tapi itu gaada id nya, jadi itung sendiri ya :v
* **/delete** = menghapus data, tinggal pake id doang.

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Invoice - {{ $trx->shippingOrder->tracking_number }}</title>
    <style>
        @page {
            margin: 3mm;
        }

        body {
            font-family: sans-serif;
            font-size: 5px;
            margin: 0;
            padding: 0;
            word-wrap: break-word;
            /* background-image: url('{{ asset('img/label.png') }}'); */
            /* Mencegah teks overflow */
        }

        .old {
            width: 100%;
            border: 1px solid #000;
            padding: 3px;
            box-sizing: border-box;
            overflow: hidden;
            /* Agar tidak ada overflow */
            max-width: 100%;
            /* Batas lebar maksimal */
            page-break-inside: avoid;
            /* Hindari pemisahan elemen label saat print */
        }

        .label {
            position: relative;
            z-index: 1;
            background-color: white;
            border: 1px solid #000;
            padding: 3px;
            box-sizing: border-box;

            /* opsional */
        }

        .label::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('{{ public_path('storage/' . $setting->logo) }}');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 80px;
            opacity: 0.25;
            z-index: 0;
        }


        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            /* Membuat header fleksibel dan tidak overflow */
        }

        .header img {
            max-width: 45px;
            height: auto;
            /* Agar gambar tidak melebar */
        }

        .barcode {
            text-align: center;
            margin: 4px 0;
            word-wrap: break-word;
            /* Mencegah overflow pada barcode */
        }

        .barcode img {
            max-height: 30px;
        }

        .row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
        }

        /* Menata section agar setiap elemen di dalamnya memiliki padding yang cukup */
        .section {
            /* width: 50%; */
            /* Setiap section akan memiliki lebar 48%, jadi ada sedikit space antar mereka */
            font-size: 7px;
            /* Menyesuaikan ukuran font */
        }

        /* Styling tambahan agar ada sedikit ruang antara elemen dalam section */
        .section strong {
            font-weight: bold;
        }

        /* Responsif untuk ukuran lebih kecil */
        @media (max-width: 768px) {
            .row {
                flex-direction: column;
                /* Jika lebar layar kecil, ubah menjadi kolom */
            }

            .section {
                width: 100%;
                /* Setiap section akan mengisi 100% lebar pada perangkat kecil */
                margin-bottom: 10px;
            }
        }

        .info-table,
        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 3px;
            table-layout: fixed;
            /* Membatasi lebar kolom */
        }

        .info-table td,
        .product-table td,
        .product-table th {
            border: 1px solid #000;
            padding: 2px;
            word-wrap: break-word;
            /* Mencegah teks overflow di dalam tabel */
            max-width: 150px;
            /* Membatasi lebar kolom */
            text-overflow: ellipsis;
            /* Tambahkan ... jika teks terlalu panjang */
            overflow: hidden;
            /* Menyembunyikan teks yang meluap */
        }

        .barang-table {
            width: 100%;
            table-layout: fixed;
            /* Agar kolom lebih stabil */
            border-collapse: collapse;
            /* Menggabungkan border tabel */
        }

        .barang-table th,
        .barang-table td {
            border: 1px solid #000;
            /* Menambahkan border pada setiap kolom */
            padding: 2px;
            /* Memberikan padding agar isi tabel tidak terlalu rapat */
        }

        .barang-table .column-number {
            width: 30px;
            max-width: 20px;
            text-align: center;
            /* Agar nomor urut rata tengah */
        }



        .bold {
            font-weight: bold;
        }

        .small {
            font-size: 7px;
        }

        .barcode {
            text-align: center;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .barcode-image {
            max-width: 100%;
            height: auto;
            margin-bottom: 5px;
        }
    </style>

</head>

<body>
    <div class="label">
        <div style="position: relative; z-index: 1;">
            <center>
                <img src="{{ $trx->shippingOrder->barcode }}" width="200" style="height: 50px;width: 50px" height="100"
                    alt="Barcode" class="barcode-image">
                <br>
                <strong style="text-align: center;">{{ $trx->invoice_number }}</strong>
            </center>


            <div class="row">
                <table class="product-table">
                    <tr>
                        <th colspan="2">Penerima</th>
                    </tr>
                    <tr>
                        <th>Nama</th>
                        <td>{{ $trx->shippingOrder->recipient_name }}</td>
                    </tr>
                    <tr>
                        <th>Kota</th>
                        <td>{{ $trx->shippingOrder->destinationCity->kota }}</td>
                    </tr>
                    <tr>
                        <th>Alamat</th>
                        <td style="font-size: 5px;">{{ $trx->shippingOrder->recipient_address }}</td>
                    </tr>
                </table>
                <table class="product-table">
                    <tr>
                        <th colspan="2">Pengirim</th>
                    </tr>
                    <tr>
                        <th>Nama</th>
                        <td>{{ $trx->user->name }}</td>
                    </tr>
                    <tr>
                        <th>No.HP</th>
                        <td>{{ $trx->user->phone }}</td>
                    </tr>
                    <tr>
                        <th>Kota</th>
                        <td>{{ $trx->user->city->kota }}</td>
                    </tr>
                </table>
            </div>

            <div class="section"><strong>No. Pesanan:</strong> {{ $trx->shippingOrder->tracking_number }}</div>
            <br>
            <table class="barang-table">
                <thead>
                    <tr>
                        <th class="column-number">#</th>
                        <th>Nama Produk</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="column-number">1</td>
                        <td>{{ $trx->shippingOrder->nama_barang }}</td>
                    </tr>
                </tbody>
            </table>



            <div class="small">Pesan: {{ $trx->shippingOrder->notes }}</div>
        </div>
    </div>
</body>

</html>

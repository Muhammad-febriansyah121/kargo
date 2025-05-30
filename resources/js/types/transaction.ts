// Generated by https://quicktype.io

export interface TransactionType {
    id: number;
    user_id: number;
    shipping_order_id: number;
    invoice_number: string;
    payment_method: string;
    payment_url: string;
    status: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
    shipping_order: ShippingOrder;
    user: User;
}

export interface ShippingOrder {
    id: number;
    customer_id: number;
    origin_city_id: number;
    destination_city_id: number;
    shipping_rate_id: number;
    courier_id: null;
    pickup_courier_id: number | null;
    delivery_courier_id: number | null;
    driver_id: number | null;
    tracking_number: string;
    barcode: string;
    nama_barang: string;
    berat: number;
    panjang: number;
    lebar: number;
    tinggi: number;
    pickup_type: string;
    pickup_address: null | string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    payment_method: string;
    status: string;
    estimation_date: Date;
    notes: string;
    delivery_proof: null;
    created_at: Date;
    updated_at: Date;
    warehouse_id: null;
    origin_city: City;
    destination_city: City;
    shipping_rate: ShippingRate;
    transaction: null;
    customer: User;
    pickup_courier: User | null;
    delivery_courier: User | null;
    driver: User | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city_id: number;
    store: null | string;
    gender: string;
    vehicle_type: null | string;
    vehicle_number: null | string;
    role: string;
    image: string;
    created_at: Date;
    updated_at: Date;
    warehouse_id: number | null;
    city: City;
    warehouse: Warehouse | null;
}

export interface City {
    id: number;
    provinsi: Provinsi;
    kota: Kota;
    kecamatan: Kecamatan;
    kelurahan: Kelurahan;
    postal_code: number;
    created_at: null;
    updated_at: null;
}

export enum Kecamatan {
    Cibinong = "Cibinong",
    DenpasarUtara = "Denpasar Utara",
}

export enum Kelurahan {
    Pabuaran = "Pabuaran",
    Peguyangan = "Peguyangan",
    Ubung = "Ubung",
}

export enum Kota {
    Denpasar = "Denpasar",
    KabupatenBogor = "Kabupaten Bogor",
}

export enum Provinsi {
    Bali = "Bali",
    JawaBarat = "Jawa Barat",
}

export interface Warehouse {
    id: number;
    name: string;
    city_id: number;
    manager: string;
    address: string;
    created_at: Date;
    updated_at: Date;
    city: City;
}

export interface ShippingRate {
    id: number;
    shipping_service_id: number;
    shipping_zone_id: number;
    price_per_kg: number;
    price_per_volume: number;
    min_price: number;
    estimation_days_min: number;
    estimation_days_max: number;
    created_at: Date;
    updated_at: Date;
    shipping_service: ShippingService;
    shipping_zone: ShippingZone;
}

export interface ShippingService {
    id: number;
    name: string;
    desc: string;
    price: number;
    is_active: number;
    created_at: Date;
    updated_at: Date;
}

export interface ShippingZone {
    id: number;
    origin_city_id: number;
    destination_city_id: number;
    distance_km: number;
    created_at: Date;
    updated_at: Date;
    origin_city: City;
    destination_city: City;
}

import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Company = {
    id: number;
    company_name: string;
};

type Category = {
    id: number;
    category_name: string;
    daily_storage_rate: string | number;
};

type Bay = {
    id: number;
    bay_code: string;
    max_weight_kg: string | number;
    max_volume_cbm: string | number;
};

type Shipment = {
    id: number;
    sender_company_id: number;
    receiver_company_id: number;
    cargo_category_id: number;
    warehouse_bay_id: number;
    weight_kg: string | number;
    volume_cbm: string | number;
    arrival_date: string;
    dispatch_date: string | null;
    billing_statement?: {
        shipping_fee: string | number;
    } | null;
};

type Props = {
    shipment: Shipment;
    companies: Company[];
    categories: Category[];
    bays: Bay[];
};

type ShipmentForm = {
    sender_company_id: string;
    receiver_company_id: string;
    cargo_category_id: string;
    warehouse_bay_id: string;
    weight_kg: string;
    volume_cbm: string;
    arrival_date: string;
    dispatch_date: string;
    shipping_fee: string;
};

export default function EditShipment({
    shipment,
    companies,
    categories,
    bays,
}: Props) {
    const { data, setData, put, processing, errors } =
        useForm<ShipmentForm>({
            sender_company_id: String(shipment.sender_company_id),
            receiver_company_id: String(shipment.receiver_company_id),
            cargo_category_id: String(shipment.cargo_category_id),
            warehouse_bay_id: String(shipment.warehouse_bay_id),
            weight_kg: String(shipment.weight_kg),
            volume_cbm: String(shipment.volume_cbm),
            arrival_date: shipment.arrival_date?.slice(0, 10) ?? '',
            dispatch_date: shipment.dispatch_date?.slice(0, 10) ?? '',
            shipping_fee: String(
                shipment.billing_statement?.shipping_fee ?? 0,
            ),
        });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        put(`/shipments/${shipment.id}`);
    }

    const fieldClass =
        'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

    const labelClass = 'block text-sm font-semibold text-slate-700';

    function errorMessage(field: keyof ShipmentForm) {
        const message = errors[field];
        return message ? (
            <p className="mt-1 text-sm text-red-600">{message}</p>
        ) : null;
    }

    return (
        <>
            <Head title={`Edit Shipment #${shipment.id}`} />

            <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6">
                        <Link
                            href="/shipments"
                            className="text-sm font-medium text-blue-700 hover:underline"
                        >
                            ← Back to Shipments
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold text-slate-800">
                            Edit Shipment #{shipment.id}
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Update the cargo details below.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-xl bg-white p-5 shadow sm:p-8"
                    >
                        <section>
                            <h2 className="mb-4 text-lg font-bold text-slate-800">
                                Company Information
                            </h2>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Sender Company
                                    </label>
                                    <select
                                        required
                                        className={fieldClass}
                                        value={data.sender_company_id}
                                        onChange={(e) =>
                                            setData('sender_company_id', e.target.value)
                                        }
                                    >
                                        <option value="">Select sender</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.company_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errorMessage('sender_company_id')}
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Receiver Company
                                    </label>
                                    <select
                                        required
                                        className={fieldClass}
                                        value={data.receiver_company_id}
                                        onChange={(e) =>
                                            setData('receiver_company_id', e.target.value)
                                        }
                                    >
                                        <option value="">Select receiver</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.company_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errorMessage('receiver_company_id')}
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-lg font-bold text-slate-800">
                                Cargo and Warehouse
                            </h2>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Cargo Category</label>
                                    <select
                                        required
                                        className={fieldClass}
                                        value={data.cargo_category_id}
                                        onChange={(e) =>
                                            setData('cargo_category_id', e.target.value)
                                        }
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.category_name} — ₱
                                                {Number(category.daily_storage_rate).toFixed(2)}/day
                                            </option>
                                        ))}
                                    </select>
                                    {errorMessage('cargo_category_id')}
                                </div>

                                <div>
                                    <label className={labelClass}>Warehouse Bay</label>
                                    <select
                                        required
                                        className={fieldClass}
                                        value={data.warehouse_bay_id}
                                        onChange={(e) =>
                                            setData('warehouse_bay_id', e.target.value)
                                        }
                                    >
                                        <option value="">Select bay</option>
                                        {bays.map((bay) => (
                                            <option key={bay.id} value={bay.id}>
                                                {bay.bay_code} — Max{' '}
                                                {Number(bay.max_weight_kg).toLocaleString()} kg /{' '}
                                                {Number(bay.max_volume_cbm).toLocaleString()} CBM
                                            </option>
                                        ))}
                                    </select>
                                    {errorMessage('warehouse_bay_id')}
                                </div>

                                <div>
                                    <label className={labelClass}>Weight (kg)</label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        required
                                        className={fieldClass}
                                        value={data.weight_kg}
                                        onChange={(e) => setData('weight_kg', e.target.value)}
                                    />
                                    {errorMessage('weight_kg')}
                                </div>

                                <div>
                                    <label className={labelClass}>Volume (CBM)</label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        required
                                        className={fieldClass}
                                        value={data.volume_cbm}
                                        onChange={(e) => setData('volume_cbm', e.target.value)}
                                    />
                                    {errorMessage('volume_cbm')}
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-lg font-bold text-slate-800">
                                Receiving and Dispatch
                            </h2>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Arrival Date</label>
                                    <input
                                        type="date"
                                        required
                                        className={fieldClass}
                                        value={data.arrival_date}
                                        onChange={(e) => setData('arrival_date', e.target.value)}
                                    />
                                    {errorMessage('arrival_date')}
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Dispatch Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        min={data.arrival_date || undefined}
                                        className={fieldClass}
                                        value={data.dispatch_date}
                                        onChange={(e) => setData('dispatch_date', e.target.value)}
                                    />
                                    {errorMessage('dispatch_date')}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Shipping Fee (₱)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        className={fieldClass}
                                        value={data.shipping_fee}
                                        onChange={(e) => setData('shipping_fee', e.target.value)}
                                    />
                                    {errorMessage('shipping_fee')}
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                            <Link
                                href="/shipments"
                                className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Updating Shipment...' : 'Update Shipment'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

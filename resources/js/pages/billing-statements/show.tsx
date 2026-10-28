import { Head, Link } from '@inertiajs/react';

type Company = {
    id: number;
    company_name: string;
};

type CargoCategory = {
    id: number;
    category_name: string;
    daily_storage_rate: number | string;
};

type WarehouseBay = {
    id: number;
    bay_code: string;
};

type Shipment = {
    id: number;
    sender: Company;
    receiver: Company;
    cargo_category: CargoCategory;
    warehouse_bay: WarehouseBay;
    weight_kg: number | string;
    volume_cbm: number | string;
    arrival_date: string;
    dispatch_date: string | null;
};

type BillingStatement = {
    id: number;
    shipment_id: number;
    storage_fee: number | string;
    shipping_fee: number | string;
    total_cost: number | string;
    shipment: Shipment;
};

type Props = {
    statement: BillingStatement;
};

function money(value: number | string) {
    return Number(value).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
    });
}

export default function BillingStatementShow({ statement }: Props) {
    const shipment = statement.shipment;

    return (
        <>
            <Head title={`Billing Statement #${statement.id}`} />

            <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href="/billing-statements"
                        className="mb-6 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
                    >
                        <span aria-hidden="true">←</span>
                        Back to Billing Statements
                    </Link>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <header className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
                                    LWCRDS · Billing
                                </p>
                                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                                    Statement #{statement.id}
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    Shipment #{statement.shipment_id}
                                </p>
                            </div>

                            <span
                                className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${
                                    shipment.dispatch_date
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-900'
                                }`}
                            >
                                {shipment.dispatch_date
                                    ? 'Dispatched'
                                    : 'In Warehouse'}
                            </span>
                        </header>

                        <div className="space-y-8 p-6 sm:p-8">
                            <section>
                                <h2 className="mb-4 text-lg font-bold">
                                    Shipment Information
                                </h2>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Sender
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {shipment.sender?.company_name ?? 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Receiver
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {shipment.receiver?.company_name ?? 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Cargo Category
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {shipment.cargo_category?.category_name ?? 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Warehouse Bay
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {shipment.warehouse_bay?.bay_code ?? 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Weight
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {Number(shipment.weight_kg).toLocaleString()} kg
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Volume
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {Number(shipment.volume_cbm).toLocaleString()} CBM
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Arrival Date
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {shipment.arrival_date}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-600">
                                            Dispatch Date
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {shipment.dispatch_date ?? 'Not yet dispatched'}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="mb-4 text-lg font-bold">
                                    Billing Breakdown
                                </h2>

                                <div className="overflow-hidden rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
                                        <span className="text-slate-700">Storage Fee</span>
                                        <span className="font-semibold tabular-nums">
                                            {money(statement.storage_fee)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 p-4">
                                        <span className="text-slate-700">Shipping Fee</span>
                                        <span className="font-semibold tabular-nums">
                                            {money(statement.shipping_fee)}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        <span className="font-bold text-slate-900">
                                            Total Cost
                                        </span>
                                        <span className="text-2xl font-bold text-blue-800 tabular-nums">
                                            {money(statement.total_cost)}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <p className="text-sm text-slate-600">
                                This statement is automatically maintained by the shipment
                                billing system. Billing amounts are displayed for reference.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

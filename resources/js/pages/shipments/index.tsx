import { Head, Link, router } from '@inertiajs/react';


type Company = {
    id: number;
    company_name: string;
};

type CargoCategory = {
    id: number;
    category_name: string;
};

type WarehouseBay = {
    id: number;
    bay_code: string;
};

type BillingStatement = {
    storage_fee: string | number;
    shipping_fee: string | number;
    total_cost: string | number;
};

type Shipment = {
    id: number;
    sender?: Company | null;
    receiver?: Company | null;
    cargo_category?: CargoCategory | null;
    cargoCategory?: CargoCategory | null;
    warehouse_bay?: WarehouseBay | null;
    warehouseBay?: WarehouseBay | null;
    weight_kg: string | number;
    volume_cbm: string | number;
    arrival_date: string;
    dispatch_date: string | null;
    billing_statement?: BillingStatement | null;
    billingStatement?: BillingStatement | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedShipments = {
    data: Shipment[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type Filters = {
    search: string;
    status: string;
    arrival_date: string;
};

type Props = {
    shipments: PaginatedShipments;
    filters: Filters;
};

export default function ShipmentsIndex({ shipments, filters }: Props) {
    const money = (value: string | number | undefined) =>
        Number(value ?? 0).toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
        });

    const formatDate = (value: string | null | undefined) => {
        if (!value) return 'Not dispatched';

        const datePart = value.slice(0, 10);
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

        if (!match) return value;

        const [, year, month, day] = match;
        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
        );

        return date.toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const deleteShipment = (shipmentId: number) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete shipment #${shipmentId}? This action cannot be undone.`,
        );

        if (!confirmed) return;

        router.delete(`/shipments/${shipmentId}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
        
<Link
    href="/dashboard"
    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
>
    <span aria-hidden="true">←</span>
    Back to Dashboard
</Link>

            <Head title="Shipments" />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-[1600px]">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Shipment Management
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Manage cargo receiving, storage, and dispatch.
                            </p>
                        </div>

                        <Link
                            href="/shipments/create"
                            className="inline-flex justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            + Create Shipment
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-bold">
                            Search and Filter Shipments
                        </h2>

                        <form
                            method="GET"
                            action="/shipments"
                            className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-4"
                        >
                            <div>
                                <label
                                    htmlFor="search"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Search
                                </label>
                                <input
                                    id="search"
                                    type="search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="ID, sender, receiver, category..."
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Shipment Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={filters.status}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="all">All Shipments</option>
                                    <option value="stored">Currently Stored</option>
                                    <option value="dispatched">Dispatched</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="arrival_date"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Arrival Date
                                </label>
                                <input
                                    id="arrival_date"
                                    type="date"
                                    name="arrival_date"
                                    defaultValue={filters.arrival_date}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-800"
                                >
                                    Search
                                </button>

                                <Link
                                    href="/shipments"
                                    className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Clear
                                </Link>
                            </div>
                        </form>
                    </section>

                    {/* Results Summary */}
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-600">
                            Showing{' '}
                            <span className="font-semibold">
                                {shipments.from ?? 0}–{shipments.to ?? 0}
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold">
                                {shipments.total}
                            </span>{' '}
                            shipments
                        </p>

                        <p className="text-sm text-slate-500">
                            Page {shipments.current_page} of {shipments.last_page}
                        </p>
                    </div>

                    {/* Shipment Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1200px] table-auto text-left text-sm">
                                <thead className="bg-slate-800 text-white">
                                    <tr>
                                        <th className="whitespace-nowrap px-4 py-4">ID</th>
                                        <th className="px-4 py-4">Sender</th>
                                        <th className="px-4 py-4">Receiver</th>
                                        <th className="px-4 py-4">Category</th>
                                        <th className="whitespace-nowrap px-4 py-4">Bay</th>
                                        <th className="whitespace-nowrap px-4 py-4">Weight (kg)</th>
                                        <th className="whitespace-nowrap px-4 py-4">Volume (CBM)</th>
                                        <th className="whitespace-nowrap px-4 py-4">Arrival Date</th>
                                        <th className="whitespace-nowrap px-4 py-4">Dispatch Date</th>
                                        <th className="whitespace-nowrap px-4 py-4">Total Cost</th>
                                        <th className="whitespace-nowrap px-4 py-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                    {shipments.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={11}
                                                className="p-8 text-center text-slate-500"
                                            >
                                                <p className="font-medium">
                                                    No shipments match your search or filters.
                                                </p>
                                                <p className="mt-2 text-sm">
                                                    Try changing your search criteria or clearing the filters.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        shipments.data.map((shipment) => {
                                            const category =
                                                shipment.cargoCategory ??
                                                shipment.cargo_category;

                                            const bay =
                                                shipment.warehouseBay ??
                                                shipment.warehouse_bay;

                                            const billing =
                                                shipment.billingStatement ??
                                                shipment.billing_statement;

                                            return (
                                                <tr
                                                    key={shipment.id}
                                                    className="transition-colors hover:bg-slate-50"
                                                >
                                                    <td className="whitespace-nowrap px-4 py-4 font-medium">
                                                        {shipment.id}
                                                    </td>

                                                    <td className="max-w-48 px-4 py-4">
                                                        {shipment.sender?.company_name ?? '—'}
                                                    </td>

                                                    <td className="max-w-48 px-4 py-4">
                                                        {shipment.receiver?.company_name ?? '—'}
                                                    </td>

                                                    <td className="max-w-48 px-4 py-4">
                                                        {category?.category_name ?? '—'}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4">
                                                        {bay?.bay_code ?? '—'}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4 tabular-nums">
                                                        {Number(shipment.weight_kg).toLocaleString()}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4 tabular-nums">
                                                        {Number(shipment.volume_cbm).toLocaleString()}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4">
                                                        {formatDate(shipment.arrival_date)}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4">
                                                        {formatDate(shipment.dispatch_date)}
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4 font-semibold tabular-nums">
                                                        {money(billing?.total_cost)}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="whitespace-nowrap px-4 py-4">
                                                        <Link
                                                            href={`/shipments/${shipment.id}`}
                                                            className="font-semibold text-blue-700 hover:underline"
                                                        >
                                                            View
                                                        </Link>

                                                        <span className="px-1 text-slate-400">·</span>

                                                        <Link
                                                            href={`/shipments/${shipment.id}/edit`}
                                                            className="font-semibold text-emerald-700 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <span className="px-1 text-slate-400">·</span>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteShipment(shipment.id)}
                                                            className="font-semibold text-red-600 hover:text-red-800 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {shipments.last_page > 1 && (
                        <nav
                            aria-label="Shipment pagination"
                            className="mt-5 flex flex-wrap gap-2"
                        >
                            {shipments.links.map((link, index) => (
                                <Link
                                    key={`${index}-${link.label}`}
                                    href={link.url ?? '/shipments'}
                                    preserveScroll
                                    preserveState
                                    only={['shipments', 'filters']}
                                    className={`rounded-lg border px-3 py-2 text-sm ${
                                        link.active
                                            ? 'border-blue-700 bg-blue-700 text-white'
                                            : 'border-slate-300 bg-white text-slate-700'
                                    } ${
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : 'hover:bg-slate-100'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </nav>
                    )}

                    {/* Back to Dashboard */}
                    <div className="mt-6">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-blue-700 hover:underline"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}

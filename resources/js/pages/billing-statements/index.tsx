import { Head, Link } from '@inertiajs/react';

type Shipment = {
    id: number;
    sender?: { company_name: string };
    receiver?: { company_name: string };
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

type PaginatedStatements = {
    data: BillingStatement[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

type Props = {
    statements: PaginatedStatements;
};

function money(value: number | string) {
    return Number(value).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
    });
}

export default function BillingStatementsIndex({ statements }: Props) {
    return (
        <>
        
<Link
    href="/dashboard"
    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
>
    <span aria-hidden="true">←</span>
    Back to Dashboard
</Link>

            <Head title="Billing Statements" />

            <main className="min-h-screen bg-gray-100 p-4 text-gray-900 sm:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <header>
                        <h1 className="text-2xl font-bold">
                            Billing Statements
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            View shipment storage fees, shipping fees, and
                            total costs.
                        </p>
                    </header>

                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">Statement</th>
                                        <th className="px-4 py-3">Shipment</th>
                                        <th className="px-4 py-3">Sender</th>
                                        <th className="px-4 py-3">Receiver</th>
                                        <th className="px-4 py-3">Storage Fee</th>
                                        <th className="px-4 py-3">Shipping Fee</th>
                                        <th className="px-4 py-3">Total Cost</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {statements.data.length > 0 ? (
                                        statements.data.map((statement) => (
                                            <tr key={statement.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 font-medium">
                                                    #{statement.id}
                                                </td>
                                                <td className="px-4 py-4">
                                                    #{statement.shipment_id}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {statement.shipment?.sender?.company_name ?? '—'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {statement.shipment?.receiver?.company_name ?? '—'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {money(statement.storage_fee)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {money(statement.shipping_fee)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap font-bold">
                                                    {money(statement.total_cost)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                        statement.shipment?.dispatch_date
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {statement.shipment?.dispatch_date
                                                            ? 'Dispatched'
                                                            : 'In Warehouse'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Link
                                                        href={`/billing-statements/${statement.id}`}
                                                        className="font-semibold text-blue-700 hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                                                No billing statements found. Create a shipment first.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 p-4">
                            <p className="text-sm text-gray-600">
                                Total statements: {statements.total}
                            </p>

                            <nav className="flex flex-wrap gap-2">
                                {statements.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        className={`rounded border px-3 py-2 text-sm ${
                                            link.active
                                                ? 'border-blue-700 bg-blue-700 text-white'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

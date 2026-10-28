import { Head, Link, router } from '@inertiajs/react';

type Company = {
    id: number;
    company_name: string;
    sent_shipments_count: number;
    received_shipments_count: number;
};

type PageLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedCompanies = {
    data: Company[];
    links: PageLink[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    companies: PaginatedCompanies;
};

export default function CompaniesIndex({ companies }: Props) {
    function deleteCompany(company: Company) {
        const confirmed = window.confirm(
            `Delete "${company.company_name}"? This action cannot be undone.`,
        );

        if (confirmed) {
            router.delete(`/companies/${company.id}`);
        }
    }

    return (
        <>
        
<Link
    href="/dashboard"
    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
>
    <span aria-hidden="true">←</span>
    Back to Dashboard
</Link>

            <Head title="Company Management" />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Company Management
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Manage sender and receiver companies.
                            </p>
                        </div>

                        <Link
                            href="/companies/create"
                            className="rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white hover:bg-blue-800"
                        >
                            + Add Company
                        </Link>
                    </div>

                    <div className="mb-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-white p-5 shadow">
                            <p className="text-sm text-slate-500">
                                Total Companies
                            </p>
                            <p className="mt-2 text-3xl font-bold">
                                {companies.total}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow">
                            <p className="text-sm text-slate-500">
                                Current Page
                            </p>
                            <p className="mt-2 text-3xl font-bold">
                                {companies.current_page} of {companies.last_page}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-800 text-white">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Company Name</th>
                                        <th className="p-4">Sent Shipments</th>
                                        <th className="p-4">Received Shipments</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {companies.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="p-8 text-center text-slate-500"
                                            >
                                                No companies found. Select
                                                &quot;Add Company&quot; to
                                                create your first company.
                                            </td>
                                        </tr>
                                    ) : (
                                        companies.data.map((company) => (
                                            <tr
                                                key={company.id}
                                                className="border-b hover:bg-slate-50"
                                            >
                                                <td className="p-4">
                                                    {company.id}
                                                </td>
                                                <td className="p-4 font-semibold">
                                                    {company.company_name}
                                                </td>
                                                <td className="p-4">
                                                    {company.sent_shipments_count}
                                                </td>
                                                <td className="p-4">
                                                    {company.received_shipments_count}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-3">
                                                        <Link
                                                            href={`/companies/${company.id}`}
                                                            className="font-semibold text-blue-700 hover:underline"
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            href={`/companies/${company.id}/edit`}
                                                            className="font-semibold text-emerald-700 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteCompany(company)
                                                            }
                                                            className="font-semibold text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {companies.links.map((link, index) => (
                            <Link
                                key={`${index}-${link.label}`}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded border px-3 py-2 text-sm ${
                                    link.active
                                        ? 'border-blue-700 bg-blue-700 text-white'
                                        : 'border-slate-300 bg-white text-slate-700'
                                } ${
                                    !link.url
                                        ? 'pointer-events-none opacity-50'
                                        : 'hover:bg-slate-200'
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-5">
                        <Link
                            href="/dashboard"
                            className="text-sm text-blue-700 hover:underline"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}



import { Head, Link, router } from '@inertiajs/react';

type WarehouseBay = {
    id: number;
    bay_code: string;
    max_weight_kg: string;
    max_volume_cbm: string;
    occupied_shipments_count: number;
};

type PaginatedBays = {
    data: WarehouseBay[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

type Props = {
    bays: PaginatedBays;
};

export default function Index({ bays }: Props) {
    function deleteBay(id: number) {
        const confirmed = confirm(
            'Are you sure you want to delete this warehouse bay?'
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/warehouse-bays/${id}`, {
            preserveScroll: true,

            onStart: () => {
                console.log('Sending delete request for bay:', id);
            },

            onSuccess: () => {
                console.log('Delete request completed successfully.');
            },

            onError: (errors) => {
                console.error('Delete request validation errors:', errors);
                alert(
                    'The warehouse bay could not be deleted. Check the page for an error message.'
                );
            },

            onFinish: () => {
                console.log('Delete request finished.');
            },
        });
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

            <Head title="Warehouse Bays" />

            <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Warehouse Bays
                            </h1>

                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                Manage warehouse storage capacity and occupancy.
                            </p>
                        </div>

                        <Link
                            href="/warehouse-bays/create"
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            + Add Warehouse Bay
                        </Link>
                    </div>

                    <div className="overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-900">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                <tr>
                                    <th className="p-4">Bay Code</th>
                                    <th className="p-4">Max Weight (kg)</th>
                                    <th className="p-4">Max Volume (CBM)</th>
                                    <th className="p-4">Active Shipments</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bays.data.length > 0 ? (
                                    bays.data.map((bay) => (
                                        <tr
                                            key={bay.id}
                                            className="border-t border-gray-200 dark:border-gray-700"
                                        >
                                            <td className="p-4 font-semibold text-gray-900 dark:text-white">
                                                {bay.bay_code}
                                            </td>

                                            <td className="p-4 text-gray-700 dark:text-gray-300">
                                                {Number(
                                                    bay.max_weight_kg
                                                ).toLocaleString()}
                                            </td>

                                            <td className="p-4 text-gray-700 dark:text-gray-300">
                                                {Number(
                                                    bay.max_volume_cbm
                                                ).toLocaleString()}
                                            </td>

                                            <td className="p-4 text-gray-700 dark:text-gray-300">
                                                {bay.occupied_shipments_count}
                                            </td>

                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-3">
                                                    <Link
                                                        href={`/warehouse-bays/${bay.id}`}
                                                        className="font-medium text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </Link>

                                                    <Link
                                                        href={`/warehouse-bays/${bay.id}/edit`}
                                                        className="font-medium text-emerald-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteBay(bay.id)
                                                        }
                                                        className="font-medium text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No warehouse bays found. Add your
                                            first bay to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {bays.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded border px-3 py-2 text-sm ${
                                    link.active
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
                                } ${
                                    !link.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

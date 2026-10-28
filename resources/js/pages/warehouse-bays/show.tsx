
import { Head, Link } from '@inertiajs/react';

type Bay = {
    id: number;
    bay_code: string;
    max_weight_kg: string | number;
    max_volume_cbm: string | number;
};

type Props = {
    bay: Bay;
};

export default function Show({ bay }: Props) {
    return (
        <>
            <Head title="View Warehouse Bay" />

            <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-950">
                <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow dark:bg-gray-900">
                    <Link
                        href="/warehouse-bays"
                        className="text-blue-600 hover:underline"
                    >
                        ← Back to Warehouse Bays
                    </Link>

                    <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                        Warehouse Bay Details
                    </h1>

                    <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-200">
                        <p>
                            <strong>Bay Code:</strong> {bay.bay_code}
                        </p>
                        <p>
                            <strong>Maximum Weight:</strong> {bay.max_weight_kg} kg
                        </p>
                        <p>
                            <strong>Maximum Volume:</strong> {bay.max_volume_cbm} CBM
                        </p>
                    </div>

                    <Link
                        href={`/warehouse-bays/${bay.id}/edit`}
                        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                    >
                        Edit Bay
                    </Link>
                </div>
            </main>
        </>
    );
}

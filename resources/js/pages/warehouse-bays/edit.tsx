import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type WarehouseBay = {
    id: number;
    bay_code: string;
    max_weight_kg: string | number;
    max_volume_cbm: string | number;
};

type Props = {
    bay: WarehouseBay;
};

export default function Edit({ bay }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        bay_code: bay.bay_code,
        max_weight_kg: String(bay.max_weight_kg),
        max_volume_cbm: String(bay.max_volume_cbm),
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        put(`/warehouse-bays/${bay.id}`);
    }

    return (
        <>
            <Head title={`Edit ${bay.bay_code}`} />

            <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
                <div className="mx-auto max-w-2xl">
                    <Link
                        href={`/warehouse-bays/${bay.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Bay Details
                    </Link>

                    <div className="mt-5 rounded-xl bg-white p-6 shadow dark:bg-gray-900 sm:p-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Warehouse Bay
                        </h1>

                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Update the code and storage capacity for {bay.bay_code}.
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-5">
                            <div>
                                <label htmlFor="bay_code" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                                    Bay Code
                                </label>
                                <input
                                    id="bay_code"
                                    type="text"
                                    value={data.bay_code}
                                    onChange={(event) => setData('bay_code', event.target.value)}
                                    required
                                    maxLength={50}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                {errors.bay_code && (
                                    <p className="mt-1 text-sm text-red-600">{errors.bay_code}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="max_weight_kg" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                                    Maximum Weight (kg)
                                </label>
                                <input
                                    id="max_weight_kg"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={data.max_weight_kg}
                                    onChange={(event) => setData('max_weight_kg', event.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                {errors.max_weight_kg && (
                                    <p className="mt-1 text-sm text-red-600">{errors.max_weight_kg}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="max_volume_cbm" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                                    Maximum Volume (CBM)
                                </label>
                                <input
                                    id="max_volume_cbm"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={data.max_volume_cbm}
                                    onChange={(event) => setData('max_volume_cbm', event.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                {errors.max_volume_cbm && (
                                    <p className="mt-1 text-sm text-red-600">{errors.max_volume_cbm}</p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Warehouse Bay'}
                                </button>

                                <Link
                                    href={`/warehouse-bays/${bay.id}`}
                                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

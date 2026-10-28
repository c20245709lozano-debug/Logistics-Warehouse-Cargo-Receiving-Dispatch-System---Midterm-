
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        bay_code: '',
        max_weight_kg: '',
        max_volume_cbm: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/warehouse-bays');
    }

    return (
        <>
            <Head title="Add Warehouse Bay" />

            <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
                <div className="mx-auto max-w-2xl">
                    <Link
                        href="/warehouse-bays"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Warehouse Bays
                    </Link>

                    <div className="mt-5 rounded-xl bg-white p-6 shadow dark:bg-gray-900 sm:p-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Add Warehouse Bay
                        </h1>

                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Enter the warehouse bay code and its maximum storage capacity.
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="bay_code"
                                    className="mb-2 block font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Bay Code
                                </label>

                                <input
                                    id="bay_code"
                                    type="text"
                                    value={data.bay_code}
                                    onChange={(event) =>
                                        setData('bay_code', event.target.value)
                                    }
                                    placeholder="Example: BAY-001"
                                    required
                                    maxLength={50}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />

                                {errors.bay_code && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.bay_code}
                                    </p>
                                )}

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Bay codes will be converted to uppercase automatically.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="max_weight_kg"
                                    className="mb-2 block font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Maximum Weight (kg)
                                </label>

                                <input
                                    id="max_weight_kg"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={data.max_weight_kg}
                                    onChange={(event) =>
                                        setData('max_weight_kg', event.target.value)
                                    }
                                    placeholder="Example: 5000"
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />

                                {errors.max_weight_kg && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.max_weight_kg}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="max_volume_cbm"
                                    className="mb-2 block font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Maximum Volume (CBM)
                                </label>

                                <input
                                    id="max_volume_cbm"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={data.max_volume_cbm}
                                    onChange={(event) =>
                                        setData('max_volume_cbm', event.target.value)
                                    }
                                    placeholder="Example: 250"
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />

                                {errors.max_volume_cbm && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.max_volume_cbm}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Warehouse Bay'}
                                </button>

                                <Link
                                    href="/warehouse-bays"
                                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
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

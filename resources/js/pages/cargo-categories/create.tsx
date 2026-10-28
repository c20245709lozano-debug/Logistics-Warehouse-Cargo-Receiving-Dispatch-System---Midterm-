import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type CategoryForm = {
    category_name: string;
    daily_storage_rate: string;
};

export default function CreateCargoCategory() {
    const { data, setData, post, processing, errors } =
        useForm<CategoryForm>({
            category_name: '',
            daily_storage_rate: '0',
        });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/cargo-categories');
    }

    return (
        <>
            <Head title="Add Cargo Category" />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-8">
                <div className="mx-auto max-w-2xl">
                    <Link
                        href="/cargo-categories"
                        className="text-sm font-medium text-blue-700 hover:underline"
                    >
                        ← Back to Categories
                    </Link>

                    <div className="mb-6 mt-4">
                        <h1 className="text-3xl font-bold">
                            Add Cargo Category
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Register a cargo type and its daily storage rate.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-xl bg-white p-6 shadow sm:p-8"
                    >
                        <div>
                            <label
                                htmlFor="category_name"
                                className="block text-sm font-semibold"
                            >
                                Category Name
                            </label>
                            <input
                                id="category_name"
                                type="text"
                                value={data.category_name}
                                onChange={(event) =>
                                    setData('category_name', event.target.value)
                                }
                                maxLength={255}
                                required
                                placeholder="e.g. General Cargo"
                                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.category_name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.category_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="daily_storage_rate"
                                className="block text-sm font-semibold"
                            >
                                Daily Storage Rate
                            </label>
                            <input
                                id="daily_storage_rate"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.daily_storage_rate}
                                onChange={(event) =>
                                    setData(
                                        'daily_storage_rate',
                                        event.target.value,
                                    )
                                }
                                required
                                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.daily_storage_rate && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.daily_storage_rate}
                                </p>
                            )}
                            <p className="mt-1 text-sm text-slate-500">
                                Enter the storage charge per day in your chosen currency.
                            </p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href="/cargo-categories"
                                className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                            >
                                {processing ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

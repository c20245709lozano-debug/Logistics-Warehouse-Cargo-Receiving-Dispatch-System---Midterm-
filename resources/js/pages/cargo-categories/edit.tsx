import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Category = {
    id: number;
    category_name: string;
    daily_storage_rate: string | number;
};

type Props = {
    category: Category;
};

export default function CargoCategoryEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        category_name: category.category_name,
        daily_storage_rate: String(category.daily_storage_rate),
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        put(`/cargo-categories/${category.id}`);
    }

    return (
        <>
            <Head title={`Edit ${category.category_name}`} />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6">
                        <Link
                            href={`/cargo-categories/${category.id}`}
                            className="text-sm font-medium text-blue-700 hover:underline"
                        >
                            ← Back to Category Details
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold">
                            Edit Cargo Category
                        </h1>

                        <p className="mt-2 text-slate-600">
                            Update the category name and daily storage rate.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="rounded-xl bg-white p-6 shadow sm:p-8"
                    >
                        <div className="mb-6">
                            <label
                                htmlFor="category_name"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Category Name
                            </label>

                            <input
                                id="category_name"
                                type="text"
                                value={data.category_name}
                                onChange={(e) =>
                                    setData('category_name', e.target.value)
                                }
                                required
                                maxLength={255}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                            {errors.category_name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.category_name}
                                </p>
                            )}
                        </div>

                        <div className="mb-8">
                            <label
                                htmlFor="daily_storage_rate"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Daily Storage Rate
                            </label>

                            <input
                                id="daily_storage_rate"
                                type="number"
                                min="0"
                                max="9999999999.99"
                                step="0.01"
                                value={data.daily_storage_rate}
                                onChange={(e) =>
                                    setData(
                                        'daily_storage_rate',
                                        e.target.value,
                                    )
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                            {errors.daily_storage_rate && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.daily_storage_rate}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>

                            <Link
                                href={`/cargo-categories/${category.id}`}
                                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <Link
                                href="/cargo-categories"
                                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50"
                            >
                                Back to List
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

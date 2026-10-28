import { Head, Link } from '@inertiajs/react';

type Category = {
    id: number;
    category_name: string;
    daily_storage_rate: string | number;
};

type Props = {
    category: Category;
};

export default function CargoCategoryShow({ category }: Props) {
    return (
        <>
            <Head title={`Category: ${category.category_name}`} />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6">
                        <Link
                            href="/cargo-categories"
                            className="text-sm font-medium text-blue-700 hover:underline"
                        >
                            ← Back to Cargo Categories
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold">
                            Category Details
                        </h1>

                        <p className="mt-2 text-slate-600">
                            View the information for this cargo category.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow sm:p-8">
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Category ID
                                </p>
                                <p className="mt-1 text-lg font-semibold">
                                    {category.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Category Name
                                </p>
                                <p className="mt-1 text-lg font-semibold">
                                    {category.category_name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Daily Storage Rate
                                </p>
                                <p className="mt-1 text-lg font-semibold">
                                    {Number(
                                        category.daily_storage_rate,
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                            <Link
                                href={`/cargo-categories/${category.id}/edit`}
                                className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
                            >
                                Edit Category
                            </Link>

                            <Link
                                href="/cargo-categories"
                                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50"
                            >
                                Back to List
                            </Link>

                            <Link
                                href="/dashboard"
                                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

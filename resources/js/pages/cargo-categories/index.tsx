import { Head, Link, router } from '@inertiajs/react';

type Category = {
    id: number;
    category_name: string;
    daily_storage_rate: string | number;
};

type PageLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedCategories = {
    data: Category[];
    links: PageLink[];
    total: number;
    current_page: number;
    last_page: number;
};

type Props = {
    categories: PaginatedCategories;
};

export default function CargoCategoriesIndex({ categories }: Props) {
    function deleteCategory(category: Category) {
        if (
            window.confirm(
                `Delete "${category.category_name}"? This cannot be undone.`,
            )
        ) {
            router.delete(`/cargo-categories/${category.id}`);
        }
    }

    return (

        <>
            <Head title="Cargo Categories" />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-8">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Cargo Categories
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Manage cargo types and daily storage rates.
                            </p>
                        </div>

                        <Link
                            href="/cargo-categories/create"
                            className="rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white hover:bg-blue-800"
                        >
                            + Add Category
                        </Link>
                    </div>

                    <div className="mb-5 rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-slate-500">
                            Total Categories
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {categories.total}
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-xl bg-white shadow">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800 text-white">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Category Name</th>
                                    <th className="p-4">Daily Storage Rate</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-8 text-center text-slate-500"
                                        >
                                            No categories yet. Click Add
                                            Category to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.data.map((category) => (
                                        <tr
                                            key={category.id}
                                            className="border-b hover:bg-slate-50"
                                        >
                                            <td className="p-4">
                                                {category.id}
                                            </td>

                                            <td className="p-4 font-semibold">
                                                {category.category_name}
                                            </td>

                                            <td className="p-4">
                                                {Number(
                                                    category.daily_storage_rate,
                                                ).toFixed(2)}
                                            </td>

                                            <td className="p-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Link
                                                        href={`/cargo-categories/${category.id}`}
                                                        className="font-semibold text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </Link>

                                                    <Link
                                                        href={`/cargo-categories/${category.id}/edit`}
                                                        className="font-semibold text-green-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteCategory(
                                                                category,
                                                            )
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

                    <div className="mt-5 flex flex-wrap gap-2">
                        {categories.links.map((link, index) => (
                            <Link
                                key={`${index}-${link.label}`}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded border px-3 py-2 text-sm ${link.active
                                        ? 'border-blue-700 bg-blue-700 text-white'
                                        : 'border-slate-300 bg-white text-slate-700'
                                    } ${!link.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                    }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-6">
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

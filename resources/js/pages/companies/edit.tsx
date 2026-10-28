import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Company = {
    id: number;
    company_name: string;
};

type Props = {
    company: Company;
};

export default function CompanyEdit({ company }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: company.company_name,
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/companies/${company.id}`);
    }

    return (
        <>
            <Head title={`Edit ${company.company_name}`} />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <Link
                        href={`/companies/${company.id}`}
                        className="text-sm font-medium text-blue-700 hover:underline"
                    >
                        ← Back to Company Details
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold">
                        Edit Company
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Update the registered company's information.
                    </p>

                    <form
                        onSubmit={submit}
                        className="mt-6 rounded-xl bg-white p-6 shadow sm:p-8"
                    >
                        <div className="mb-8">
                            <label
                                htmlFor="company_name"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Company Name
                            </label>

                            <input
                                id="company_name"
                                type="text"
                                value={data.company_name}
                                onChange={(e) =>
                                    setData('company_name', e.target.value)
                                }
                                required
                                maxLength={255}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                            {errors.company_name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.company_name}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>

                            <Link
                                href={`/companies/${company.id}`}
                                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <Link
                                href="/companies"
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
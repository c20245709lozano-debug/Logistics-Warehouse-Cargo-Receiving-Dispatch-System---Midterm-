import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type CompanyForm = {
    company_name: string;
};

export default function CreateCompany() {
    const { data, setData, post, processing, errors } =
        useForm<CompanyForm>({
            company_name: '',
        });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/companies');
    }

    return (
        <>
            <Head title="Add Company" />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-8">
                <div className="mx-auto max-w-2xl">
                    <Link
                        href="/companies"
                        className="text-sm font-medium text-blue-700 hover:underline"
                    >
                        ← Back to Companies
                    </Link>

                    <div className="mb-6 mt-4">
                        <h1 className="text-3xl font-bold">
                            Add Company
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Register a company that can send or receive cargo.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="rounded-xl bg-white p-6 shadow sm:p-8"
                    >
                        <label
                            htmlFor="company_name"
                            className="block text-sm font-semibold text-slate-700"
                        >
                            Company Name
                        </label>

                        <input
                            id="company_name"
                            type="text"
                            value={data.company_name}
                            onChange={(event) =>
                                setData('company_name', event.target.value)
                            }
                            maxLength={255}
                            required
                            autoFocus
                            placeholder="Enter company name"
                            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />

                        {errors.company_name && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.company_name}
                            </p>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href="/companies"
                                className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                            >
                                {processing ? 'Saving...' : 'Save Company'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';

type Company = {
    id: number;
    company_name: string;
};

type Props = {
    company: Company;
};

export default function CompanyShow({ company }: Props) {
    return (
        <>
            <Head title={`Company: ${company.company_name}`} />

            <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <Link
                        href="/companies"
                        className="text-sm font-medium text-blue-700 hover:underline"
                    >
                        ← Back to Companies
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold">
                        Company Details
                    </h1>

                    <p className="mt-2 text-slate-600">
                        View the registered company's information.
                    </p>

                    <div className="mt-6 rounded-xl bg-white p-6 shadow sm:p-8">
                        <div className="mb-6">
                            <p className="text-sm text-slate-500">
                                Company ID
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {company.id}
                            </p>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm text-slate-500">
                                Company Name
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {company.company_name}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/companies/${company.id}/edit`}
                                className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
                            >
                                Edit Company
                            </Link>

                            <Link
                                href="/companies"
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

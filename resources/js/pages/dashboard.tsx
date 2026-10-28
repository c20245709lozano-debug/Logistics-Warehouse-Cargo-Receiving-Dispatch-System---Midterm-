import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type DashboardProps = {
    totalShipments: number;
    currentlyStored: number;
    dispatchedShipments: number;
    totalCompanies: number;
    totalCargoCategories: number;
    totalWarehouseBays: number;
    totalBilling: number | string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const quickLinks = [
    {
        title: 'Manage Shipments',
        description: 'Register, view, and update cargo shipments.',
        href: '/shipments',
        icon: '📦',
    },
    {
        title: 'Warehouse Bays',
        description: 'Manage bay codes and storage capacities.',
        href: '/warehouse-bays',
        icon: '🏭',
    },
    {
        title: 'Companies',
        description: 'Manage sender and receiver companies.',
        href: '/companies',
        icon: '🏢',
    },
    {
        title: 'Cargo Categories',
        description: 'Manage cargo types and daily storage rates.',
        href: '/cargo-categories',
        icon: '🗂️',
    },
    {
        title: 'Billing Statements',
        description: 'Review shipment storage and shipping costs.',
        href: '/billing-statements',
        icon: '🧾',
    },
];

export default function Dashboard({
    totalShipments,
    currentlyStored,
    dispatchedShipments,
    totalCompanies,
    totalCargoCategories,
    totalWarehouseBays,
    totalBilling,
}: DashboardProps) {
    const summaryCards = [
        {
            title: 'Total Shipments',
            value: totalShipments.toLocaleString(),
            description: 'All registered shipments',
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        },
        {
            title: 'Currently Stored',
            value: currentlyStored.toLocaleString(),
            description: 'Shipments awaiting dispatch',
            color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        },
        {
            title: 'Dispatched',
            value: dispatchedShipments.toLocaleString(),
            description: 'Shipments already dispatched',
            color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        },
        {
            title: 'Registered Companies',
            value: totalCompanies.toLocaleString(),
            description: 'Senders and receivers',
            color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
        },
        {
            title: 'Cargo Categories',
            value: totalCargoCategories.toLocaleString(),
            description: 'Registered cargo types',
            color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
        },
        {
            title: 'Warehouse Bays',
            value: totalWarehouseBays.toLocaleString(),
            description: 'Registered storage bays',
            color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
        },
        {
            title: 'Total Billing',
            value: Number(totalBilling).toLocaleString('en-PH', {
                style: 'currency',
                currency: 'PHP',
            }),
            description: 'Combined shipment billing costs',
            color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Welcome Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        LWCRDS Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Logistics Warehouse Cargo Receiving &amp; Dispatch System
                    </p>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Monitor your shipments, warehouse capacity, registered
                        companies, and billing statements in one place.
                    </p>
                </div>

                {/* Summary Cards */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        System Overview
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card) => (
                            <div
                                key={card.title}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                            >
                                <div
                                    className={`mb-4 inline-flex rounded-lg px-3 py-2 text-sm font-medium ${card.color}`}
                                >
                                    {card.title}
                                </div>

                                <p className="break-words text-2xl font-bold text-gray-900 dark:text-white">
                                    {card.value}
                                </p>

                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {card.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Links */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Quick Access
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Quickly navigate to the main system modules.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.title}
                                href={link.href}
                                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl dark:bg-gray-800">
                                        {link.icon}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                            {link.title}
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                            {link.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                                    Open module →
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Getting Started */}
                <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
                    <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                        Getting Started
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-blue-800 dark:text-blue-300">
                        Register your companies and cargo categories first.
                        Configure your warehouse bays and their storage
                        capacities, then create shipment records. Use the
                        billing module to review the costs generated for each
                        shipment.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                            href="/shipments/create"
                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Register Shipment
                        </Link>

                        <Link
                            href="/companies/create"
                            className="inline-flex items-center rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-gray-900 dark:text-blue-300 dark:hover:bg-gray-800"
                        >
                            Add Company
                        </Link>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

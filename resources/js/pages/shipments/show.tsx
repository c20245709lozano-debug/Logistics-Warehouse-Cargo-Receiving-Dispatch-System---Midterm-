import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Company = {
    id: number;
    company_name: string;
};

type CargoCategory = {
    id: number;
    category_name: string;
    daily_storage_rate: number | string;
};

type WarehouseBay = {
    id: number;
    bay_code: string;
    max_weight_kg: number | string;
    max_volume_cbm: number | string;
};

type BillingStatement = {
    id: number;
    storage_fee: number | string;
    shipping_fee: number | string;
    total_cost: number | string;
};

type Shipment = {
    id: number;
    sender: Company;
    receiver: Company;
    cargo_category: CargoCategory;
    warehouse_bay: WarehouseBay;
    weight_kg: number | string;
    volume_cbm: number | string;
    arrival_date: string;
    dispatch_date: string | null;
    billing_statement: BillingStatement | null;
};

type Props = {
    shipment: Shipment;
};

function money(value: number | string | undefined): string {
    return Number(value ?? 0).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
    });
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div>
            <dt className="text-sm font-medium text-gray-600">{label}</dt>
            <dd className="mt-1 break-words text-base font-semibold text-gray-900">
                {value}
            </dd>
        </div>
    );
}

export default function ShowShipment({ shipment }: Props) {
    const [dispatchDate, setDispatchDate] = useState(
        shipment.dispatch_date?.slice(0, 10) ??
            new Date().toLocaleDateString('en-CA'),
    );

    const [processing, setProcessing] = useState(false);

    function dispatchShipment() {
        if (shipment.dispatch_date || processing) {
            return;
        }

        if (!dispatchDate) {
            window.alert('Please select a dispatch date.');
            return;
        }

        if (dispatchDate < shipment.arrival_date.slice(0, 10)) {
            window.alert(
                'Dispatch date cannot be earlier than the arrival date.',
            );
            return;
        }

        const confirmed = window.confirm(
            `Dispatch shipment #${shipment.id} on ${dispatchDate}? The billing statement will be recalculated.`,
        );

        if (!confirmed) {
            return;
        }

        setProcessing(true);

        router.put(
            `/shipments/${shipment.id}`,
            {
                sender_company_id: shipment.sender.id,
                receiver_company_id: shipment.receiver.id,
                cargo_category_id: shipment.cargo_category.id,
                warehouse_bay_id: shipment.warehouse_bay.id,
                weight_kg: shipment.weight_kg,
                volume_cbm: shipment.volume_cbm,
                arrival_date: shipment.arrival_date.slice(0, 10),
                dispatch_date: dispatchDate,
                shipping_fee:
                    shipment.billing_statement?.shipping_fee ?? 0,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    }

    const billing = shipment.billing_statement;

    return (
        <>
            <Head title={`Shipment #${shipment.id}`} />

            <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Page heading */}
                    <header className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Shipment #{shipment.id}
                            </h1>

                            <p className="mt-1 text-sm text-gray-600">
                                Shipment details and dispatch management
                            </p>
                        </div>

                        <Link
                            href="/shipments"
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                        >
                            Back to Shipments
                        </Link>
                    </header>

                    {/* Shipment information */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="mb-5 text-lg font-bold text-gray-900">
                            Shipment Information
                        </h2>

                        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <Detail
                                label="Sender"
                                value={
                                    shipment.sender?.company_name ?? '—'
                                }
                            />

                            <Detail
                                label="Receiver"
                                value={
                                    shipment.receiver?.company_name ?? '—'
                                }
                            />

                            <Detail
                                label="Cargo Category"
                                value={
                                    shipment.cargo_category?.category_name ??
                                    '—'
                                }
                            />

                            <Detail
                                label="Warehouse Bay"
                                value={
                                    shipment.warehouse_bay?.bay_code ?? '—'
                                }
                            />

                            <Detail
                                label="Weight"
                                value={`${shipment.weight_kg} kg`}
                            />

                            <Detail
                                label="Volume"
                                value={`${shipment.volume_cbm} CBM`}
                            />

                            <Detail
                                label="Arrival Date"
                                value={shipment.arrival_date.slice(0, 10)}
                            />

                            <Detail
                                label="Dispatch Date"
                                value={
                                    shipment.dispatch_date
                                        ? shipment.dispatch_date.slice(0, 10)
                                        : 'Not yet dispatched'
                                }
                            />
                        </dl>
                    </section>

                    {/* Dispatch management */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-bold text-gray-900">
                            Dispatch Management
                        </h2>

                        {shipment.dispatch_date ? (
                            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                <p className="font-semibold text-green-900">
                                    Shipment Dispatched
                                </p>

                                <p className="mt-1 text-sm text-green-800">
                                    This shipment was dispatched on{' '}
                                    {shipment.dispatch_date.slice(0, 10)}.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-700">
                                    Select the date the cargo leaves the
                                    warehouse.
                                </p>

                                <div className="max-w-xs">
                                    <label
                                        htmlFor="dispatch_date"
                                        className="mb-1 block text-sm font-medium text-gray-800"
                                    >
                                        Dispatch Date
                                    </label>

                                    <input
                                        id="dispatch_date"
                                        type="date"
                                        min={shipment.arrival_date.slice(0, 10)}
                                        value={dispatchDate}
                                        onChange={(event) =>
                                            setDispatchDate(
                                                event.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={dispatchShipment}
                                    disabled={processing || !dispatchDate}
                                    className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Dispatching...'
                                        : 'Dispatch Shipment'}
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Billing statement */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="mb-5 text-lg font-bold text-gray-900">
                            Billing Statement
                        </h2>

                        {billing ? (
                            <>
                                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-600">
                                            Storage Fee
                                        </dt>

                                        <dd className="mt-1 text-xl font-bold text-gray-900">
                                            {money(billing.storage_fee)}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-600">
                                            Shipping Fee
                                        </dt>

                                        <dd className="mt-1 text-xl font-bold text-gray-900">
                                            {money(billing.shipping_fee)}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-600">
                                            Total Cost
                                        </dt>

                                        <dd className="mt-1 text-xl font-bold text-blue-800">
                                            {money(billing.total_cost)}
                                        </dd>
                                    </div>
                                </dl>

                                <p className="mt-5 border-t border-gray-200 pt-4 text-xs text-gray-600">
                                    Billing amounts are based on the saved
                                    shipment and its billing statement.
                                </p>
                            </>
                        ) : (
                            <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                                No billing statement is available for this
                                shipment yet.
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

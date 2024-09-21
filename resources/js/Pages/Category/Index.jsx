import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AuthenticatedLayout
            header={ <Header /> }
        >
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Header() {
    return (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Categories
        </h2>
    );
}

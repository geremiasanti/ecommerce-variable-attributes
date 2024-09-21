import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { Head } from '@inertiajs/react';

export default function Index({categoriesPaginated}) {
    return (
        <AuthenticatedLayout header={<Header />}>
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <CategoriesList categories={categoriesPaginated.data} />
                    <Pagination links={categoriesPaginated.meta.links} />
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

function CategoriesList({categories}) {
    const categoriesRows = categories.map(category =>
        <CategoryRow key={category.id} category={category} />
    )
    return <ul>{categoriesRows}</ul>;
}

function CategoryRow({category}) {
    // todo make it expandable
    // todo add image
    return (
        <li className="m-2 p-2 bg-white shadow sm:rounded-lg">
            {category.name}
        </li>
    );
}

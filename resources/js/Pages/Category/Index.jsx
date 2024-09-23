import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import { Head, router } from '@inertiajs/react';

export default function Index({categoriesPaginated, queryParams}) {
    queryParams ||= {};

    const filterInputChanged = (value) => {
        if(value) {
            console.log(value);
            queryParams['filter'] = value;
        } else {
            delete queryParams['filter'];
        }

        router.get(route('categories.index'), queryParams, {
            preserveState: true,
            replace: true
        });
    }

    const onEnter = () => {
        console.log('invio')
    }

    return (
        <AuthenticatedLayout header={<Header />}>
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        <nav className="text-center">
                            <TextInput
                                placeholder="Filter..."
                                defaultValue={queryParams.filter}
                                onKeyUp={e => filterInputChanged(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' ? onEnter() : undefined}
                            />
                        </nav>
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
    return (
        <li className="flex m-2 p-2 bg-white shadow rounded-lg">
            <img className="w-10 md:w-20 rounded-l-lg m-2" src={category.image_path} />
            <span className="my-auto text-3xl m-2 ">{category.name}</span>
        </li>
    );
}

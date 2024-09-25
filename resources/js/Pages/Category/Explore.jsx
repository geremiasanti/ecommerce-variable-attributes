import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({placeHolderUri, categoriesPaginated, queryParams}) {
    queryParams ||= {};

    const filterInputChanged = (value) => {
        if(value) {
            queryParams['filter'] = value;
        } else {
            delete queryParams['filter'];
        }

        queryParams['page'] = 1;

        router.get(route('explore'), queryParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true
        });
    }

    return (
        <AuthenticatedLayout header={<Header />}>
            <Head title="Explore" />

            <div className="py-6 text-gray-800">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <nav className="text-center">
                        <TextInput
                            placeholder="Filter..."
                            defaultValue={queryParams.filter}
                            onKeyUp={e => filterInputChanged(e.target.value)}
                        />
                    </nav>
                    <CategoriesList
                        categories={categoriesPaginated.data}
                        placeHolderUri={placeHolderUri}
                    />
                    <Pagination links={categoriesPaginated.meta.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Header() {
    return (
        <div className="flex items-center">
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Choose a category
            </h2>
        </div>
    );
}

function CategoriesList({categories, placeHolderUri}) {
    if(categories.length == 0) {
        return <div className="text-xl text-gray-500 text-center p-6">No results found</div>;
    }

    const categoriesRows = categories.map(category =>
        <CategoryRow
            key={category.id}
            category={category}
            placeHolderUri={placeHolderUri}
        />
    )
    return <ul>{categoriesRows}</ul>;
}

function CategoryRow({category, placeHolderUri}) {
    return (
        <Link
            href={route('categories.show', category.id)}
        >
            <li className="h-10 md:h-20 flex bg-white hover:bg-gray-200 shadow-xl rounded-lg mb-1 md:mb-2 p-1 md:p-2">
                <img className="w-10 md:w-20 rounded-l-lg" src={category.image_path || placeHolderUri} />
                <span className="text-l md:text-3xl truncate my-auto mx-4">{category.name}</span>
                <span
                    className="text-gray-800  inline-flex items-center p-4 ml-auto"
                >
                    <svg className="fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </span>
            </li>
        </Link>
    );
}

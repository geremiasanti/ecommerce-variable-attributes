import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({placeHolderUri, categoriesPaginated, queryParams, success}) {
    queryParams ||= {};

    const filterInputChanged = (value) => {
        if(value) {
            queryParams['filter'] = value;
        } else {
            delete queryParams['filter'];
        }

        queryParams['page'] = 1;

        router.get(route('categories.index'), queryParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true
        });
    }

    const deleteCategory = (category) => {
        if(!window.confirm("Delete category? This operation cannot be undone."))
            return

        router.delete(route('categories.destroy', category.id), {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    }

    return (
        <AuthenticatedLayout header={<Header />}>
            <Head title="Categories" />

            <div className="py-6 text-gray-800">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {success}
                        </div>
                    )}
                    <nav className="text-center">
                        <TextInput
                            placeholder="Filter..."
                            defaultValue={queryParams.filter}
                            onKeyUp={e => filterInputChanged(e.target.value)}
                        />
                    </nav>
                    <CategoriesList
                        categories={categoriesPaginated.data}
                        onCategoryDelete={deleteCategory}
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
                Categories
            </h2>
            <Link
                href={route('categories.create')}
                className="text-white bg-green-600 md:bg-green-500 hover:bg-green-600 text-font-bold p-3 rounded inline-flex items-center ml-auto"
            >
                <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" stroke="white" strokeWidth="2"/>
                </svg>
              <span className="ml-2 hidden md:flex">New</span>
            </Link>
        </div>
    );
}

function CategoriesList({categories, onCategoryDelete, placeHolderUri}) {
    if(categories.length == 0) {
        return <div className="text-xl text-gray-500 text-center p-6">No results found</div>;
    }

    const categoriesRows = categories.map(category =>
        <CategoryRow
            key={category.id}
            category={category}
            onCategoryDelete={onCategoryDelete}
            placeHolderUri={placeHolderUri}
        />
    )
    return <ul>{categoriesRows}</ul>;
}

function CategoryRow({category, onCategoryDelete, placeHolderUri}) {
    return (
        <li className="h-10 md:h-20 flex bg-white shadow-xl rounded-lg mb-1 md:mb-2 p-1 md:p-2">
            <img className="w-10 md:w-20 rounded-l-lg" src={category.image_path || placeHolderUri} />
            <span className="text-l md:text-3xl truncate my-auto mx-4">{category.name}</span>
            <Link
                href={route('categories.edit', category.id)}
                className="text-white bg-blue-600 md:bg-blue-500 hover:bg-blue-600 text-font-bold rounded inline-flex items-center mr-1 md:mr-2 md:my-2 ml-auto p-2"
            >
                <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                </svg>
              <span className="ml-2 hidden md:flex">Edit</span>
            </Link>
            <button
                onClick={() => onCategoryDelete(category)}
                className="text-white bg-red-600 md:bg-red-500 hover:bg-red-600 text-font-bold rounded inline-flex items-center md:my-2 p-2"
            >
                <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg>
              <span className="ml-2 hidden md:flex">Delete</span>
            </button>
        </li>
    );
}

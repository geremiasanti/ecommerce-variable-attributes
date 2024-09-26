import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({placeHolderUri, category, products, queryParams, attributes}) {
    queryParams ||= {};

    queryParams.attributes = attributes.map((attribute) => ({
        categoryAttributeId: attribute.categoryAttribute.data.id,
        name: attribute.categoryAttribute.data.name,
        type: attribute.categoryAttribute.data.type.name,
        min: attribute.min || null,
        max: attribute.max || null,
        options: attribute.options ? attribute.options : null,
    }));

    const debounce = (callback, wait) => {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback(...args);
            }, wait);
        };
    }

    const getWithFilters = (queryParams) => {
        queryParams['page'] = 1;

        const attributes = queryParams.attributes
        delete queryParams.attributes

        attributes.forEach((a) => {
            queryParams[`${a.categoryAttributeId}_min`] = a.min;
            queryParams[`${a.categoryAttributeId}_max`] = a.max;
        })

        router.get(route('categories.show', category.data.id), queryParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true
        });
    }

    const filterInputChanged = (value) => {
        if(value) {
            queryParams['filter'] = value;
        } else {
            delete queryParams['filter'];
        }

        getWithFilters(queryParams);
    }

    const attributeFilterInputChanged = debounce((categoryAttributeId, value, isMin = true) => {
        if(!value) {
            const categoryAttribute = attributes.find((att) =>
                att.categoryAttribute.data.id == categoryAttributeId
            )
            value = isMin ? categoryAttribute.min : categoryAttribute.max;
        }

        queryParams.attributes.forEach((param) => {
            if(param.categoryAttributeId === categoryAttributeId)
                if(isMin)
                    param.min = value;
                else
                    param.max = value;
        });
        getWithFilters(queryParams);
    }, 250);

    const filters = queryParams.attributes.map((attribute) => {
        if(attribute.type === "Integer" || attribute.type === "Decimal") {
            return <NumberFilter
                key={attribute.categoryAttributeId}
                onAttributeFilterChange={attributeFilterInputChanged}
                attribute={attribute}
            />
        }
    });

    return (
        <AuthenticatedLayout header={<Header categoryName={category.data.name}/>}>
            <Head title="Explore" />
            <div className="w-full flex max-h-svh">
                <div key="sidebar" className="h-100 flex-[0.3]">
                    <div key="filters" className="grid grid-cols-2 h-full content-start bg-white shadow">
                        {filters}
                    </div>
                </div>
                <div key="main" className="h-full flex-1">
                    <div className="py-6 text-gray-800">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                            <nav className="text-center">
                                <TextInput
                                    placeholder="Filter..."
                                    defaultValue={queryParams.filter}
                                    onKeyUp={e => filterInputChanged(e.target.value)}
                                />
                            </nav>
                            <ProductsList
                                products={products}
                                placeHolderUri={placeHolderUri}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Header({categoryName}) {
    return (
        <div className="flex items-center">
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {categoryName}
            </h2>
        </div>
    );
}

function ProductsList({products, placeHolderUri}) {
    if(products.length == 0) {
        return <div className="text-xl text-gray-500 text-center p-6">No results found</div>;
    }

    const productsRows = products.map(product =>
        <ProductRow
            key={product.id}
            product={product}
            placeHolderUri={placeHolderUri}
        />
    )
    return <ul>{productsRows}</ul>;
}

function ProductRow({product, placeHolderUri}) {
    const productAttributes = product.attributes
        .sort((a,b) => a.category_attribute.name.localeCompare(b.category_attribute.name))
        .filter((attribute) => attribute.value)
        .map((attribute) =>
            <div key={attribute.category_attribute.name}>
                <span className="font-bold">{attribute.category_attribute.name}:&nbsp;</span>
                <span>{attribute.value}&nbsp;</span>
                <span>{attribute.category_attribute.unit}</span>
            </div>
        );

    return (
        <li className="flex-wrap bg-white hover:bg-gray-200 shadow-xl rounded-lg mb-1 md:mb-2 p-1 md:p-2">
            <div className="flex w-full">
                <img className="w-10 md:w-20 rounded-l-lg" src={product.image_path || placeHolderUri} />
                <span className="text-l md:text-3xl truncate my-auto mx-4">{product.name}</span>
                <span className="text-l text-gray-600 md:text-3xl truncate my-auto ml-auto mx-4">{product.price}&nbsp;€</span>
            </div>
            <div className="text-gray-600 pt-3">
                {productAttributes}
            </div>
        </li>
    );
}

function NumberFilter({attribute, onAttributeFilterChange}) {
    return <>
        <div key="label" className="p-2 col-span-2">
            <span className="font-bold">{attribute.name}</span>
        </div>
        <div key="min" className="px-1">
            <InputLabel key="label" value="Min" />
            <TextInput
                key="input"
                className="w-full"
                defaultValue={attribute.min}
                onKeyUp={e => onAttributeFilterChange(
                    attribute.categoryAttributeId,
                    e.target.value,
                    true
                )}
            />
        </div>
        <div key="max" className="px-1">
            <InputLabel key="label" value="Max" />
            <TextInput
                key="input"
                className="w-full"
                defaultValue={attribute.max}
                onKeyUp={e => onAttributeFilterChange(
                    attribute.categoryAttributeId,
                    e.target.value,
                    false
                )}
            />
        </div>
    </>
}

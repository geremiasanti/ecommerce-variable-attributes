import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';

import { Head, useForm, router } from '@inertiajs/react';

export default function Edit({product, categories}) {
    console.log(product);
    const {data, setData, post, errors, reset} = useForm({
        category_id: product.data.category.id,
        name: product.data.name,
        image: '',
        price: product.data.price,
        image_path: product.data.image_path || '',
        attributes: product.data.attributes,
        _method: 'PUT'
    })
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('products.update', product.data.id), {
            forceFormData: true
        });
    }

    const deleteProduct = (product) => {
        if(!window.confirm("Delete product? This operation cannot be undone."))
            return

        router.delete(route('products.destroy', product.data.id));
    }

    const categoryOptions = [
        <option key="empty" value="" data-unit="0"></option>,
        ...categories.data.map(category =>
            <option key={category.id} value={category.id} data-unit={category.can_have_unit}>
                {category.name}
            </option>
        )
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit product</h2>
                    <button
                        onClick={() => deleteProduct(product)}
                        className="text-white bg-red-600 md:bg-red-500 hover:bg-red-600 text-font-bold p-3 rounded inline-flex items-center ml-auto"
                    >
                        <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                        <span className="ml-2 hidden md:flex">Delete product</span>
                    </button>
                </div>
            }
        >
            <Head title={product.data.name} />

            <div className="py-12 text-gray-800">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <h2 className="font-semibold text-l leading-tight mx-5">Product</h2>
                    <div className="p-4 sm:p-8 mb-2 bg-white shadow sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                        >
                            <div className="m-2">
                                <InputLabel htmlFor="category_id" value="Category" />

                                <SelectInput
                                    name=""
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="my-1 block w-full"
                                    required
                                >
                                    {categoryOptions}
                                </SelectInput>

                                <InputError className="mt-2" message={errors.category_id} />
                            </div>
                            <div className="m-2">
                                <InputLabel htmlFor="name" value="Name" />

                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="my-1 block w-full"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>
                            <div className="m-2">
                                <InputLabel htmlFor="price" value="Price (EUR)" />

                                <TextInput
                                    id="price"
                                    type="number"
                                    step=".01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                    isFocused
                                    className="my-1 block w-full"
                                />

                                <InputError className="mt-2" message={errors.price} />
                            </div>
                            <div className="m-2">
                                <InputLabel htmlFor="image" value="Replace image" />

                                <TextInput
                                    id="image"
                                    type="file"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    className="my-1 block w-full"
                                />

                                <InputError className="mt-2" message={errors.image} />
                            </div>
                            <div className="m-2">
                                <InputLabel
                                    value={
                                        product.data.image_path.length
                                            ? "Current image"
                                            : "Product image missing"
                                    }
                                />
                                {
                                    product.data.image_path.length
                                        ? <img className="max-w-64" src={product.data.image_path} />
                                        : ''
                                }
                            </div>

                            <div className="m-2 text-right">
                                <PrimaryButton className="mt-4">Save changes</PrimaryButton>
                            </div>
                        </form>
                    </div>
                    <h2 className="font-semibold text-l leading-tight mx-5">Attributes</h2>
                    <AttributesTable
                        attributes={product.data.attributes}
                        productId={product.data.id}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function AttributesTable({attributes, productId}) {
    const attributeRows = attributes.map((attribute) =>
            <AttributeRow key={attribute.id} attribute={attribute} />
    );

    return (
        <div
            className="table w-full text-sm text-left bg-white shadow rounded-lg"
        >
            <div className="table-header-group text-xs uppercase">
                <div className="table-row text-nowrap border-b">
                    <div className="table-cell px-3 py-3 w-1/5">type</div>
                    <div className="table-cell px-3 py-3">name</div>
                    <div className="table-cell px-3 py-3 w-1/5">unit</div>
                    <div className="table-cell px-3 py-3 w-1/6 text-center">
                        <button
                            onClick={() => showCreateAttributeRow()}
                            className="text-white bg-green-600 md:bg-green-500 hover:bg-green-600 text-font-bold p-3 rounded inline-flex items-center"
                        >
                            <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" stroke="white" strokeWidth="2"/>
                            </svg>
                            <span className="ml-2 hidden md:flex">New</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="table-row-group">
                {attributeRows}
            </div>
        </div>
    );
}

function AttributeRow({attribute}) {
    const deleteAttribute = (attribute) => {
        if(!window.confirm("Delete attribute? This operation cannot be undone."))
            return

        router.delete(route('productattributes.destroy', attribute.id), {
            preserveState: true,
            preserveScroll: true
        });
    }

    return (
        <div
            className="table-row bg-white border-b"
        >
            <div className="table-cell p-3">{attribute.type.name}</div>
            <div className="table-cell p-3">{attribute.name}</div>
            <div className="table-cell p-3">{attribute.unit}</div>
            <div className="table-cell p-3 text-center">
                <button
                    onClick={() => deleteAttribute(attribute)}
                    className="text-white bg-red-600 md:bg-red-500 hover:bg-red-600 text-font-bold p-3 rounded inline-flex items-center ml-auto"
                >
                    <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

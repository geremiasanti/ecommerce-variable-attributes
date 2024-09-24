import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

import { Head, useForm, router } from '@inertiajs/react';

export default function Edit({category}) {
    console.log(category);
    const {data, setData, post, errors, reset} = useForm({
        name: category.data.name,
        image: '',
        image_path: category.data.image_path || '',
        attributes: category.data.attributes,
        _method: 'PUT'
    })
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('categories.update', category.data.id), {
            forceFormData: true
        });
    }

    const deleteCategory = (category) => {
        if(!window.confirm("Delete category? This operation cannot be undone."))
            return

        router.delete(route('categories.destroy', category.data.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit category</h2>
                    <button
                        onClick={() => deleteCategory(category)}
                        className="text-white bg-red-600 md:bg-red-500 hover:bg-red-600 text-font-bold p-3 rounded inline-flex items-center ml-auto"
                    >
                        <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                      <span className="ml-2 hidden md:flex">Delete</span>
                    </button>
                </div>
            }
        >
            <Head title={category.data.name} />

            <div className="py-12 text-gray-800">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <form
                        onSubmit={onSubmit}
                    >
                        <div className="p-4 sm:p-8 mb-2 bg-white shadow-xl sm:rounded-lg">
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
                                <InputLabel
                                    value={
                                        category.data.image_path.length
                                            ? "Current image"
                                            : "Category image missing"
                                    }
                                />
                                {
                                    category.data.image_path.length
                                        ? <img className="max-w-64" src={category.data.image_path} />
                                        : ''
                                }
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

                            <div className="m-2 text-right">
                                <PrimaryButton className="mt-4">Save changes</PrimaryButton>
                            </div>
                        </div>
                        <AttributesList attributes={category.data.attributes} />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function AttributesList({attributes}) {
    const attributeRows = attributes.map((attribute) =>
        <AttributeRow key={attribute.id} attribute={attribute} />
    );

    return (
        <table className="w-full text-sm text-left bg-white shadow-xl rounded-lg">
            <thead className="text-xs uppercase">
                <tr className="text-nowrap border-b">
                    <th className="px-3 py-3">type</th>
                    <th className="px-3 py-3">name</th>
                    <th className="px-3 py-3">unit</th>
                </tr>
            </thead>
            <tbody>
                {attributeRows}
            </tbody>
        </table>
    );
}

function AttributeRow({attribute}) {
    return (
        <tr
            className="bg-white border-b"
        >
            <td className="px-3 py-2">
                {attribute.type.name}
            </td>
            <td className="px-3 py-2">
                <TextInput
                    id="name"
                    value={attribute.name}
                    //onChange={(e) => setData('name', e.target.value)}
                    required
                    className="my-1 block w-full"
                />
            </td>
            <td className="px-3 py-2">
                {
                    attribute.type.can_have_unit
                        ? <TextInput
                            id="name"
                            value={attribute.unit}
                            //onChange={(e) => setData('name', e.target.value)}
                            required
                            className="my-1 block w-full"
                        />
                        : ' '
                }
            </td>
        </tr>
    );
}

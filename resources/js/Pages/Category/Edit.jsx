import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

import { Head, useForm } from '@inertiajs/react';

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

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit category</h2>}
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
                <tr className="text-nowrap">
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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';

import { Head, useForm } from '@inertiajs/react';

export default function Create({categories}) {
    const {data, setData, post, errors, reset} = useForm({
        category_id: '',
        name: '',
        price: '',
        image: ''
    })
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('products.store'), {
            forceFormData: true
        });
    }
    console.log(errors);

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create product</h2>}
        >
            <Head title="New product" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <form
                        className="p-4 sm:p-8 bg-white shadow-xl sm:rounded-lg"
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
                                isFocused
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
                            <InputLabel htmlFor="image" value="Image" />

                            <TextInput
                                id="image"
                                type="file"
                                onChange={(e) => setData('image', e.target.files[0])}
                                className="my-1 block w-full"
                            />

                            <InputError className="mt-2" message={errors.image} />
                        </div>

                        <div className="m-2 text-right">
                            <PrimaryButton className="mt-4">Save</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

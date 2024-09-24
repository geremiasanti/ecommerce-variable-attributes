import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

import { Head, useForm } from '@inertiajs/react';

export default function Edit({category}) {
    const {data, setData, post, errors, reset} = useForm({
        name: category.data.name,
        image: '',
        image_path: category.data.image_path || '',
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <form
                        className="p-4 sm:p-8 bg-white shadow-xl sm:rounded-lg"
                        onSubmit={onSubmit}
                    >
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
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

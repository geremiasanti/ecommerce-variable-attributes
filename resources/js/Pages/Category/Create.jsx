import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

import { Head, useForm, router } from '@inertiajs/react';

export default function Create() {
    const {data, setData, post, errors, reset} = useForm({
        name: '',
        image: ''
    })
    const onSubmit = (e) => {
        e.preventDefault();

        post(route('categories.store'), {
            forceFormData: true
        });
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create category</h2>}
        >
            <Head title="New category" />

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
                                isFocused
                                className="my-1 block w-full"
                            />

                            <InputError className="mt-2" message={errors.name} />
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

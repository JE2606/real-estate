import { useEffect, useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Checkbox from "../components/CheckBox";
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

export default function UpdateListing() {


    const [fileNames, setFileNames] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams(); 

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };

        fetchListing();
    }, []);


    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        const { id, checked } = e.target;

        if (id === 'sell' || id === 'rent') {
            setFormData((prevState) => ({
                ...prevState,
                type: id,
            }));
        }

        if (id === 'parking' || id === 'furnished' || id === 'offer') {
            setFormData((prevState) => ({
                ...prevState,
                [id]: checked,
            }));
        }

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData((prevState) => ({
                ...prevState,
                [id]: e.target.value,
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1)
                return setError('You must upload at least one image');
            if (+formData.regularPrice < +formData.discountPrice)
                return setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };



    return (
        <section className="bg__personalized w-full h-full flex flex-col justify-center items-center">
            <div className="w-full md:w-1/2 p-4 md:p-8">

                <form onSubmit={handleSubmit} className="flex flex-col border__personalized p-4">
                    <h1 className="text-3xl font-bold text-zinc-900 text-center mb-3">Update a Listing</h1>

                    <div className="flex gap-2 flex-col my-5">
                        <legend className="text-xl font-semibold text-zinc-600 mb-2">Basic Information</legend>
                        <div className="flex flex-col mb-2">
                            <label htmlFor="name" className="text-zinc-400 font-normal">Name</label>
                            <input onChange={handleChange}
                                value={formData.name}
                                type="text"
                                name="name"
                                id="name"
                                className="border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 py-1 px-2 rounded mt-1"
                                maxLength='62'
                                minLength='10'
                                required />
                        </div>
                        <div className="flex flex-col mb-2">
                            <label htmlFor="description" className="text-zinc-400 font-normal">Description</label>
                            <textarea name="description"
                                id='description'
                                required
                                onChange={handleChange}
                                value={formData.description}
                                className="border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 py-1 px-2 rounded mt-1"></textarea>
                        </div>
                        <div className="flex flex-col mb-2">
                            <label htmlFor="address" className="text-zinc-400 font-normal">Address</label>
                            <input
                                onChange={handleChange}
                                value={formData.address}
                                type="text"
                                name="address"
                                id="address"
                                className="border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 py-1 px-2 rounded mt-1"
                                required />
                        </div>

                    </div>

                    <hr className="my-5 opacity-40 w-3/4 m-auto" />

                    <div className="flex gap-2 flex-col my-5">
                        <legend className="text-xl font-semibold text-zinc-600 mb-4">Property Type</legend>
                        <div className="flex gap-5">
                            <div className="flex items-center justify-center">
                                <Checkbox
                                    id="sell"
                                    onChange={handleChange}
                                    checked={formData.type === 'sell'} />
                                <label htmlFor="sell" className="text-zinc-400 font-normal">Sell</label>
                            </div>
                            <div className="flex gap-1 items-center justify-center">
                                <Checkbox
                                    id="rent"
                                    onChange={handleChange}
                                    checked={formData.type === 'rent'} />
                                <label htmlFor="rent" className="text-zinc-400 font-normal">Rent</label>
                            </div>
                        </div>
                    </div>

                    <hr className="my-5 opacity-40 w-3/4 m-auto" />

                    <div className="flex gap-2 flex-col my-5">
                        <legend className="text-xl font-semibold text-zinc-600 mb-2">Property Features</legend>

                        <div className="flex gap-10 md:gap-5 flex-col md:flex-row">

                            <div>
                                <p htmlFor="parking" className="font-normal text-zinc-600">Does it include parking?</p>
                                <div className="flex mt-1">
                                    <Checkbox
                                        id="parking"
                                        onChange={handleChange}
                                        checked={formData.parking}
                                    />
                                    <label className="text-zinc-400 font-normal" htmlFor="parking">Parking Spot</label>
                                </div>
                            </div>
                            <div>
                                <p htmlFor="furnished" className="font-normal text-zinc-600">Is it furnished?</p>
                                <div className="flex mt-1">
                                    <Checkbox
                                        id="furnished"
                                        onChange={handleChange}
                                        checked={formData.furnished} />
                                    <label className="text-zinc-400 font-normal" htmlFor="furnished">Furnished</label>
                                </div>
                            </div>
                            <div>
                                <p htmlFor="offer" className="font-normal text-zinc-600">Is there a special offer?</p>
                                <div className="flex mt-1">
                                    <Checkbox
                                        id="offer"
                                        onChange={handleChange}
                                        checked={formData.offer} />
                                    <label className="text-zinc-400 font-normal" id="offer">Offer</label>
                                </div>
                            </div>

                        </div>
                    </div>

                    <hr className="my-5 opacity-40 w-3/4 m-auto" />

                    <div className="flex gap-2 flex-col my-5">
                        <legend className="text-xl font-semibold text-zinc-600 mb-2">Property Details</legend>
                        <div className="flex flex-col md:flex-row gap-8 md:gap-5">
                            <div className="flex flex-col">
                                <label htmlFor="bedrooms" className="text-zinc-400 font-normal">Number of Bedrooms</label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    className="border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 py-1 px-2 rounded mt-1"
                                    id="bedrooms"
                                    min="1"
                                    max="12"
                                    required
                                    onChange={handleChange}
                                    value={formData.bedrooms} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="bathrooms" className="text-zinc-400 font-normal">Number of Bathrooms</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    id="bathrooms"
                                    className="border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 py-1 px-2 rounded mt-1"
                                    min="1"
                                    max="12"
                                    required
                                    onChange={handleChange}
                                    value={formData.bathrooms} />
                            </div>
                        </div>
                    </div>

                    <hr className="my-5 opacity-40 w-3/4 m-auto" />

                    <div className="flex gap-2 flex-col my-5">
                        <legend className="text-xl font-semibold text-zinc-600 mb-2">Price</legend>
                        <label htmlFor="regularPrice" className="text-zinc-400 font-normal">Regular Price</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                name="regularPrice"
                                id="regularPrice"
                                className="w-full md:w-1/2 border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 py-1 px-2 rounded"
                                required
                                min="50"
                                max="1000000"
                                onChange={handleChange}
                                value={formData.regularPrice} />
                            <span>($ / Month)</span>
                        </div>

                        <label htmlFor="discountPrice" className="text-zinc-400 font-normal">Discount Price</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                name="discountPrice"
                                id="discountPrice"
                                className="w-full md:w-1/2 border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 py-1 px-2 rounded"
                                required
                                min="50"
                                max="1000000"
                                onChange={handleChange}
                                value={formData.discountPrice} />
                            <span>($ / Month)</span>
                        </div>

                    </div>

                    <hr className="my-5 opacity-40 w-3/4 m-auto" />

                    <div className="flex gap-2 flex-col my-5">

                        <legend className="text-xl font-semibold text-zinc-600 mb-2">Photos</legend>
                        <label htmlFor="images" className="text-zinc-400 font-normal">Photos of the Property (max 6 images):</label>
                        <div className="flex flex-col">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                <input
                                    type="file"
                                    id="images"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        setFiles(e.target.files);
                                        const fileNames = Array.from(e.target.files).map(file => file.name);
                                        setFileNames(fileNames);
                                    }}
                                    className='file:py-2 file:py:3 file:border-none file:rounded  file:text-primary-600 file:font-normal file:cursor-pointer file:transition file:duration-200 file:hover:bg-gray-100 file:hover:text-primary-700 '

                                />
                                <button
                                    type="button"
                                    htmlFor="images"
                                    className="max-w-[140px] cursor-pointer py-2 px-3 rounded-md border border-gray-300 transition duration-200 ease-in-out hover:border-primary-200 hover:text-primary-200 text-zinc-600 font-normal text-lg"
                                    onClick={handleImageSubmit}
                                    disabled={uploading}>
                                    <UploadOutlined className="mr-2" />
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>

                            {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}

                            {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                                <div key={url} className="flex flex-col">
                                    <div className="flex items-center justify-between p-2 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <img src={url} alt="image" className="w-10 h-10 object-cover rounded-md mr-2" />
                                            <span className="text-zinc-800">{fileNames[index]}</span>
                                        </div>
                                        <DeleteOutlined
                                            className="text-red-600 cursor-pointer"
                                            onClick={() => handleRemoveImage(index)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                    <button
                        disabled={loading || uploading}
                        className="py-2 px-3 rounded-md mt-3 bg-primary-200 transition duration-200 ease-in-out hover:shadow-lg text-white font-bold text-lg">{loading ? 'Creating...' : 'Update Listing'}</button>


                </form>

            </div>

        </section>
    )
}

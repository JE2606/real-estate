import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, list, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import Modal from "../components/Modal";
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


export default function Profile() {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [showDeleteListingModal, setShowDeleteListingModal] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {

            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await res.json();

            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
            }
            dispatch(deleteUserSuccess(data));
            setShowModal(false);

        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignOut = async () => {

        const res = await fetch('/api/auth/signout');
        const data = await res.json();

        try {
            dispatch(signOutUserStart());
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
            setShowSignOutModal(false);
        } catch (error) {
            dispatch(deleteUserFailure(data.message));
        }
    };


    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return;
            }

            setUserListings(data);
        } catch (error) {
            setShowListingsError(true);
        }
    };

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId)
            );
            setShowDeleteListingModal(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <section className="bg__personalized h-full w-full p-4 md:p-6 flex justify-center items-center flex-col">

            <form onSubmit={handleSubmit} className="p-4 md:p-6 border__personalized w-[90%] md:w-[40%] flex flex-col">
                <h1 className="text-3xl font-bold text-zinc-900 mb-3 text-center">Your Profile</h1>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />

                <img
                    onClick={() => fileRef.current.click()}
                    src={formData?.avatar || currentUser.avatar}
                    alt="Profile Picture"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center" />

                <p className='text-sm self-center mt-1'>
                    {fileUploadError ? (
                        <span className='text-red-500'>
                            Error Image upload (image must be less than 2 mb)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-500'>Image successfully uploaded!</span>
                    ) : (
                        ''
                    )}
                </p>

                <label htmlFor="username" className="mb-2 font-medium text-zinc-500">Username</label>
                <input type="text" placeholder="Username" defaultValue={currentUser.username} onChange={handleChange} id="username" className="px-3 py-2 rounded-md border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 mb-2" />

                <label htmlFor="email" className="mb-2 font-medium text-zinc-500">Email</label>
                <input type="email" placeholder="email" id="email" defaultValue={currentUser.email} onChange={handleChange} className="px-3 py-2 rounded-md border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 mb-2" />

                <label htmlFor="password" className="mb-2 font-medium text-zinc-500">Password</label>
                <input type="password" placeholder="Password" id="password" defaultValue={currentUser.password} onChange={handleChange} className="px-3 py-2 rounded-md border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 mb-2" />

                {error && <p className='text-red-500'>{error}</p>}
                <p className="text-green-500">{updateSuccess ? 'Profile updated successfully' : ''}</p>

                <button
                    disabled={loading}
                    className="py-2 px-3 rounded-md my-3 bg-primary-200 transition duration-200 ease-in-out hover:shadow-lg text-white font-bold text-lg disabled:opacity-85">{loading ? 'Loading...' : 'Update'}</button>

                <Link to={'/create-listing'}
                    className="py-2 px-3 rounded-md  border border-gray-400 transition duration-200 ease-in-out hover:shadow-lg font-bold text-lg text-gray-500 flex items-center justify-center gap-2"
                >
                    Create Listening
                </Link>

                <div className="flex justify-between items-center my-3">
                    <button onClick={() => setShowModal(true)} className="font-semibold transition-all ease-in text-red-500 cursor-pointer hover:text-red-700">Delete Account</button>
                    <button onClick={() => setShowSignOutModal(true)} className="font-semibold transition-all ease-in text-gray-400 hover:text-gray-950">Sign Out</button>
                </div>
                <button onClick={handleShowListings} className="transition-all ease-in text-gray-500 hover:text-primary-200">Show my Listings</button>
                <p className="text-red-500 mt-4">{showListingsError ? 'Error showing listings' : ''}</p>
            </form>


            {userListings && userListings.length > 0 && (
                <div className="my-5 border__personalized p-4 md:p-6 w-[90%] md:w-[40%]">
                    <h2 className="font-semibold text-2xl text-zinc-600">Your Listings</h2>
                    {userListings.map((listing) => (
                        <div
                            className="flex my-8 items-center justify-between border p-2 rounded-md"
                            key={listing._id}
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img
                                    src={listing.imageUrls[0]}
                                    alt='listing cover'
                                    className='h-20 w-20 object-contain rounded-lg transition-shadow ease-linear duration-300 hover:shadow-md'
                                />
                            </Link>
                            <Link
                                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                                to={`/listing/${listing._id}`}
                            >
                                <p className="text-center text-wrap">{listing.name}</p>
                            </Link>
                            <div className='flex flex-col h-20 justify-between'>
                                <DeleteOutlined
                                    className="text-red-500 transition-all hover:text-red-700 cursor-pointer"
                                    onClick={() => setShowDeleteListingModal(true)}
                                />
                                <Modal
                                    isOpen={showDeleteListingModal}
                                    onClose={() => setShowDeleteListingModal(false)}
                                    onConfirm={() => handleListingDelete(listing._id)}
                                    title="Delete Listing"
                                    message="Are you sure you want to delete this listing? This action is irreversible."
                                    confirmButtonText="Delete"
                                    cancelButtonText="Cancel"
                                    confirmButtonColor="bg-red-500"
                                    cancelButtonColor="bg-gray-200"
                                />
                                <Link to={`/update-listing/${listing._id}`}>
                                    <EditOutlined
                                        className='text-green-500 transition-all hover:text-green-700 cursor-pointer'
                                    />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}



            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDeleteUser}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action is irreversible."
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                confirmButtonColor="bg-red-500"
                cancelButtonColor="bg-gray-200"
            />
            <Modal
                isOpen={showSignOutModal}
                onClose={() => setShowSignOutModal(false)}
                onConfirm={handleSignOut}
                title="Sign Out"
                message="Are you sure you want to sign out? You will need to log in again to access your account."
                confirmButtonText="Sign Out"
                cancelButtonText="Cancel"
                confirmButtonColor="bg-red-500"
                cancelButtonColor="bg-gray-200"
            />

        </section>
    )
}

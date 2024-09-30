import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };
    return (
        <section className="h-screen flex justify-center items-center">
            <div className="w-full md:w-2/4 h-full py-10 px-3 md:px-8 flex flex-col items-center md:items-start">
                <div className="flex flex-col md:flex-row  md:items-center gap-4 md:gap-2 mb-4 mt-4">
                    <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                    <h1 className="text-3xl md:text-4xl  font-bold text-zinc-800">Welcome back!</h1>
                </div>
                <div className="flex gap-2 mb-2">
                    <p>Don&apos;t have an account?</p>

                    <Link to="/sign-up" className="text-blue-500 font-medium hover:text-blue-700">Sign Up</Link>
                </div>

                <form className="border__personalized w-3/4 flex flex-col p-8" onSubmit={handleSubmit}>

                    <legend className="font-bold text-3xl text-zinc-600 mb-3">Sign In</legend>

                    <label htmlFor="email" className="mb-2 font-medium text-zinc-500">Email</label>
                    <input type="email" placeholder="email" id="email" className="px-3 py-2 rounded-md border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 mb-2" onChange={handleChange} />

                    <label htmlFor="password" className="mb-2 font-medium text-zinc-500">Password</label>
                    <input type="password" placeholder="Password" id="password" className="px-3 py-2 rounded-md border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 mb-2" onChange={handleChange} />

                    {error && <p className='text-red-500'>{error}</p>}

                    <button disabled={loading} className="py-2 px-3 rounded-md mt-3 bg-primary-200 transition duration-200 ease-in-out hover:shadow-lg text-white font-bold text-lg">{loading ? 'Loading...' : 'Continue'} </button>

                    <div className="flex items-center justify-center my-2">
                        <div className="w-44 h-[1px] bg-zinc-300 flex-grow-0 rounded-md"></div>
                        <p className="text-zinc-400 mx-4">or</p>
                        <div className="w-44 h-[1px] bg-zinc-300 flex-grow-0 rounded-md"></div>
                    </div>

                    <OAuth />

                </form>

            </div>
            <div className="w-1/2 h-full hidden md:block">
                <video autoPlay loop muted className="w-full h-full object-cover">
                    <source src="/signin.mp4" type="video/mp4" />
                </video>
            </div>
        </section>
    )
}

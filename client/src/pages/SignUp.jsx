import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <section className="h-screen flex justify-center items-center">
      <div className="w-full md:w-2/4 h-full py-6 px-3 md:px-8 flex flex-col items-center md:items-start">
        <div className="flex flex-col md:flex-row  md:items-center gap-4 md:gap-2 mb-4">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <h1 className="text-3xl md:text-4xl  font-bold text-zinc-800">Create your account</h1>
        </div>
        <div className="flex gap-2 mb-2">
          <p>Already have an account?</p>
          <Link to="/sign-in" className="text-blue-500 font-medium hover:text-blue-700">Sign In</Link>
        </div>

        <form className="border__personalized w-3/4 flex flex-col p-8 pt-5" onSubmit={handleSubmit}>

          <legend className="font-bold text-3xl text-zinc-600 mb-3">Sign Up</legend>

          <label htmlFor="username" className="mb-2 font-medium text-zinc-500">Username</label>
          <input type="text" placeholder="Username" id="username" className="px-3 py-2 rounded-md border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 mb-2" onChange={handleChange} />
          
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
          <source src="/background-signup.webm" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}

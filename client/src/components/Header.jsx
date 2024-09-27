import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { SearchOutlined } from "@ant-design/icons";

const Header = () => {
    const { currentUser } = useSelector(state => state.user);
    const [isOpen, setIsOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTerm = urlParams.get('searchTerm');
        if (searchTerm) {
            setSearchTerm(searchTerm);
        }
    }, [location.search]);


    return (


        <header className="w-full">
            <nav className="fixed w-full bg-white  shadow-sm" style={{ zIndex: 1000 }}>
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to='/'>
                        <div className="flex items-center">
                            <img src="/logo.svg" alt="logo" className="md:h-10 h-8 w-auto transition duration-300 ease-in-out hover:scale-[1.2]" />
                        </div>
                    </Link>

                    <div className="md:flex max-w-[200px] md:flex-grow md:ml-24 md:max-w-lg mx-8">
                        <form onSubmit={handleSubmit} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-4 pr-10 py-2 rounded-full bg-white/50 border border-gray-300 text-gray-700 focus:outline-none focus:border-none focus:ring-1 focus:ring-primary-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                            <button className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <SearchOutlined className="h-5 w-5 text-zinc-500 transition-colors ease-linear duration-200 hover:text-zinc-800" />
                            </button>
                        </form>
                    </div>

                    <div>
                        <ul className="hidden md:flex space-x-8 items-center">
                            <Link to='/'>
                                <li className="text-gray-400 hover:text-gray-950">Home</li>
                            </Link>
                            <Link to='/about'>
                                <li className="text-gray-400 hover:text-gray-950">About</li>
                            </Link>
                            <Link to='/profile'>
                                {currentUser ? (
                                    <img src={currentUser.avatar} alt="Avatar"
                                        className="w-8 h-8 rounded-full object-cover transition duration-300 ease-in-out hover:scale-[1.2]" />
                                ) : (
                                    <li className="flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-gray-300 bg-white/50 text-gray-700 transition duration-200 ease-in-out hover:shadow-md">
                                        <img src="/user.svg" alt="user" /> Sign-In
                                    </li>
                                )}
                            </Link>
                        </ul>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <img src="/menu.svg" alt="menu" className="h-6 w-auto" />
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden bg-white/30 backdrop-blur-lg w-full py-4 px-4 space-y-4">
                        <ul className="flex flex-col items-center space-y-5">
                            <Link to='/'>
                                <li className="text-gray-400 hover:text-gray-950">Home</li>
                            </Link>
                            <Link to='/about'>
                                <li className="text-gray-400 hover:text-gray-950">About</li>
                            </Link>
                            <Link to='/profile'>
                                {currentUser ? (
                                    <img src={currentUser.avatar} alt="Avatar"
                                        className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <li className="flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-gray-300 bg-white/50 text-gray-700 transition duration-200 ease-in-out hover:shadow-md">
                                        <img src="/user.svg" alt="user" /> Sign-In
                                    </li>
                                )}
                            </Link>
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;

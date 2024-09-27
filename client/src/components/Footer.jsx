import { Link } from "react-router-dom"
const Footer = () => {
    return (
        <footer className="bg-zinc-50">
            <div>
                <div className="pt-3">
                    <ul className="flex justify-center space-x-4 mb-4">
                        <Link to='/'>
                            <li className="text-gray-400 hover:text-gray-950">Home</li>
                        </Link>
                        <p className="text-gray-400">|</p>
                        <Link to='/about'>
                            <li className="text-gray-400 hover:text-gray-950">About</li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-4 mb-6">
                <a href="https://github.com/JE2606" target="_blank" rel="noopener noreferrer"
                    className="">
                    <img src="/github.svg" alt="Github" className="w-10 h-10 hover:scale-[1.2] transition duration-300 ease-in-out" />
                </a>
                <a href="https://www.linkedin.com/in/juan-elias-hj?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"
                    className="">
                    <img src="/linkedin.svg" alt="Linkedin" className="w-12 h-12 transition duration-200 ease-in-out hover:scale-[1.2]" />
                </a>
            </div>
        </footer>
    )
}

export default Footer
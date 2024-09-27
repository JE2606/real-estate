import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log('could not sign in with google', error);
        }
    };
    return (
        <button
            onClick={handleGoogleClick}
            type='button'
            className="py-2 px-3 rounded-md  border border-gray-400 transition duration-200 ease-in-out hover:shadow-lg font-bold text-lg text-gray-500 flex items-center justify-center gap-2"
        >
            <img src="/google.svg" alt="Google" className="w-6 h-auto" /> Google
        </button>
    );
}

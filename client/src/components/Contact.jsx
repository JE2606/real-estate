import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; 

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);

    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2 border__personalized p-4'>
                    <h2 className='text-zinc-600 font-semibold'>
                        Contact <span className='text-zinc-800'>{landlord.username}</span>{' '}
                        for{' '}
                        <span className='text-zinc-800'>{listing.name.toLowerCase()}</span>
                    </h2>
                    <textarea
                        name='message'
                        id='message'
                        rows='2'
                        value={message}
                        onChange={onChange}
                        placeholder='Enter your message here...'
                        className='w-full p-3 rounded-lg border-gray-200 border  text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200'
                    ></textarea>

                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className='bg-primary-200 transition duration-200 ease-in-out hover:shadow-lg text-white font-bold text-lg text-center p-3 uppercase rounded-lg hover:opacity-95'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
}

Contact.propTypes = {
    listing: PropTypes.shape({
        userRef: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};

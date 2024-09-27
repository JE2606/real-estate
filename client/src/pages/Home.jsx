import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
export default function Home() {

    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4');
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings();
            } catch (error) {
                console.log(error);
            }
        };

        const fetchSaleListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sale&limit=4');
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOfferListings();
    }, []);



    return (
        <section>

            <div className="w-full h-dvh flex flex-col items-center justify-between flex-wrap md:flex-row">

                <div className="flex flex-col items-center md:items-start max-w-full md:w-[40%] p-4 pt-8 md:pt-0 md:p-12">

                    <h1 className="text-center md:text-left text-3xl md:text-5xl font-semibold text-zinc-800 text-pretty mb-3">
                        Discover Your Ideal Home
                    </h1>
                    <p className="text-xl md:text-xl text-center md:text-left text-zinc-600 text-pretty mb-6">
                        Find your perfect property! From cozy homes to stylish apartments, we have options for every lifestyle.
                    </p>
                    <Link to={'/sign-up'} className="border border-gray-300 transition duration-200 ease-in-out hover:border-primary-200 hover:text-primary-200 text-zinc-600 w-32 py-3 px-4 text-center rounded-full">
                        Start Now!
                    </Link>


                </div>


                <div className="md:w-[60%] min-h-[550px] md:h-full w-full flex justify-center items-center">

                    <div className="arc__div w-full h-full md:h-[95%] md:w-[90%]"></div>
                </div>
            </div>


            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {offerListings && offerListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {offerListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
                {rentListings && rentListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {rentListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
                {saleListings && saleListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {saleListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>


        </section>
    )
}

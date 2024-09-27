import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { useSelector } from 'react-redux'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { ShareAltOutlined, EnvironmentOutlined, HomeOutlined, CarOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import Contact from "../components/Contact"
export default function Listing() {

    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);


    return (
        <section>
            {loading && <p className="text-center my-8">Loading...</p>}
            {error && <p className="text-center my-8">Something went wrong! <Link to='/' className="text-blue-500 underline">Go back</Link></p>}

            {listing && !loading && !error &&
                <>
                    <Swiper navigation>
                        {listing.imageUrls.map((url, index) => (
                            <SwiperSlide key={url}>
                                <div className="h-[550px]" style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'contain' }}>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <ShareAltOutlined
                        className='text-slate-500 transition-all duration-150 ease-in-out hover:border-primary-200 hover:text-primary-200 hover:bg-white fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }}
                    />

                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}

                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <h1 className='text-3xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </h1>

                        <div>

                            <ul className='text-zinc-600 font-normal text-sm flex flex-wrap items-center gap-10 sm:gap-6'>

                                <li className='flex items-center gap-2' >
                                    <EnvironmentOutlined className='text-zinc-400' />
                                    {listing.address}
                                </li>

                                <span className="text-zinc-200 font-light">|</span>

                                <li className='flex items-center gap-2'>
                                    <HomeOutlined className='text-zinc-400' />
                                    {listing.bedrooms > 1
                                        ? `${listing.bedrooms} beds `
                                        : `${listing.bedrooms} bed `}
                                </li>

                                <span className="text-zinc-200 font-light">|</span>

                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <img src="/bath.png" alt="Bath" />
                                    {listing.bathrooms > 1
                                        ? `${listing.bathrooms} baths `
                                        : `${listing.bathrooms} bath `}
                                </li>

                                <span className="text-zinc-200 font-light">|</span>

                                <li className='flex items-center gap-2'>
                                    <CarOutlined className='text-zinc-400' />
                                    {listing.parking ? 'Parking spot' : 'No Parking'}
                                </li>

                                <span className="text-zinc-200 font-light">|</span>

                                <li className='flex items-center gap-2'>
                                    <AppstoreAddOutlined className='text-zinc-400' />
                                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                </li>
                            </ul>

                        </div>

                        <hr />

                        <div className="flex fex-col flex-wrap md:flex-row">
                            <div className="flex flex-col w-full md:w-[60%] my-5 md:my-0">
                                <div className='flex gap-4'>
                                    <p className={`w-full max-w-[200px] font-semibold text-white text-center p-1 rounded-md ${listing.type === 'rent' ? 'bg-green-500' : 'bg-orange-500'}`}>
                                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                    </p>
                                    {listing.offer && (
                                        <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                            ${+listing.regularPrice - +listing.discountPrice} OFF
                                        </p>
                                    )}
                                </div>

                                <div className='text-slate-800 my-4'>
                                    <h2 className='font-semibold text-black mb-1'>Description</h2>
                                    {listing.description}
                                </div>
                            </div>
                            <div className="flex flex-col w-full md:w-[40%] p-4">
                                {currentUser && listing.userRef !== currentUser._id && !contact && (

                                    <button
                                        onClick={() => setContact(true)}
                                        className="py-2 px-3 rounded-md mt-3 bg-primary-200 transition duration-200 ease-in-out hover:shadow-lg text-white font-bold text-lg"
                                    >
                                        Contact Landlord
                                    </button>

                                )}

                                {contact && <Contact listing={listing} />}
                            </div>



                        </div>

                    </div>

                </>
            }

        </section>
    )
}

import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import Checkbox from "../components/CheckBox";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from "../components/ListingItem"


export default function Search() {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sale'
        ) {
            setSidebardata({ ...sidebardata, type: e.target.id });
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setSidebardata({
                ...sidebardata,
                [e.target.id]:
                    e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({ ...sidebardata, sort, order });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    return (
        <section>
            <div className="w-full fixed top-0 left-0 z-50">
                <h1 className="text-center">Navbar</h1>
            </div>

            {!open && (
                <div className="w-[30%]  fixed top-[70px] left-0 z-40">
                    <button
                        onClick={() => setOpen(true)}
                        className="ml-6 md:ml-14 pt-4"
                    >
                        <MenuOutlined className="text-xl text-zinc-500 hover:text-zinc-700" />
                    </button>
                </div>
            )}

            <div role="dialog" tabIndex={0} className={`${open ? "bg-gray-600/50" : "hidden"} min-h-screen w-full fixed left-0 right-0 top-0 backdrop-blur-sm z-10`} onClick={() => setOpen(false)}></div>

            <div className={`${open ? "w-[90%] md:w-[30%] fixed left-0 top-[70px] h-[calc(100vh-70px)] overflow-y-auto" : "w-0"} bg-white z-20 transition-all duration-200 ease-linear`}>
                <div className={`${open ? "p-4 md:p-8" : "hidden"}`}>
                    <button className="ml-2 mb-3" onClick={() => setOpen(false)}>
                        <CloseOutlined className="text-xl text-zinc-500 hover:text-zinc-700" />
                    </button>

                    <h1 className="text-xl font-bold text-zinc-700">Search Terms</h1>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full border-gray-200 border text-gray-700 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary-200 py-1 px-2 rounded"
                            id="searchTerm"
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />

                        <div className="flex gap-2 flex-col mt-10">
                            <p className="text-zinc-600 font-semibold">Property Type</p>
                            <div className="flex gap-2 my-1 items-center">
                                <Checkbox id="all" name="all" onChange={handleChange} checked={sidebardata.type === 'all'} />
                                <label htmlFor="all">Rent & Sale</label>
                            </div>
                            <div className="flex gap-2 my-1 items-center">
                                <Checkbox id="rent" name="rent" onChange={handleChange} checked={sidebardata.type === 'rent'} />
                                <label htmlFor="rent">Rent</label>
                            </div>
                            <div className="flex gap-2 my-1 items-center">
                                <Checkbox id="sale" name="sale" onChange={handleChange} checked={sidebardata.type === 'sale'} />
                                <label htmlFor="sale">Sale</label>
                            </div>
                            <div className="flex gap-2 my-1 items-center">
                                <Checkbox id="offer" name="offer" onChange={handleChange} checked={sidebardata.offer} />
                                <label htmlFor="offer">Offer</label>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-col mt-10">
                            <p className="text-zinc-600 font-semibold">Property Features</p>
                            <div className="flex gap-2 my-1 items-center">
                                <Checkbox id="parking" name="parking" onChange={handleChange} checked={sidebardata.parking} />
                                <label htmlFor="parking">Parking</label>
                            </div>
                            <div className="flex gap-2 my-1 items-center">
                                <Checkbox id="furnished" name="furnished" onChange={handleChange} checked={sidebardata.furnished} />
                                <label htmlFor="furnished">Furnished</label>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-col my-10">
                            <p className="text-zinc-600 font-semibold">Sort</p>
                            <select onChange={handleChange} defaultValue={'created_at_desc'} name="sort_order" id="sort_order" className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-primary-200 focus:border-primary-200">
                                <option value="regularPrice_desc">Price High to Low</option>
                                <option value="regularPrice_asc">Price Low to High</option>
                                <option value="createdAt_desc">Latest</option>
                                <option value="createdAt_asc">Oldest</option>
                            </select>
                        </div>

                        <button className="py-2 px-3 rounded-md mt-3 bg-primary-200 transition duration-200 ease-in-out hover:shadow-lg text-white font-bold text-lg w-full">Search</button>
                    </form>
                </div>
            </div>

            <div className="pl-20 pr-6 md:pl-28 md:pr-20 mt-[90px]">
                <div className="flex flex-wrap items-center w-full">
                    {!loading && listings.length === 0 && (
                        <div className="w-full text-center">
                            <p className="text-normal text-zinc-800">No listings found.</p>
                        </div>

                    )}
                    {loading && (
                        <div className="w-full text-center">
                            <p className="text-normal text-zinc-800">Loading...</p>
                        </div>

                    )}

                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}

                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='text-zinc-600 hover:underline p-7 text-center w-full'
                        >
                            Show more
                        </button>
                    )}

                </div>
            </div>
        </section>
    );
}

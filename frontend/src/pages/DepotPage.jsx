import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { Bookmark,  Cookie, Loader, MapPin, PackageOpen, Search, ShoppingBasket, SlidersHorizontal} from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import Scrap from "../components/Scrap";
import { Link } from "react-router-dom";
import ScrollTop from "../components/ScrollTop";
import { categoryOptions, cityOptions, itemOptions, itemStatusOptions } from "../data/options";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchScraps = async ({ pageParam = 1 }) => {
	const res = await axiosInstance.get(`/scraps?page=${pageParam}&limit=10`);
	return res.data;
};


const DepotPage = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const [search, setSearch] = useState("");

	const { data: recommendedUsers } = useQuery({
		queryKey: ["recommendedUsers"],
		queryFn: async () => {
			if (authUser) {
				const res = await axiosInstance.get("/users/suggestions");
				return res.data;
			}else{
				return []
			}
		},
	});

    const [filter, setFilter] = useState({ item: "all", city: "all", category: "all", itemStatus: "all" });

    const { data, fetchNextPage, hasNextPage,isLoading : scrapLoading, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["scraps"],
        queryFn: fetchScraps,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length + 1 : undefined;
        }
    });

    let filteredScraps = data?.pages.flatMap((page) => page.data) || [];

    if (search.trim() !== "") {
        filteredScraps = filteredScraps.filter((scrap) =>
            scrap.itemName.value.toLowerCase().includes(search.toLowerCase())
        );
    }

    const loadMoreRef = useRef(null);

    useEffect(() => {
        if (!hasNextPage) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchNextPage();
            }
        }, { threshold: 1 });

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);
	
	
	filteredScraps = filteredScraps.filter((scrap) => {
		return (
		  (filter.item === "all" || scrap.itemName.value === filter.item) &&
		  (filter.city === "all" || scrap.location === filter.city) &&
		  (filter.category === "all" || scrap.category === filter.category) &&
		  (filter.itemStatus === "all" || scrap.itemStatus === filter.itemStatus)
		);
	  });
	
	const resetFilter =()=>{
		setFilter({item:"all",city:"all",category:"all",itemStatus:"all"})
		setSearch("")
	}
	return (
		<>
		<ScrollTop />
		<div className='bg-body px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
			{authUser && (
				<div className='col-span-1 lg:col-span-1 lg:block flex flex-col'>
					<Sidebar user={authUser} />
					{recommendedUsers?.length > 0 && (
							<div className='bg-white rounded-lg shadow p-4'>
								<h2 className='font-semibold mb-4'>People you may know</h2>
								{recommendedUsers?.map((user) => (
									<RecommendedUser key={user._id} user={user} />
								))}
							</div>
					)}
				</div>
			)}
			</div>
			<div className='col-span-1 lg:col-span-2'>
				<div className="bg-white rounded-lg shadow p-4 mb-4 flex">
					<div className="bg-gray-100 border border-gray-300 rounded-lg w-full relative ">
					<input type="text" className="w-full bg-gray-100 py-2 px-4 rounded-lg" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for scraps" />
					<Search className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
					</div>
				</div>
				{(scrapLoading) && 
				(<div className="col-span-1 sm:col-span-2 "><Loader className='mx-auto text-orange-500 animate-spin' size={70} /></div>)}

			{filteredScraps.map((scrap) => (
                <Scrap key={scrap._id} scrap={scrap} />
            ))}
            <div ref={loadMoreRef}>
                {isFetchingNextPage && <p>جاري تحميل المزيد...</p>}
            </div>

				{filteredScraps?.length === 0 && !scrapLoading && (
					<div className='bg-white rounded-lg shadow p-8 text-center'>
						<div className='mb-6'>
							<PackageOpen size={64} className='mx-auto text-primary' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Scraps</h2>
						<p className='text-gray-600 mb-6'>You can create a new scrap by clicking the button below.</p>
						<Link to="/create-scrap" className='text-sm font-semibold'>
					<button className="btn bg-primary text-white">Create Scrap</button>
						</Link>					
						</div>
				)}


				

			</div>
			{/* filter */}
			<div className='col-span-1 order-first sm:order-none'>
			<div className='bg-white rounded-lg shadow mb-4 p-4'>
				<div className="flex justify-between items-center">
				<h2 className='font-semibold flex items-center gap-2'><SlidersHorizontal size={18} /><span>Filter</span></h2>
				<button className="text-red-400 text-sm font-semibold" onClick={()=> resetFilter()}> Reset</button>
				</div>
				
        <div className="flex flex-col gap-2 mb-2 mt-4 sm:mt-8">
            <label htmlFor="item" className="text-gray-500 text-sm flex items-center gap-1"><ShoppingBasket size={15} className="text-orange-300" /><span>Item</span> </label>
            <select id="item" name="item" className="flex-1 border rounded p-1"
			 value={filter.item}
			 onChange={(e) => setFilter({...filter,item:e.target.value})}>
                <option value="all">All</option>
                {itemOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
        <div className="flex flex-col gap-2  mt-4">
		<label htmlFor="location" className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={15} className="text-orange-300" /><span>Location</span></label>
			<select id="location" name="location" className="flex-1 border rounded p-1"
			value={filter.city}
			onChange={(e) => setFilter({...filter,city:e.target.value})}>
                <option value="all" >All</option>
                {cityOptions.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>        
		</div>
        <div className="hidden sm:flex sm:flex-col gap-2  mt-4">
            <label htmlFor="category" className="text-gray-500 text-sm flex items-center gap-1"><Bookmark  size={15} className="text-orange-300" /><span>Category</span></label>
			<select id="category" name="category" className="flex-1 border rounded p-1" 
			value={filter.category}
			onChange={(e) => setFilter({...filter,category:e.target.value})}>
                <option value="all" >All</option>
                {categoryOptions.map((e) => (
                    <option key={e} value={e}>
                        {e}
                    </option>
                ))}
            </select>        
		</div>

		<div className="hidden sm:flex sm:flex-col gap-2  mt-4">
		<label htmlFor="item-status" className="text-gray-500 text-sm flex items-center gap-1"><Cookie size={15} className="text-orange-300" /><span> Item Status</span></label>
			<select id="item-status" name="item-status" className="flex-1 border rounded p-1"
			value={filter.itemStatus}
			onChange={(e) => setFilter({...filter,itemStatus:e.target.value})}>
				<option value="all" >All</option>
				{itemStatusOptions.map((e) => (
					<option key={e} value={e}>
						{e}
					</option>
				))}
			</select>
		</div>
      
    </div>
			</div>
			
		</div>
		</>
	);
};
export default DepotPage;
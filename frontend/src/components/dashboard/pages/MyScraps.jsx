import { Calendar,  CircleDollarSign,  Loader, } from "lucide-react";
import {  useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../lib/axios";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const MyScraps = () => {
	//scrap response that user make
	const { data: userScraps , isLoading: scrapLoading } = useQuery({
		queryKey: ["userScraps"],
		queryFn: async () => {
			const res = await axiosInstance.get("/scraps/myScrapslist");
			return res.data;
		},
	});

 

  
  const myScrapsArr = scrapLoading ? [] : userScraps;

  // console.log(myScrapsArr , "myScrapsArr");
  // console.log(myScrapsResArr , "myScrapsResArr");
 
  return (
    
		<div className='relative w-full '>
      {scrapLoading ? (<div className="flex flex-col items-center mt-10 text-primary"><Loader className="mr-2 animate-spin" size={40} /></div>) : (<div>
        {( myScrapsArr.length === 0 )? (
            <div className="flex flex-col items-center mt-10">
            <p className="text-center text-2xl text-gray-500 font-semibold">You didn&apos;t make any scrap yet 😥</p>
            <Link to="/create-scrap" className="bg-primary text-white py-3 px-9 rounded text-center mt-10 font-semibold hover:bg-orange-700">Make One Now</Link>
            </div>

        ) : scrapLoading ? "loading ..." : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 ">
            {myScrapsArr.map((scrap) => (
              <Link key={scrap._id} to={`/dashboard/scrap/${scrap._id}`} className= "flex flex-col sm:mx-4 border  bg-white p-4 rounded-xl shadow mb-4">
                <div className="flex justify-between gap-2 mb-4">
                    { scrap.scrapStatus === "open" ? (
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-500 py-1 px-2 rounded-full text-sm">Open</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-300 text-gray-600 py-1 px-2 rounded-full text-sm">Closed</span>
                      </div>
                    ) }
                  </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between mb-7">
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="md:size-20 overflow-hidden rounded">
                      <img className="w-full h-full object-cover" src={scrap.image} alt={scrap.itemName} />
                    </div>
                    <div>
                    <h3 className="text-2xl font-semibold text-orange-500">{scrap.itemName.value}</h3>
                    <p className="text-gray-500 ">Quantity : {scrap.quantity === scrap.oldQuantity ? <span className="text-gray-800 font-semibold">{scrap.quantity}</span> : <span className="text-gray-800 font-semibold">{scrap.quantity} <span className=" text-gray-500 font-normal"> left of <span className="font-semibold"> {scrap.oldQuantity}</span></span></span>}{" "}{scrap.units}</p>
                    <p className="text-gray-500 ">Unit Price : {scrap.unitPrice} SR</p>
                    <div className="flex items-center gap-2">
                      {scrap.likes.length > 0 && (
                        <div className="flex items-center">
                        <span className="text-blue-500">({scrap.likes.length}) likes</span>
                        </div>
                      )}
                      {scrap.comments.length > 0 && (
                        <div className="flex items-center">
                        <span className="text-blue-500">({scrap.comments.length}) comments</span>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                  <div>
                  <div className="text-gray-500 flex items-center gap-1"><Calendar size={15} />{formatDistanceToNow(new Date(scrap.createdAt), { addSuffix: true })}</div>
                 {scrap.deal.length > 0 && <div className="text-green-500 flex items-center mt-2"><CircleDollarSign /> { scrap.deal.reduce((total, deal) => total + deal.price, 0) } SR</div>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) }
      </div>)}

		</div>
  )
}

export default MyScraps

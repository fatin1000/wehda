import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../lib/axios";
import { Link } from "react-router-dom";

import { Loader } from "lucide-react";


const MyScrapRes = () => {
    //scrap response that user make
    const { data: scrapResponse , isLoading : scrapResLoading } = useQuery({
      queryKey: ["scrapResponse"],
      queryFn: async () => {
        const res = await axiosInstance.get("/scrapResponse/myScrapResponses");
        return res.data;
      },
    });
    console.log(scrapResponse);
  return (
		<div className='relative w-full overflow-hidden'>
				{scrapResLoading ? (
					<div className="flex flex-col items-center mt-10 text-primary">
					<Loader size={40} className="animate-spin" />
				</div>
				) : scrapResponse.length === 0 ? (
					<div className="flex flex-col items-center mt-10">
						<p className="text-center text-2xl text-gray-500 font-semibold">You have not sent any offer yet 😴!</p>
						<Link to="/depot" className="bg-primary text-white py-3 px-9 rounded text-center mt-10 font-semibold hover:bg-orange-700 "> Make Some Now</Link>
					</div>
				): (
			<div>
			{ scrapResLoading ? <div><Loader className="animate-spin" />Loading...</div> :
						 scrapResponse.map((e) => (
								<div key={e._id} className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-2 flex-wrap p-4 border rounded-lg shadow-md mb-4">
									<div className="flex flex-col gap-2 md:flex-row">
									<div className="flex-shrink-0  md:size-40">
										<img src={e.scrap.image} alt={e.scrap.itemName.value} className='rounded size-full' />
									</div>
									<div >
									<Link to={`/scrap/${e.scrap._id}`} className='font-medium text-orange-500 md:text-2xl'>
										{e.scrap.itemName.value}
									</Link>
									<div className="my-2">
										<Link to={`/profile/${e.recipient._id}`} className='flex items-center gap-1 flex-wrap'>
											<div className='flex-shrink-0 h-10 w-10'>
												<div className='size-8 rounded-full overflow-hidden'>
													<img src={e.recipient.profilePic ? e.recipient.profilePic : "/avatar.png"} alt={e.recipient.username} />
												</div>
											</div>
											<div className='font-medium'>{e.recipient.username}</div>
										</Link>
									</div>
									<div className="flex flex-col gap-2 md:flex-row">
									<div className="flex items-center">
									<p className="text-gray-500">Quentity : </p>
									<span className='px-2 inline-flex  leading-5 font-semibold '>
										{e.quantity}
									</span>
									</div>
									<div className="flex items-center">
									<p className="text-gray-500">Price : </p>
									<span className='px-2 inline-flex  leading-5 font-semibold '>
										{e.price} SR
									</span>
									</div>
									</div>
									</div>
									</div>
									<span
										className={`px-3 py-2 text-xs leading-5 font-semibold rounded-full text-center ${
											e.status === "accepted" ? "bg-green-600 text-green-100"
											: e.status === "pending" ? "bg-yellow-500 text-yellow-100" : "bg-red-800 text-red-100"
										}`}
									>
										{e.status}
									</span>
								</div>
						 ))}
			</div>
        )}

				
			
		</div>
		
  )
}

export default MyScrapRes
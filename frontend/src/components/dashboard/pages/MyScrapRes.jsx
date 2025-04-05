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
			<div className='w-[100%] flex  rounded-lg border border-gray-300 p-2 overflow-x-auto lg:overflow-x-hidden'>
				<table className='table-auto bg-white rounded w-full overflow-x-auto p-3'>
					<thead className="text-gray-500">
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								Item
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								User
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								Quentity
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								Price
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
								Status
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{ scrapResLoading ? <div><Loader className="animate-spin" />Loading...</div> : scrapResponse.map((e) => (
							<tr key={e._id}>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className="flex items-center gap-1 flex-wrap">
									<div className="flex-shrink-0">
								<img src={e.scrap.image} alt={e.scrap.itemName.value} className='w-10 h-10 rounded' />
								</div>
									<Link to={`/scrap/${e.scrap._id}`} className='font-medium text-orange-500'>
										{e.scrap.itemName.value}
									</Link>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<Link to={`/profile/${e.recipient._id}`} className='flex items-center gap-1 flex-wrap'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full overflow-hidden'>
												<img src={e.recipient.profilePic ? e.recipient.profilePic : "/avatar.png"} alt={e.recipient.username} />
											</div>
										</div>
											<div className='font-medium'>{e.recipient.username}</div>
										
									</Link>
								</td>

								
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex  leading-5 font-semibold '>
										{e.quantity}
									</span>
								</td>

								<td className='px-6 py-4 '>
									<span className='px-2 inline-flex leading-5 font-semibold'>
										{e.price} SR
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											e.status === "accepted" ? "bg-green-600 text-green-100"
											: e.status === "pending" ? "bg-yellow-500 text-yellow-100" : "bg-red-800 text-red-100"
										}`}
									>
										{e.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		
        )}

				
			
		</div>
		
  )
}

export default MyScrapRes
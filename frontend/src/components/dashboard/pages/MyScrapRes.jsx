import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../lib/axios";
import { Link } from "react-router-dom";

import { Loader } from "lucide-react";
import { motion } from "framer-motion";


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
		<div className='flex flex-col'>

			<div className='mx-4'>

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
          <motion.div
			className='shadow-lg rounded-xl p-6 border bg-white'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold '>Your Offers</h2>
				
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
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
							<motion.tr
								key={e._id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className="flex items-center gap-1">
									{e.scrap.image && <img src={e.scrap.image} alt={e.scrap.itemName.value} className='w-10 h-10 rounded' />}
									<Link to={`/scrap/${e.scrap._id}`} className='font-medium text-orange-500'>
										{e.scrap.itemName.value}
									</Link>
									</div>
									
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<Link to={`/profile/${e.recipient._id}`} className='flex items-center gap-1'>
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
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
        )}

				
			</div>
		</div>
		
  )
}

export default MyScrapRes
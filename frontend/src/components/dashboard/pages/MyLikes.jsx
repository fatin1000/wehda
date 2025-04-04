import Header from "../components/common/Header";
import Dashboardlayout from "../../layout/DashboardLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../lib/axios";
import { Loader, X } from "lucide-react";
import { Link } from "react-router-dom";

const MyLikes = () => {

  const queryClient = useQueryClient();

const { data: myLikedScraps , isLoading: myLikedScrapsLoading, isError: myLikedScrapsError,isSuccess: myLikedScrapsSuccess } = useQuery({
	queryKey: ["myLikedScraps"],
	queryFn: async () => {
		const res = await axiosInstance.get("/users/likedScraps");
		return res.data;
	},
	});


const { mutate: likeScrap, isPending: isLikingScrap } = useMutation({
	mutationFn: async (id) => {
		await axiosInstance.post(`/scraps/${id}/like`);
	},
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["scraps"] });
		queryClient.invalidateQueries({ queryKey: ["scrap"] });
		queryClient.invalidateQueries({ queryKey: ["myLikedScraps"] });
	},
});
const myLikedScrapsArr = myLikedScrapsLoading ? [] : myLikedScraps.likedScraps;

  return (
    <Dashboardlayout>
		<div className='flex flex-col min-h-screen py-6 px-4 lg:px-8'>
			<Header title='The Items that you Like' />

     
			{ myLikedScrapsError ? (
				<div>Error</div>
			): myLikedScrapsArr?.length === 0 ? (
				<div className="flex flex-col items-center mt-10">
						<p className="text-center text-2xl text-gray-500 font-semibold">You have not liked any Scraps yet 🥱!</p>
						<Link to="/depot" className="bg-primary text-white py-3 px-9 rounded text-center mt-10 font-semibold hover:bg-orange-700 "> Make Some Now</Link>
					</div>
			): myLikedScrapsSuccess && (
				<>
		<div className='w-[100%]  rounded-lg border border-gray-300 p-2 overflow-x-auto lg:overflow-x-hidden '>
			<table className='table-fixed  bg-white rounded w-full min-w-fit p-3'>
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
							Unit Price
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
							Status
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
							Remove
						</th>
					</tr>
				</thead>

				<tbody className='divide-y divide-gray-700'>
					{ myLikedScrapsLoading ? <div><Loader className="animate-spin" />Loading...</div> : myLikedScrapsArr.map((e) => (
						<tr key={e._id}>
							<td className='px-6 py-4 whitespace-nowrap'>
							<div className="flex items-center gap-1 flex-wrap">
							<div className="flex-shrink-0">
  <img src={e.image} alt={e.itemName.value} className='w-10 h-10 rounded' />
</div>
									<Link to={`/scrap/${e._id}`} className='font-medium text-orange-500'>
										{e.itemName.value}
									</Link>
									</div>
							</td>
							<td className='px-6 py-4'>
								<Link to={`/profile/${e.author._id}`} className='flex items-center flex-wrap'>
									<div className='flex-shrink-0 h-10 w-10'>
										<div className='h-10 w-10 rounded-full overflow-hidden'>
											<img src={e.author.profilePic ? e.author.profilePic : "/avatar.png"} alt={e.author.username} />
										</div>
									</div>
									<div className='ml-4'>
										<div className='font-medium'>{e.author.username}</div>
									</div>
								</Link>
							</td>
							
							<td className='px-6 py-4 '>
								<span className='px-2 inline-flex  leading-5 font-semibold '>
									{e.quantity}{" "}{e.units}
								</span>
							</td>
							<td className='px-6 py-4 '>
								<span className='px-2 inline-flex  leading-5 font-semibold '>
									{e.unitPrice} SR
								</span>
							</td>
							

							<td className='px-6 py-4 whitespace-nowrap'>
								<span
									className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
										e.scrapStatus === "open" ? "bg-green-600 text-green-100"
										: "bg-red-800 text-red-100"
									}`}
								>
									{e.scrapStatus}
								</span>
							</td>

							<td className='px-6 py-4'>
								<button onClick={() => likeScrap(e._id)} disabled={isLikingScrap}>
									<X size={20} color="red"/>
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</>
			)}
		</div>
		</Dashboardlayout>
  )
}

export default MyLikes

import { Calendar, Check, CircleDollarSign, ExternalLink,  Loader, Trash2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../lib/axios";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MyScraps = () => {
  const queryClient = useQueryClient();

	//scrap response that user make
	const { data: userScraps , isLoading: scrapLoading } = useQuery({
		queryKey: ["userScraps"],
		queryFn: async () => {
			const res = await axiosInstance.get("/scraps/myScrapslist");
			return res.data;
		},
	});

  const { data: myScrapRes , isLoading: scrapResLoading } = useQuery({
		queryKey: ["myScrapRes"],
		queryFn: async () => {
			const res = await axiosInstance.get("/scrapResponse/sendedscrapResponses");
			return res.data;
		},
	});

  const { mutate: scrapRejectRequest } = useMutation({
    queryKey: ["scrapRejectRequest"],
		mutationFn: (requestId) => axiosInstance.put(`/scrapResponse/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Request rejected");
      queryClient.invalidateQueries({ queryKey: ["scrapResStatus"] });
      queryClient.invalidateQueries({ queryKey: ["scrapResponse"] });
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["userScraps"] });
      queryClient.invalidateQueries({ queryKey: ["myScrapRes"]});
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

  const { mutate: scrapAcceptRequest } = useMutation({
    queryKey: ["scrapAcceptRequest"],
		mutationFn: ([scrapId , resScrapId , dealQuntity]) => axiosInstance.put(`/scrapResponse/accept/${scrapId}/${resScrapId}/${dealQuntity}`),
		onSuccess: () => {
			toast.success("Request accepted");
      queryClient.invalidateQueries({ queryKey: ["scrapResStatus"] });
      queryClient.invalidateQueries({ queryKey: ["scrapResponse"] });
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["userScraps"] });
      queryClient.invalidateQueries({ queryKey: ["myScrapRes"]});
      
		},
		onError: (error) => {
      toast.error(error.response?.data?.error || "An error occurred");
    },
	});

  const myScrapsArr = scrapLoading ? [] : userScraps;
  const myScrapsResArr = scrapResLoading ? [] : myScrapRes;

  console.log(myScrapsArr , "myScrapsArr");
  console.log(myScrapsResArr , "myScrapsResArr");
  const handleScrapAccept = (scrapId , resScrapId ,scrapQuntity ,dealQuntity) => {
  
    if(scrapQuntity < dealQuntity){
      toast.error("You cannot accept this request because Scrap Quntity is less than deal Quntity");
      return;
    }else{
      scrapAcceptRequest([scrapId , resScrapId, dealQuntity])
    }
  }

  const { mutate: deleteScrap, isPending: isDeletingScrap } = useMutation({
		mutationFn: async (scrapId) => {
			await axiosInstance.delete(`/scraps/delete/${scrapId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["scraps"] });
      queryClient.invalidateQueries({ queryKey: ["userScraps"] });
      queryClient.invalidateQueries({ queryKey: ["myScrapRes"]});
			toast.success("Scrap deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

  const handleScrapDelete = (scrapId) => {
    if (!window.confirm("Are you sure you want to delete this scrap?")) return;
		deleteScrap(scrapId);
  }

  return (
    
		<div className='relative w-full '>
      {scrapLoading ? (<div className="flex flex-col items-center mt-10 text-primary"><Loader className="mr-2 animate-spin" size={40} /></div>) : (<div>
        {( myScrapsArr.length === 0 )? (
            <div className="flex flex-col items-center mt-10">
            <p className="text-center text-2xl text-gray-500 font-semibold">You didn&apos;t make any scrap yet 😥</p>
            <Link to="/create-scrap" className="bg-primary text-white py-3 px-9 rounded text-center mt-10 font-semibold hover:bg-orange-700">Make One Now</Link>
            </div>

        ) : scrapLoading ? "loading ..." : (
          <div className="w-full">
            {myScrapsArr.map((scrap) => (
              <div key={scrap._id} className= "flex flex-col mx-4  bg-white p-4 rounded-xl shadow mb-4">
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
                
                  <div className="flex">
                  <Link to={`/scrap/${scrap._id}`} className=" text-blue-400 py-2 px-4 rounded  hover:text-blue-500 me-2"><ExternalLink size={25} /></Link>
                  <button onClick={ () => handleScrapDelete(scrap._id)} className=" text-gray-500 py-2 px-4  hover:text-red-500" disabled={isDeletingScrap}><Trash2 size={25} /></button>
                  </div>
                  </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between mb-7">
                  
                  <div className="flex gap-2">
                    <div className="w-20 h-20 overflow-hidden rounded">
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
        
               { userScraps && ( (myScrapsResArr.filter((scrapRes) => (scrapRes.scrap._id === scrap._id)).length === 0) ? (<div className="bg-gray-200 p-4 rounded">
                  <h1 className=" text-gray-500">There are no offers yet</h1>
                </div>) :
                scrapResLoading ? "loading ..." :
                <div className="w-[100%]  rounded-lg border border-gray-300 p-2 overflow-x-auto lg:overflow-x-hidden">
                <table className="table-fixed  bg-white rounded w-full min-w-fit p-3">
                 
                  <tbody className="divide-y divide-gray-300 m-2" >
                { myScrapsResArr.map((scrapRes) =>(
                  (scrapRes.scrap._id == scrap._id) ?
                     ( <tr key={scrapRes._id} className="">
                              <td className="p-2">
                                <div>
                                <Link to={`/profile/${scrapRes.sender._id}`} className='flex flex-wrap'>
                                  <div className='flex-shrink-0 h-10 w-10'>
                                    <div className='h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden'>
                                      <img src={scrapRes.sender.profilePic ? scrapRes.sender.profilePic : "/avatar.png"} alt={scrapRes.sender.username} />
                                    </div>
                                  </div>
                                  <div className='ml-4'>
                                    <div className=' font-medium'>{scrapRes.sender.username}</div>
                                  </div>
                                </Link>
                                </div>
                              </td>
                              <td className="sm:hidden"></td>
                              <td className="p-2">
  
                                {scrapRes.quantity}{" "} {scrap.units}
                              </td>
                              <td className="sm:hidden"></td>
                              <td className="p-2">
                                {scrapRes.price} SR
                              </td>
                              <td className="sm:hidden"></td>
                              <td className="flex items-center p-2">
                                  {( scrapRes.quantity > scrap.quantity && scrapRes.status === "pending") ?
                                   (<div className="bg-gray-400 text-gray-700 py-2 px-4 rounded-full flex items-center gap-1 ">Auto Rejected</div>)
                                  :(scrapRes.status === "pending" && scrap.scrapStatus === "open") ? (
                                    <div className="flex items-center gap-2">
                                     <button onClick={() => handleScrapAccept(scrap._id, scrapRes._id,scrap.quantity,scrapRes.quantity) } className="bg-green-500 text-white py-2 px-4 rounded flex items-center gap-1 hover:bg-green-600"><Check size={18} /> Accepte</button>
                                     <button onClick={() => scrapRejectRequest(scrapRes._id)} className="bg-red-500 text-white py-2 px-4 rounded flex items-center gap-1 hover:bg-red-600"><X size={18} />Reject</button>   
                                    </div>)
                                  : ( scrapRes.status == "rejected") ? 
                                  (<div className="bg-red-200 text-red-700 py-2 px-4 rounded-full flex items-center gap-1 ">Rejected</div>)
                                  : (scrapRes.status == "accepted") ? 
                                  (<div className="bg-green-200 text-green-700 py-2 px-4 rounded-full flex items-center gap-1 ">Accepted</div>)
                                  : (
                                    <div className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full flex items-center gap-1 ">Auto Rejected</div>
                                  )}
                              </td>
                            </tr>): null )
                )}
                  </tbody>
                </table>
                </div>
              )}
              </div>
            ))}
          </div>
        ) }
      </div>)}

		</div>
  )
}

export default MyScraps

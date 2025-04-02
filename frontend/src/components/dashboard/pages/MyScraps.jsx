import { Calendar, Check, CircleDollarSign, Eye, Loader, Trash2, X } from "lucide-react";
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
			toast.success("Post request rejected");
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
			toast.success("Post request accepted");
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
    
		<div className='flex-1 overflow-auto relative'>
      {scrapLoading ? (<div className="flex flex-col items-center mt-10 text-primary"><Loader className="mr-2 animate-spin" size={40} /></div>) : (<div>
        {( myScrapsArr.length === 0 )? (
            <div className="flex flex-col items-center mt-10">
            <p className="text-center text-2xl text-gray-500 font-semibold">You didn&apos;t make any scrap yet 😥</p>
            <Link to="/create-scrap" className="bg-primary text-white py-3 px-9 rounded text-center mt-10 font-semibold hover:bg-orange-700">Make One Now</Link>
            </div>

        ) : scrapLoading ? "loading ..." : (
          <div className="flex flex-col gap-4">
            {myScrapsArr.map((scrap) => (
              <div key={scrap._id} className= "mx-4  bg-white p-4 rounded-xl shadow">
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
                  <Link to={`/scrap/${scrap._id}`} className="bg-blue-400 text-white py-2 px-4 rounded  hover:bg-blue-500 me-2"><Eye size={15} /></Link>
                  <button onClick={ () => handleScrapDelete(scrap._id)} className="bg-red-400 text-white py-2 px-4 rounded hover:bg-red-500" disabled={isDeletingScrap}><Trash2 size={15} /></button>
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
        
               { userScraps && ( (myScrapsResArr.length === 0) ? (<div className="bg-gray-200 p-4 rounded">
                  <h1 className=" text-gray-500">There are no offers yet</h1>
                </div>) :
                scrapResLoading ? "loading ..." : myScrapsResArr.map((scrapRes) =>(
                  (scrapRes.scrap._id == scrap._id) ?
                     ( <div key={scrapRes._id} className="flex justify-between items-center bg-white p-4 rounded shadow my-2 ">
                                <Link to={`/profile/${scrapRes.sender._id}`} className='flex items-center'>
                                  <div className='flex-shrink-0 h-10 w-10'>
                                    <div className='h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden'>
                                      <img src={scrapRes.sender.profilePic ? scrapRes.sender.profilePic : "/avatar.png"} alt={scrapRes.sender.username} />
                                    </div>
                                  </div>
                                  <div className='ml-4'>
                                    <div className=' font-medium'>{scrapRes.sender.username}</div>
                                  </div>
                                </Link>
                                <div className="divider divider-horizontal"></div>
                                <span className='px-2 inline-flex  leading-5 font-semibold '>
                                {scrapRes.quantity}{" "} {scrap.units}
                                </span>
                                <div className="divider divider-horizontal"></div>
                                <div className='px-2 inline-flex  leading-5 font-semibold'>
										              {scrapRes.price} SR
									              </div>
                                <div className="divider divider-horizontal"></div>
                                
                                <div >
                                  {( scrapRes.quantity > scrap.quantity && scrapRes.status === "pending") ?
                                   (<div className="bg-gray-400 text-gray-700 py-2 px-4 rounded-full flex items-center gap-1 ">Auto Rejected</div>)
                                  :(scrapRes.status === "pending" && scrap.scrapStatus === "open") ? (
                                    <div className="flex items-center gap-2">
                                     <button onClick={() => handleScrapAccept(scrap._id, scrapRes._id,scrap.quantity,scrapRes.quantity) } className="bg-green-500 text-white py-2 px-4 rounded flex items-center gap-1 hover:bg-green-600"><Check size={18} /> Accepte</button>
                                     <button onClick={() => scrapRejectRequest(scrapRes._id)} className="bg-red-500 text-white py-2 px-4 rounded flex items-center gap-1 hover:bg-red-600"><X size={18} />Reject</button>   
                                    </div>)
                                  : ( scrapRes.status == "rejected") ? 
                                  (<div className="bg-red-200 text-red-700 py-2 px-4 rounded-full flex items-center gap-1 ">You Reject this offer</div>)
                                  : (scrapRes.status == "accepted") ? 
                                  (<div className="bg-green-200 text-green-700 py-2 px-4 rounded-full flex items-center gap-1 ">You Accept this offer</div>)
                                  : (
                                    <div className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full flex items-center gap-1 ">Auto Rejected</div>
                                  )}
                                 </div>

                            </div>): null )
                ))}
              </div>
            ))}
          </div>
        ) }
      </div>)}

		</div>
  )
}

export default MyScraps

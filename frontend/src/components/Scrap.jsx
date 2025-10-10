/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, CircleX, Clock, Loader, MapPin, MessageCircle, PartyPopper, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostAction from "./PostAction";
import { useTranslation } from "react-i18next";

const Scrap = ({ scrap }) => {
	const { t } = useTranslation();
	const { scrapId } = useParams();
	const navigate = useNavigate();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState(scrap.comments || []);
	const isOwner = (authUser) ? authUser._id === scrap.author._id : false;
	const isLiked = (authUser) ? scrap.likes.includes(authUser._id) : false;

	const queryClient = useQueryClient();

	const { mutate: deleteScrap, isPending: isDeletingScrap } = useMutation({
		mutationFn: async () => {
			await axiosInstance.put(`/scraps/delete/${scrap._id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["scraps"] });
			toast.success("Scrap deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: createComment, isPending: isAddingComment } = useMutation({
		mutationFn: async (newComment) => {
			await axiosInstance.post(`/scraps/${scrap._id}/comment`, { content: newComment });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["scraps"] });
			toast.success("Comment added successfully");
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to add comment");
		},
	});

	const { mutate: likeScrap, isPending: isLikingScrap } = useMutation({
		mutationFn: async () => {
			await axiosInstance.post(`/scraps/${scrap._id}/like`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["scraps"] });
			queryClient.invalidateQueries({ queryKey: ["scrap", scrapId] });
		},
	});

	const handleDeleteScrap = () => {
		if (!window.confirm("Are you sure you want to delete this scrap?")) return;
		deleteScrap();
	};

	const handleLikeScrap = async () => {
		if (isLikingScrap) return;
		if(!authUser){
			return toast.error("Please login to like scrap");
		}else{
			likeScrap();
		}
	};

	const handleAddComment = async (e) => {
		e.preventDefault();
		if(authUser === null){
			return toast.error("Please login to comment");
		}else{
			if (newComment.trim()) {
				createComment(newComment);
				setNewComment("");
				setComments([
					...comments,
					{
						content: newComment,
						user: {
							_id: authUser._id,
							name: authUser.username,
							profilePic: authUser.profilePic,
						},
						createdAt: new Date(),
					},
				]);
			}
		}
		
	};

		
	const { data: scrapResStatus, isLoading : scrapResStatusLoading } = useQuery({
		queryKey: ["scrapResStatus", scrap._id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/scrapResponse/status/${scrap._id}`);
			return res.data;
		},
	});

	const handleShare = async (scrapId ) => {
		const scrapURL = `${window.location.origin}/scrap/${scrapId}`;
	
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Check this scrap!",
					text: `Look at this deal I found! 🏷️\n\n${scrapURL}`,
					url: scrapURL
				});
			} catch (error) {
				console.error("Error sharing:", error);
			}
		} else {
			alert("Sharing is not supported in your browser.");
		}
	};

	const renderButton = () => {
		if (scrapResStatus) {
			if (scrapResStatusLoading) {
				return (
					<button className='btn px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500' disabled>
						{t("loading")}
					</button>
				);
			}
			switch (scrapResStatus[0]?.status) {
				case "pending":
					return (
						<div className="m-4 bg-yellow-100 text-yellow-700 p-4 rounded-full flex flex-col items-center">
							<p className="flex justify-center items-center gap-2 font-semibold"><Clock size={20} /> {t("status.pending")}</p>
							<p>{t("message.pending")}</p>
						</div>
					);
				case "accepted":
					return (
						<div>
							<div className="m-4 bg-green-100 text-green-600 p-4 rounded-full flex flex-col items-center">
								<p className="flex justify-center items-center gap-2 font-semibold"><PartyPopper size={20} /> {t("status.accepted")}</p>
								<p>{t("message.accepted")}</p>
							</div>
							<p className="text-gray-500 text-sm">{t("action.sendNew")}</p>
							<Link to={`/scrap/${scrap._id}`} className="btn btn-primary mt-4 px-4 py-2 mb-4 w-full">{t("action.makeDeal")}</Link>
						</div>
					);
				case "rejected":
					return (
						<div>
							<div className="m-4 bg-red-100 text-red-600 p-4 rounded-full flex flex-col items-center">
								<p className="flex justify-center items-center gap-2 font-semibold"><CircleX size={20} /> {t("status.rejected")}</p>
								<p>{t("message.rejected")}</p>
							</div>
							<p className="text-gray-500 text-sm">{t("action.sendNew")}</p>
							<Link to={`/scrap/${scrap._id}`} className="btn btn-primary mt-4 px-4 py-2 mb-4 w-full">{t("action.makeDeal")}</Link>
						</div>
					);
				case "auto Rejected":
					return (
						<div className="m-4 bg-gray-400 text-gray-900 p-4 rounded-full flex flex-col items-center">
							<p className="flex justify-center items-center gap-2 font-semibold"><CircleX size={20} /> {t("status.autoRejected")}</p>
							<p>{t("message.autoRejected")}</p>
						</div>
					);
				default:
					return (
						<Link to={`/scrap/${scrap._id}`} className="btn btn-primary mt-4 px-4 py-2 mb-4 w-full">{t("action.makeDeal")}</Link>
					);
			}
		} else {
			return (
				<Link to={`/scrap/${scrap._id}`} className="btn btn-primary mt-4 px-4 py-2 mb-4 w-full">{t("action.makeDeal")}</Link>
			);
		}
	};
    


	return (
		<div key={scrap._id} className='bg-white rounded-lg shadow mb-4'  >
			{isOwner && (
				<div className="flex justify-end gap-2">
						<button onClick={handleDeleteScrap} className='text-xs text-red-600 p-2  hover:text-red-700'>
							{isDeletingScrap ? <Loader size={18} className='animate-spin' /> : <Trash2 size={20} />}
						</button>
				</div>	)}

			{!isOwner && (
				<div className="flex justify-end gap-2">
						{scrap.scrapStatus === "open" ? 
							<div className="flex justify-end gap-2">
								<span className="text-xs bg-green-600 text-white rounded-bl-lg p-2">{t("status.open")}</span>
							</div> 
							: 
							<div className="flex justify-end gap-2">
								<span className="text-xs bg-red-600 text-white rounded-bl-lg p-2">{t("status.expired")}</span>
							</div>
						}
				</div>
			)}
			<div className='p-8'>
				<div className='flex items-center justify-between mb-6'>
					<div className='flex items-center'>
						<Link to={`/profile/${scrap?.author?._id}`} className="bg-white size-12 rounded-full mr-3 shadow-xl border border-gray-300 p-1 overflow-hidden">
							<img
								src={scrap.author.profilePic || "/avatar.png"}
								alt={scrap.author.username}
								className='object-cover rounded-full '
							/>
						</Link>

						<div>
							<Link to={`/profile/${scrap?.author?._id}`}>
								<h3 className='font-semibold'>{scrap.author.username}</h3>
							</Link>
							<p className='text-xs text-gray-500'>{t(`auth.${(scrap.author.headline).toLowerCase()}`)}</p>
							
						</div>
					</div>
					<div>
						<p className='text-gray-500 text-xs flex items-center gap-1'>
						<Calendar size={15} />{formatDistanceToNow(new Date(scrap.createdAt), { addSuffix: true })}
						</p>
						<p className="text-gray-500 mt-1 text-sm flex items-center gap-1">
						<MapPin size={15} />{t(`cities.${scrap.location}`)}
						</p>
						
					</div>
					
				</div>
				{scrap.image && <div>
					<img
						src={scrap.image}
						alt={scrap.itemName}
						className='w-full h-[300px] object-cover rounded-lg cursor-pointer'
						onClick={() => navigate(`/scrap/${scrap._id}`)}
					/>
				</div>}
                <p className="text-sm mb-2 text-gray-500 mt-2">{t(`categories.${scrap.category}`)}</p>
				<h3 className="font-bold mb-2 text-primary ms-2 sm:text-lg cursor-pointer" onClick={() => navigate(`/scrap/${scrap._id}`)}>{t(`items.${scrap.itemName.value}`)}</h3>
				<div>
  <p className="text-gray-500">
    {scrap.quantity === 0 ? (
      <span className="bg-red-600 font-bold text-white py-1 px-4">{t("label.soldOut")}</span>
    ) : (
      <>
        {t("label.quantity")} :{" "}
        {scrap.quantity === scrap.oldQuantity ? (
          <span className="text-gray-900 font-semibold">{scrap.quantity}</span>
        ) : (
          <span className="text-white font-semibold">
            {scrap.quantity}
            <span className="text-gray-500 font-normal">
              {" "}{t("label.leftOf")} <span className="font-semibold">{scrap.oldQuantity}</span>
            </span>
          </span>
        )}{" "}
        {t(`units.${scrap.units}`)}
      </>
    )}
  </p>
</div>
				
			{ scrap.discription && (
				<div>
					<p className="mb-2 text-gray-500 inline-block ">{t("label.description")}</p>
					<h3 className="mb-2 inline-block text-sm text-gray-300 ms-2 sm:text-lg">{scrap.discription}</h3>
				</div>
			)}

			<div>
				<p className="mb-2 text-gray-500 inline-block">{t("label.itemStatus")}</p>
				<p className=" mb-2 inline-block ms-2">{t(`status.${scrap.itemStatus}`)}</p>
			</div>
				{ !isOwner && scrap.scrapStatus === "open" && (
					renderButton()
				)}
				{/* {scrap.image && <img src={scrap.image} alt='Scrap content' className='rounded-lg w-full mb-4' />} */}

				<div className='flex justify-between text-info'>
					<PostAction
						icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
						text={`${t("action.like")} (${scrap.likes.length})`}
						onClick={handleLikeScrap}
					/>

					<PostAction
						icon={<MessageCircle size={18} />}
						text={`${t("action.comment")} (${comments.length})`}
						onClick={() => setShowComments(!showComments)}
					/>
					<PostAction
						 icon={<Share2 size={18} />} 
						 text={t("action.share")} 
						 onClick={() => handleShare(scrap._id)} />
				</div>
			</div>

			{showComments && (
				<div className='px-4 pb-4'>
					<div className='mb-4 max-h-60 overflow-y-auto'>
						{comments.map((comment) => (
							<div key={comment._id} className='mb-2 bg-gray-100 p-2 rounded flex items-start'>
								<img
									src={comment.user.profilePic || "/avatar.png"}
									alt={comment.user.username}
									className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
								/>
								<div className='flex-grow'>
									<div className='flex justify-between items-center mb-1'>
										<span className='font-semibold mr-2'>{comment.user.username}</span>
										<span className='text-xs text-gray-500'>
											{formatDistanceToNow(new Date(comment.createdAt))}
										</span>
									</div>
									<p>{comment.content}</p>
								</div>
							</div>
						))}
					</div>

					{ authUser && (<form onSubmit={handleAddComment} className='flex items-center'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder={t("comment.placeholder")}
							className=' flex-grow p-3 rounded-s-full bg-gray-100'
						/>
						<button
							type='submit'
							className='bg-primary text-white p-3 rounded-e-full hover:bg-primary-dark transition duration-300'
							disabled={isAddingComment}
						>
							{isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
						</button>
					</form>)}
					{ !authUser && (<p className='text-sm text-red-500 mt-2 text-center'>{t("comment.loginRequired")}</p>)}
				</div>
			)}
		</div>
	);
};
export default Scrap;

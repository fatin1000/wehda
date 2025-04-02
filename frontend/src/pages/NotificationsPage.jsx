import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ExternalLink, Eye, Handshake, Info, MessageSquare, MessageSquareWarning, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { Link} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
const NotificationsPage = () => {

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const queryClient = useQueryClient();


	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => axiosInstance.get("/notifications"),
	});

	const { mutate: markAsReadMutation } = useMutation({
		mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
		},
	});

	const { mutate: deleteNotificationMutation } = useMutation({
		mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
			toast.success("Notification deleted");
		},
	});

	const { mutate: deleteAllNotifications ,isPending:deleteAllPending } = useMutation({
		mutationFn: () => axiosInstance.delete(`/notifications/deleteAll`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
			toast.success("All Notification deleted");
		},
	});
	useEffect(() => {
		const timer = setTimeout(() => {
			// هنا يمكنك استدعاء الميوتيشن لجعل التنبيهات "read"
			notifications.data.forEach((notification) => {
				if (!notification.read) {
					markAsReadMutation(notification._id);
				}
			});
		}, 5000); // 5000 ميلي ثانية = 5 ثانية
	
		// تنظيف المؤقت عند مغادرة الصفحة
		return () => clearTimeout(timer);
	}, [notifications, markAsReadMutation]);
	
	const renderNotificationIcon = (type) => {
		switch (type) {
			case "like":
				return <ThumbsUp className='text-blue-500' />;
            case "like scrap":
                return <ThumbsUp className='text-blue-500' />;
			case "comment":
				return <MessageSquare className='text-yellow-400' />;
			case "follow":
				return <UserPlus className='text-purple-500' />;
            case "offer":
                return <MessageSquareWarning className='text-read-500' /> ;
            case "deal":
                return <Handshake className='text-green-500' />;
			case "offer Accepted":
				return <Handshake className="text-orange-500" />;
			default:
				return <Info className='text-gray-700' />;
		}
	};

	const renderNotificationContent = (notification) => {
		switch (notification.type) {
			
            case "like scrap":
                return (
                    <span>
                        <strong>{notification.relatedUser.username}</strong> like your scrap
                    </span>
                );
			case "comment":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser._id}`} className='font-bold'>
							{notification.relatedUser.username}
						</Link>{" "}
						Comment in your Item
					</span>
				);
			case "follow":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser._id}`} className='font-bold'>
							{notification.relatedUser.username}
						</Link>{" "}
                        Following you now
					</span>
				);
            case "offer":
                return (
                    <span>
                        <Link to={`/profile/${notification.relatedUser._id}`} className='font-bold'>
                            {notification.relatedUser.username}
                        </Link>{" "}
                        You have a new offer
                    </span>
                );
            case "deal":
                return (
                    <span>
                        <Link to={`/profile/${notification.relatedUser._id}`} className='font-bold'>
                            {notification.relatedUser.username}
                        </Link>{" "}
                        You have a new deal
                    </span>
                );
			case "offer Accepted":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser._id}`} className='font-bold'>
							{notification.relatedUser.username}
						</Link>{" "}
						🎉 You Offer has been accepted
					</span>
				);
			case "offer rejected":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser._id}`} className='font-bold'>
							{notification.relatedUser.username}
						</Link>{" "}
						You Offer has been rejected
					</span>
				);
			case "deal Accepted":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser._id}`} className='font-bold'>
							{notification.relatedUser.username}
						</Link>{" "}
						 You Deal has been accepted
					</span>
				);
			case "deal rejected":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser._id}`} className='font-bold'>
							{notification.relatedUser.username}
						</Link>{" "}
						 You Deal has been rejected
					</span>
				);
			default:
				return null;
		}
	};
    const renderRelatedScrap = (relatedScrap) => {
		if (!relatedScrap) return null;

		return (
			<Link
				to={`/scrap/${relatedScrap._id}`}
				className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors'
			>
				{relatedScrap.image && (
					<img src={ relatedScrap.image } alt='Scrap preview' className='w-10 h-10 object-cover rounded' />
				)}
				<div className='flex-1 overflow-hidden'>
					<p className='text-sm text-gray-600 truncate'>Show Scrap</p>
				</div>
				<ExternalLink size={14} className='text-gray-400' />
			</Link>
		);
	};

	return (
		<div className='grid grid-cols-1 px-4 py-6 lg:grid-cols-4 gap-6'>
           
			<div className='hidden lg:block col-span-1'>
				<Sidebar user={authUser} />
			</div>
			<div className='col-span-1 lg:col-span-3'>
				<div className='bg-white rounded-lg shadow p-6'>
					<div className="flex justify-between items-center">
						<h1 className='text-2xl font-bold mb-6'>Notifications</h1>
						<button onClick={deleteAllNotifications} className='bg-red-500 hover:bg-red-600 text-sm text-white px-3 py-2 rounded-lg' disabled={deleteAllPending}>Delete All</button>
					</div>
					{isLoading ? (
						<p>Loading notifications...</p>
					) : notifications && notifications.data.length > 0 ? (
						<ul>
							{notifications.data.map((notification) => (
								<li
									key={notification._id}
									className={` border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
										!notification.read ? "bg-blue-200" : "bg-white"
									}`}
								>
									<div className='flex items-start justify-between'>
										<div className='flex items-center space-x-4'>
										<div className='p-3 bg-gray-100 rounded-full'>
														{renderNotificationIcon(notification.type)}
													</div>
											
											<div>
												<div className='flex items-center gap-2'>
												<Link to={`/profile/${notification.relatedUser._id}`}>
												<img
													src={notification.relatedUser.profilePic || "/avatar.png"}
													alt={notification.relatedUser.username}
													className='size-9 rounded-full object-cover'
												/>
											</Link>

													<p className='text-sm'>{renderNotificationContent(notification)}</p>
												</div>
												<p className='text-xs text-gray-500 mt-1'>
													{formatDistanceToNow(new Date(notification.createdAt), {
														addSuffix: true,
													})}
												</p>
												{renderRelatedScrap(notification.relatedScrap)}
											</div>
										</div>

										<div className='flex gap-2'>
											{!notification.read && (
												<button
													onClick={() => markAsReadMutation(notification._id)}
													className='p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
													aria-label='Mark as read'
												>
													<Eye size={16} />
												</button>
											)}

											<button
												onClick={() => deleteNotificationMutation(notification._id)}
												className='p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
												aria-label='Delete notification'
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p>No notification at the moment.</p>
					)}
				</div>
			</div>
		</div>
	);
};
export default NotificationsPage;

/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader, UserPlus} from "lucide-react";

const RecommendedUser = ({ user }) => {
	const queryClient = useQueryClient();

	const { mutate: follow , isLoading} = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/users/follow/${userId}`),
		onSuccess: () => {
			toast.success("Followed successfully");
			queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] }),
			queryClient.invalidateQueries({ queryKey: ["authUser"] })
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});
	return (
		<div className='flex items-center justify-between mb-4'>
			<Link to={`/profile/${user._id}`} className='flex items-center flex-grow'>
				<img
					src={user.profilePic ? user.profilePic : "/avatar.png"}
					alt={user.username}
					className='w-12 h-12 rounded-full mr-3'
				/>
				<div>
					<h3 className='font-semibold text-sm'>{user.username}</h3>
					<p className='text-xs text-info'>{user.headline}</p>
				</div>
			</Link>
			<button className="flex items-center gap-2" onClick={() => follow(user._id)}> 
				{isLoading ? <Loader size={20} className="animate-spin"/> : <UserPlus size={20}  className="hover:text-orange-600"/>}
                  
            </button>
		</div>
	);
};
export default RecommendedUser;

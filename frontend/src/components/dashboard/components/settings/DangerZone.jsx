import { useMutation} from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../../lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DangerZone = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const { mutate: deleteAccount , isPending} = useMutation({
		mutationFn: () => axiosInstance.put('/users//deleteAccount'),
		onSuccess: () => {
			toast.success("Followed successfully");
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});
	return (
		<div
			className='bg-red-500 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border  mb-8'
		>
			<div className='flex items-center mb-4'>
				<Trash2 className='text-red-400 mr-3' size={24} />
				<h2 className='text-xl font-semibold text-white'>Danger Zone</h2>
			</div>
			<p className='text-gray-100 mb-4'>Permanently delete your account and all of your content.</p>
			<button
				className='btn border-none bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
      transition duration-200'
	  onClick={()=> setIsOpen(true)}
			>
				Delete Account
			</button>

			{isOpen && (
				
					<div className='bg-white p-6 rounded-lg shadow-lg absolute top-0 left-0 w-full h-full flex flex-col justify-center z-50 border border-gray-300'>
						<h2 className='text-lg font-semibold mb-4'>Are you sure you want to delete your account?</h2>
						<div className='flex'>
							<button
								className='btn bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded mr-2'
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</button>
							<button
								className='btn bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded'
								onClick={() => {deleteAccount(); navigate("/") }}
								disabled={isPending}
							>
								Delete
							</button>
						</div>
					</div>
				
			)}
		</div>
	);
};
export default DangerZone;

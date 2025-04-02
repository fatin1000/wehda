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
			className='bg-red-500 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border  mb-8 '
		>
			<div className='flex items-center mb-4'>
				<Trash2 className='text-red-400 mr-3' size={24} />
				<h2 className='text-xl font-semibold text-white'>Danger Zone</h2>
			</div>
			<p className='text-gray-100 mb-4'>Permanently delete your account and all of your content.</p>
			<button
				className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
      transition duration-200'
	  onClick={()=> setIsOpen(true)}
			>
				Delete Account
			</button>

			{isOpen && (
				<div className=' fixed inset-0 flex items-center justify-center z-50 border border-gray-300'>
					<div className='bg-white p-6 rounded-lg shadow-lg'>
						<h2 className='text-lg font-semibold mb-4'>Are you sure you want to delete your account?</h2>
						<div className='flex justify-center'>
							<button
								className='bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2'
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</button>
							<button
								className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
								onClick={() => {deleteAccount(); navigate("/") }}
								disabled={isPending}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default DangerZone;

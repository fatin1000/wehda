import { Lock, X } from "lucide-react";
import SettingSection from "./SettingSection";
import { useState } from "react";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Security = () => {
	// const [twoFactor, setTwoFactor] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const queryClient = useQueryClient();

	const { mutate: updatePassword , isPending} = useMutation({
		mutationFn: (updatedData) => axiosInstance.put('/users/updatePassword', updatedData),
		onSuccess: () => {
			toast.success("Followed successfully");
			setShowPassword(false);
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");

		},
	});
	const handelPassword = (updatedData) =>{
		updatePassword(updatedData);
	}
	return (
		<SettingSection icon={Lock} title={"Security"}>
			{/* <ToggleSwitch
				label={"Two-Factor Authentication"}
				isOn={twoFactor}
				onToggle={() => setTwoFactor(!twoFactor)}
			/>
			 */}
			<div className='mt-4 relative'>
				<button
					className='bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded 
        transition duration-200'
					onClick={() => setShowPassword(true)}
				>
					Change Password
				</button>
				{showPassword && (
					<form className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md border border-gray-300 shadow-lg z-10'
					onSubmit={(e) => {
						e.preventDefault();
						if (newPassword !== confirmPassword) {
							toast.error("NewPasswords do not match");
							return;
						}
						handelPassword({
							oldPassword,
							newPassword,
						});
					}}
					>
						<X className=" text-red-500 hover:text-red-600 cursor-pointer absolute top-2 right-2" onClick={() => setShowPassword(false)} />
						<div className="flex flex-col w-full">
						<h2 className='text-lg font-semibold mb-4'>Change Password</h2>
						
						</div>
						
						<input
							type='password'
							placeholder='Old Password'
							className='w-full p-2 border rounded-md'
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
						<input
							type='password'
							placeholder='New Password'
							className='w-full p-2 border rounded-md mt-2'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full p-2 border rounded-md mt-2'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<button
							className='bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded 
		  					transition duration-200 mt-4'
							type='submit'
							disabled={isPending}
						>
							Save Password
						</button>
					</form>
				)}
			</div>
		</SettingSection>
	);
};
export default Security;

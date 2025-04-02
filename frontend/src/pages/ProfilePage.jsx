import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";

import ProfileHeader from "../components/profile/ProfileHeader";
import toast from "react-hot-toast";
import ContactInfo from "../components/profile/ContactInfo.jsx";
import Service from "../components/profile/Service.jsx";
import Sidebar from "../components/Sidebar.jsx";


const ProfilePage = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();

	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
	});

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", id],
		queryFn: () => axiosInstance.get(`/users/${id}`),
	});

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", id]);
		},
	});

	if (isLoading || isUserProfileLoading) return null;

	const isOwnProfile = authUser.username === userProfile?.data.username;
	const userData = isOwnProfile ? authUser : userProfile.data;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className={isOwnProfile ? "max-w-4xl mx-auto p-4" : "grid grid-cols-1 px-4 py-6 lg:grid-cols-4 gap-6"}>

			{!isOwnProfile ? (<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>) :null}
			<div className={isOwnProfile ? "col-span-1 lg:col-span-4 max-w-5xl ":'col-span-1 lg:col-span-3'}>
				<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
				<ContactInfo userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
				<Service userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			</div>
		</div>
		
	);
};
export default ProfilePage;

/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";

import { Building2, Camera, ClipboardCheck, MapPin, Pencil, UserPlus, X } from "lucide-react";
import { cityOptions, headlineOptions } from "../../data/options";
import { useTranslation } from "react-i18next";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const queryClient = useQueryClient();

	const { t } = useTranslation();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const isfollowing = authUser.following.some((following) => following === userData._id);

	const { mutate: follow, isPending } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/users/follow/${userId}`),
		onSuccess: () => {
			toast.success("Followed successfully");
			queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["network"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile", userData.username] })
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});
	const renderFollowButton = () => {
		const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";

		if (isfollowing) {
			return (
				<button
					className={isPending ? `${baseClass} bg-gray-500 cursor-not-allowed` : `${baseClass} bg-red-400 hover:bg-red-600`}
					onClick={() => {
						follow(userData._id);
					}}
				>
					<X size={20} className='mr-2' />
					Unfollow
				</button>
			);
		} else {
			return (
				<button
					className={isPending ? `${baseClass} bg-gray-500 cursor-not-allowed` : `${baseClass} bg-blue-500 hover:bg-blue-600`}
					onClick={() => {
						follow(userData._id);
					}}
				>
					<UserPlus size={20} className='mr-2' />
					Follow
				</button>
			);
		}
	}

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

	return (
		<div className='bg-white shadow rounded-lg mb-6'>
			<div
				className='relative h-48 rounded-t-lg bg-cover bg-center'
				style={{
					backgroundImage: `url('${editedData.bannerPic || userData.bannerPic || "/banner.png"}')`,
				}}
			>
				{isEditing && (
					<label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
						<Camera size={20} />
						<input
							type='file'
							className='hidden'
							name='bannerPic'
							onChange={handleImageChange}
							accept='image/*'
						/>
					</label>
				)}
			</div>

			<div className='p-4'>
				<div className='relative -mt-20 mb-4 '>
					<img
						className='w-32 h-32 rounded-full object-cover bg-white border-4 border-white shadow-lg'
						src={editedData.profilePic || userData.profilePic || "/avatar.png"}
						alt={userData.username}
					/>

					{isEditing && (
						<label className='relative bottom-0  transform translate-x-16 bg-white  rounded-full shadow cursor-pointer'>
							<Camera size={20}  />
							<input
								type='file'
								className='hidden'
								name='profilePic'
								onChange={handleImageChange}
								accept='image/*'
							/>
						</label>
					)}
				</div>
				<div className="px-6 mb-4 flex flex-col gap-2 sm:flex-row justify-between">
					<div>
						{isEditing ? (
							<input
								type='text'
								value={editedData.username ?? userData.username}
								onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
								className='text-2xl font-bold mb-2 text-center w-full border'
							/>
						) : (
							<h1 className='text-2xl font-bold mb-2'>{userData.username}</h1>
						)}


						{/* the next fatuer should be the headline */}
						{/* {isEditing ? (
						<select
							id="headline"
							name="headline"
							onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
							className="w-full border rounded p-1"
						>
							<option selected={true} disabled>Select Headline</option>
							{headlineOptions.map( e => <option key={e.value} value={e.value}>{t(e.label)}</option>)}
						</select>
					) : (
						<p className='text-gray-600'>{t(`auth.${(userData.headline)}`)}</p>
					)} */}

						<p className='text-gray-600'>{t(`auth.${(userData.headline).toLowerCase()}`)}</p>
						{!isEditing && (<div className="text-gray-500 mt-6">
							<span className="me-4">{t("profile.followers")}: {userData.followers.length}</span>
							<span>{t("profile.following")}: {userData.following.length}</span>
						</div>)}

					</div>


					<div>
						<div className='flex items-center'>
							<MapPin size={16} className='text-gray-500 mr-1' />
							{isEditing ? (
								<select
									id="city"
									name="city"
									onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
									value={editedData.location ?? userData.location}
									className="w-full border rounded p-1"
								>
									{cityOptions.map(e => <option key={e.value} value={e.value}>{t(e.label)}</option>)}
								</select>
							) : (
								<span className='text-gray-700'>{t(`cities.${userData.location}`)}</span>
							)}
						</div>

						<div className='flex items-center my-2'>
							<Building2 size={16} className='text-gray-500 mr-1' />
							{isEditing ? (
								<input
									type='text'
									value={editedData.company ?? userData.company}
									onChange={(e) => setEditedData({ ...editedData, company: e.target.value })}
									className='text-gray-700 text-center border'
								/>
							) : (
								<span className='text-gray-700'>{userData.company}</span>
							)}
						</div>

						{isOwnProfile ? (
							isEditing ? (
								<button
									className='mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-green-700
							 transition duration-300 sm:w-auto'
									onClick={handleSave}
								>
									<ClipboardCheck className="size-4" />{t("profile.save")}
								</button>
							) : (
								<button
									onClick={() => setIsEditing(true)}
									className='mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-blue-700
							 transition duration-300'
								>
									<Pencil className="size-4" />{t("profile.edit")}
								</button>
							)
						) : (
							<div className='flex justify-center mt-6'>{renderFollowButton()}</div>
						)}
					</div>
				</div>


			</div>
		</div>
	);
};
export default ProfileHeader;

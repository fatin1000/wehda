/* eslint-disable react/prop-types */
import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { Link } from "react-router-dom";

const Profile = ({ img ,username ,headline ,id}) => {
	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6 '>
				<img
					src={img}
					alt={username}
					className='rounded-full w-20 h-20 object-cover mr-4'
				/>

				<div>
					<h3 className='text-lg font-semibold '>{username}</h3>
					<p className='text-gray-500'>{headline}</p>
				</div>
			</div>

			<Link to={`/profile/${id}`} className='bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'>
				Edit Profile
			</Link>
		</SettingSection>
	);
};
export default Profile;

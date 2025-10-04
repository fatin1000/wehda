/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Home, UserPlus, BicepsFlexed, Hammer } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function Sidebar({ user }) {
	const { t } = useTranslation();
	if (!user) {
		return null;
	}
	return (
		<div className='bg-white rounded-lg shadow mb-4'>
			<div className='text-center'>
				<div
					className='h-20 rounded-t-lg bg-cover bg-center'
					style={{
						backgroundImage: `url("${user.bannerPic || "/banner.png"}")`,
					}}
				/>
				<Link to={`/profile/${user._id}`} >
					<img
						src={user.profilePic || "/avatar.png"}
						alt={user.username}
						className='w-20 h-20 rounded-full mx-auto mt-[-40px] bg-white border-2 border-white shadow'
					/>
					<h2 className='text-xl font-semibold mt-2'>{user.username}</h2>
				</Link>
				<p className='text-info'>{t(`auth.${(user.headline).toLowerCase()}`)}</p>
				<p className="text-info text-xs">
				{(user.followers?.length || 0)} {t("user.followers")}
				</p>
			</div>
			<div className='border-t border-base-100 p-4'>
				<nav>
					<ul className='space-y-2'>
						<li>
							<Link
								to='/depot'
								className='flex items-center py-2 px-4 rounded-md hover:bg-orange-500 hover:text-white transition-colors'
							>
								<Home className='me-2' size={20} /> {t("navbar.Home")}
							</Link>
						</li>

						<li>
							<Link
								to="/dashboard"
								className='flex items-center py-2 px-4 rounded-md hover:bg-orange-500 hover:text-white transition-colors'
							>
								<UserPlus className='me-2' size={20} /> {t("navbar.Dashboard")}
							</Link>
						</li>
						<li>
							<Link
								to='/services'
								className='flex items-center py-2 px-4 rounded-md hover:bg-orange-500 hover:text-white transition-colors'
							>
								<Hammer className='me-2' size={20} /> {t("navbar.service1")}
							</Link>
						</li>
						<li>
							<Link
								to='/workers'
								className='flex items-center py-2 px-4 rounded-md hover:bg-orange-500 hover:text-white transition-colors'
							>
								<BicepsFlexed className='me-2' size={20} /> {t("navbar.service2")}
							</Link>
						</li>
					</ul>
				</nav>
			</div>
			<div className='border-t border-base-100 p-4'>
				<Link to={`/profile/${user._id}`} className='text-sm font-semibold hover:text-orange-500'>
					{t("user.visitProfile")}
				</Link>
			</div>
			<div className="p-4">
				<Link to="/create-scrap" className='btn border border-gray-500 bg-white text-sm font-semibold w-full'>
					{t("form.title")}
				</Link>
			</div>

		</div>
	);
}

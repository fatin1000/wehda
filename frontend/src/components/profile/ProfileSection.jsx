/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const ProfileSection = ({ icon: Icon, title, children }) => {
	return (
		<motion.div
			className='shadow-lg rounded-xl p-6 border mb-8 bg-white'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='flex items-center mb-4'>
				<Icon className='text-orange-500 mr-4' size='24' />
				<h2 className='text-xl font-semibold text-gray-500'>{title}</h2>
			</div>
			{children}
		</motion.div>
	);
};
export default ProfileSection;

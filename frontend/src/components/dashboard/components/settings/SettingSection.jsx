/* eslint-disable react/prop-types */
const SettingSection = ({ icon: Icon, title, children }) => {
	return (
		<div
			className='shadow-lg rounded-xl p-6 border mb-8 bg-white'
		>
			<div className='flex items-center mb-4'>
				<Icon className='text-indigo-400 mr-4' size='24' />
				<h2 className='text-xl font-semibold text-gray-500'>{title}</h2>
			</div>
			{children}
		</div>
	);
};
export default SettingSection;

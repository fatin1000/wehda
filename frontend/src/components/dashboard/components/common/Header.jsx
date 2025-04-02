// eslint-disable-next-line react/prop-types
const Header = ({ title }) => {
	return (
		<header >
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
				<h1 className='text-2xl font-semibold text-gray-500'>{title}</h1>
			</div>
		</header>
	);
};
export default Header;

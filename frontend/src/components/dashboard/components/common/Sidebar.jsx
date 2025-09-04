import { CircleDollarSign, Menu, Settings, ThumbsUp, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";


// eslint-disable-next-line react/prop-types
const Sidebar = ({isSidebarOpen, setIsSidebarOpen }) => {
	
	const { t } = useTranslation();

	const SIDEBAR_ITEMS = [
	
		//the scraps user make
		{ name: t("dashboard.Deals") , icon: CircleDollarSign, color: "green-600", href: "/" },
		//liked items
		{ name: t("dashboard.Liked") , icon: ThumbsUp , color: "blue-600", href: "/likes" },
		//the follower and following users
		{ name: t("dashboard.Network"), icon: Users, color: "red-600", href: "/network" },
		//setting & edite profile
		// { name: "Settings", icon: Settings, color: "gray-900", href: "/settings" },
	];

	const location = useLocation();
	let activeLink = location.pathname;
    const baseClass ='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-colors mb-2'
	return (
		<motion.div
			className={`fixed top-20 left-0 z-100 transition-all duration-300 ease-in-out flex-shrink-0 bg-white h-[calc(100vh-20px)] ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full p-4 flex flex-col border-r shadow-lg'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full  transition-colors max-w-fit flex items-center'
				>
					<Menu size={35} className="hover:bg-gray-300 p-2 rounded-full flex-shrink-0"/> 
					
					<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{t("dashboard.title")}
										</motion.span>
									)}
								</AnimatePresence>
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={`/dashboard${item.href}`}>
							<motion.div className={activeLink == `/dashboard${item.href}` ? `${baseClass} bg-primary text-white` : baseClass}>
								<item.icon size={20} className={activeLink == `/dashboard${item.href}` ? "text-white flex-shrink-0" : `text-${item.color} flex-shrink-0`} 
								/>
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ms-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
			</div>
		</motion.div>
	);
};
export default Sidebar;

import { CircleDollarSign, LogOut, Mail, Menu, Settings, ThumbsUp, Users } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

const SIDEBAR_ITEMS = [
	
	//the scraps user make
	{ name: "Overview", icon: CircleDollarSign, color: "green-600", href: "/" },
	//liked items
	{ name: "Users", icon: Users , color: "blue-600", href: "/users" },
	//the follower and following users
	{ name: "Scraps", icon: ThumbsUp, color: "red-600", href: "/scraps" },
	{ name: "Mail", icon: Mail , color: "blue-600", href: "/mail" },
	//setting & edite profile
	{ name: "Settings", icon: Settings, color: "gray-900", href: "/settings" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/admin/logout"),
		onSuccess: () => {
		  queryClient.invalidateQueries({ queryKey: ["authAdmin"] });
		},
	  });
	
	const location = useLocation();
	let activeLink = location.pathname || "/admin";
    const baseClass ='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-colors mb-2'
	return (
		<motion.div
			className={`relative z-3 transition-all duration-300 ease-in-out flex-shrink-0  bg-white min-h-[100vh] ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full  bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r shadow-lg'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-300 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={`/admin${item.href}`}>
							<motion.div className={activeLink == `/admin${item.href}` ? `${baseClass} bg-primary text-white` : baseClass}>
								<item.icon size={20} className={activeLink == `/admin${item.href}` ? "text-white" : `text-${item.color}`} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
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
					<button className="w-full" onClick={() =>{ logout(); navigate("/")}}>
							<motion.div className={baseClass}>
								<LogOut size={20} className="text-red-600" />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											Log Out
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</button>
				</nav>
			</div>
		</motion.div>
	);
};
export default Sidebar;

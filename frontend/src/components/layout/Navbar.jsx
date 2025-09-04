import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, BicepsFlexed, ChevronDown, ChevronUp,  Globe, Hammer, LogIn, LogOut, PackagePlus, Store, User, UserPlus, Wrench, XCircle } from "lucide-react";
import warehouse from "../../assets/warehouse.svg";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react"


const Navbar = () => {
	const { t, i18n } = useTranslation();

	useEffect(() => {
		document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
	}, [i18n.language]);



	const { data: authUser } = useQuery({ queryKey: ["authUser"] })
	const { data: authAdmin } = useQuery({ queryKey: ["authAdmin"] })

	const [open, setOpen] = useState(false)
	const [open2, setOpen2] = useState(false)

	const queryClient = useQueryClient();

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => await axiosInstance.get("/notifications"),
		enabled: !!authUser
	})
	//followers
	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;

	return (
		<nav className='bg-white shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div >
						<Link to='/' className='flex items-center'>
							<img className='h-8 rounded' src='/logo.jpg' alt='ًwehda' />
							<h1 className='text-xl hidden md:block ps-2'>{t("wehda")}</h1>
						</Link>
					</div>

					<div className='flex flex-wrap items-center gap-1 md:gap-3'>

						{authUser ? (
							<>
								<Link to="/create-scrap" className='btn bg-primary text-white md:px-6'>
									<button className="hidden md:block">{t("navbar.Scrap")}</button>
									<span className="md:hidden"><PackagePlus /></span>
								</Link>
								<div className="relative">
									<button className="btn bg-white text-neutral flex gap-1 flex-nowrap shadow-none border-none whitespace-nowrap hover:bg-white" onClick={() => { setOpen2(!open2); setOpen(false) }} type="button">
										<span className="hidden md:block" >{t("navbar.Services")}</span>
										<span className="md:hidden" ><Wrench /></span>
										{!open2 ? <ChevronDown /> : <ChevronUp />}
									</button>
									{open2 &&
										<ul className="absolute top-15 right-0  bg-white px-4 py-6 rounded shadow">
											<li className="mb-4 px-6 py-2 hover:bg-gray-100 rounded ">
												<Link to='/services' className='text-neutral flex items-center whitespace-nowrap '
													onClick={() => setOpen2(false)}
												>
													<Hammer className='me-2 sm:size-4' />
													<span >{t("navbar.service1")}</span>
												</Link>
											</li>
											<li className="mb-4 px-6 py-2 hover:bg-gray-100 rounded ">
												<Link to='/workers' className='text-neutral flex items-center whitespace-nowrap '
													onClick={() => setOpen2(false)}
												>
													<BicepsFlexed className='me-2 sm:size-4' />
													<span >{t("navbar.service2")}</span>
												</Link>
											</li>

										</ul>}
								</div>
								<Link to="/depot" className='text-neutral flex flex-col items-center mx-3'>
									{/* <img src={warehouse} alt="" className="h-5" /> */}
									<Store />
									<span className='hidden md:block md:text-xs'>{t("navbar.Home")}</span>
								</Link>

								<div className="relative">
									{open ? <button className=" text-neutral flex flex-col items-center" onClick={() => setOpen(false)}>
										<XCircle size={25} />
									</button> :
										<button className=" text-neutral flex flex-col items-center" onClick={() => { setOpen(true); setOpen2(false) }}>
											<User size={25} />
											<span className='hidden md:block md:text-xs md:font-normal'>{t("navbar.Me")}</span>
											{unreadNotificationCount > 0 && (<span
												className='absolute -top-1 -end-2  bg-blue-500 text-white text-xs 
												rounded-full size-3 md:size-4 flex items-center justify-center'
											>
												{unreadNotificationCount}
											</span>)}
										</button>}
									{open &&
										<ul className="absolute -top-20px bg-base-100 rounded-b z-1  py-6 px-2 shadow end-0 mt-3 text-lg sm:text-base"

										>

											<li className="mb-4 px-6 py-2 hover:bg-gray-100 rounded ">
												<Link to='/notifications' className='text-neutral flex items-center whitespace-nowrap'
													onClick={() => setOpen(false)}
												>
													<Bell className="sm:size-4" />
													<span >{t("navbar.Notifications")}</span>
													{unreadNotificationCount > 0 && (
														<span
															className=' bg-blue-500 text-white text-xs 
													rounded-full size-3 md:size-4 flex items-center justify-center'
														>
															{unreadNotificationCount}
														</span>
													)}
												</Link>
											</li>
											<li className="mb-4 px-6 py-2 hover:bg-gray-100 rounded ">
												<Link to="/dashboard" className='text-neutral flex items-center whitespace-nowrap '
													onClick={() => setOpen(false)}
												>
													<UserPlus className='mr-2 sm:size-4' />
													<span >{t("navbar.Dashboard")}</span>
												</Link>
											</li>
											<li className="mb-4 px-6 py-2 hover:bg-gray-100 rounded ">
												<Link to={`/profile/${authUser._id}`} className='text-neutral flex items-center whitespace-nowrap'
													onClick={() => setOpen(false)}
												>
													<User className='mr-2 sm:size-4' />
													<span >{t("navbar.Profile")}</span>
												</Link>
											</li>
											<div className="divider"></div>
											<li className=" px-6 py-2 hover:bg-gray-100 rounded ">
												<button
													className='flex items-center space-x-1 mb-3 text-gray-600 hover:text-gray-800'
													onClick={() => logout()}
												>
													<LogOut className="sm:size-4" />
													<span className=''>{t("navbar.Logout")}</span>
												</button></li>
										</ul>}
								</div>
								{i18n.language === 'ar' ? (
									<button type="button" onClick={() => i18n.changeLanguage('en')} className="flex flex-col items-center gap-1">
										<Globe className="text-xl text-gray-700 hover:text-primary transition" />
										<span className="text-sm">EN</span>
									</button>
								) : (
									<button type="button" onClick={() => i18n.changeLanguage('ar')} className="flex flex-col items-center gap-1">
										<Globe className="text-xl text-gray-700 hover:text-primary transition" />
										<span className="text-sm">AR</span>
									</button>
								)}

							</>
						) : (
							<>
								{authAdmin ? <Link to='/admin' className='btn bg-primary text-white'>Admin</Link> :
									<>
										<Link to="/depot" className='text-neutral flex flex-col items-center'>
											{/* <img src={warehouse} alt="" className="h-5" /> */}
											 <Store />
											<span className='hidden md:block md:text-xs'>{t("navbar.Home")}</span>
										</Link>

										<Link to='/login' className='btn btn-ghost'>
											<span className="hidden md:block">{t("navbar.SignIn")}</span>
											<span className="md:hidden"><LogIn /></span>
										</Link>
										<Link to='/signup' className='btn btn-primary'>
											{t("navbar.SignUp")}
										</Link>
									</>
								}
								{ i18n.language === 'ar' ? (
  <button type="button" onClick={() => i18n.changeLanguage('en')} className="flex flex-col items-center gap-1">
    <Globe className="text-xl text-gray-700 hover:text-primary transition" />
    <span className="text-sm">EN</span>
  </button>
) : (
  <button type="button" onClick={() => i18n.changeLanguage('ar')} className="flex flex-col items-center gap-1">
    <Globe className="text-xl text-gray-700 hover:text-primary transition" />
    <span className="text-sm">AR</span>
  </button>
)}

							</>
						)}
					</div>
				</div>


			</div>
		</nav>
	)
}

export default Navbar

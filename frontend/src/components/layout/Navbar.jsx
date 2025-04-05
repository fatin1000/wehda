import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, BicepsFlexed, ChevronDown, ChevronUp, Hammer, LogOut, Plus, User, UserPlus, XCircle } from "lucide-react";
import warehouse from "../../assets/warehouse.svg";
import { useState } from "react";

const Navbar = () => {
  const {data:authUser} = useQuery({queryKey:["authUser"]})
  const {data:authAdmin} = useQuery({queryKey:["authAdmin"]})

  const[open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

  const queryClient = useQueryClient();

  const {data:notifications} = useQuery({
    queryKey:["notifications"],
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
						<Link to='/' className='flex items-center space-x-2'>
							<img className='h-8 rounded' src='/logo.jpg' alt='ًwehda' />
							<h1 className='text-xl hidden md:block'>Wehda</h1>
						</Link>
					</div>
					
					<div className='flex items-center gap-1 md:gap-3'>
								
						{authUser ? (
							<>
								
								<Link to="/create-scrap" className='text-sm font-semibold w-full'>
									<button className="btn bg-primary text-white"><Plus size={18} strokeWidth={3} /> Scrap</button>
								</Link>
								<div className="relative">
								<button className="btn bg-white text-neutral flex gap-1 flex-nowrap shadow-none border-none whitespace-nowrap" onClick={() => {setOpen2(!open2);setOpen(false)}} type="button">
									<span>Services\Workers</span>{!open2 ?<ChevronDown /> : <ChevronUp />}
								</button>
								{open2 &&
								 <ul className="absolute top-15  bg-white px-4 py-6 rounded shadow">
									<li className="mb-4 px-6 py-2 hover:bg-gray-100 rounded ">
									<Link to='/services' className='text-neutral flex items-center whitespace-nowrap '
									onClick={() => setOpen2(false)}
									>
									<Hammer className='mr-2 sm:size-4'  /> 
									<span >Service Providers</span>
									</Link>
									</li>
								<li className="mb-4 px-6 py-2 hover:bg-gray-100 rounded ">
								<Link to='/workers' className='text-neutral flex items-center whitespace-nowrap '
								onClick={() => setOpen2(false)}
								>
									<BicepsFlexed className='mr-2 sm:size-4'  />
									<span >Workers Providers</span> 
								</Link>
								</li>
								
								</ul>}
								</div>
								<Link to="/depot" className='text-neutral flex flex-col items-center mx-3'>
									<img src={warehouse} alt="" className="h-5" />
									<span className='text-xs '>Home</span>
								</Link>

								<div className="relative">
									{open ? <button className=" text-neutral flex flex-col items-center" onClick={() => setOpen(false)}>
										<XCircle size={25} />
										</button> :
									<button className=" text-neutral flex flex-col items-center" onClick={() => {setOpen(true);setOpen2(false)}}>
									<User size={25} />
									<span className='text-xs font-normal'>Me</span>
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
												<span >Notifications</span>
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
												<UserPlus className='mr-2 sm:size-4'  />
												<span > My Dashboard </span>
											</Link>
										</li>
										<li className="mb-4 px-6 py-2 hover:bg-gray-100 rounded ">
											<Link to={`/profile/${authUser._id}`} className='text-neutral flex items-center whitespace-nowrap'
											onClick={() => setOpen(false)}
											>
												<User className='mr-2 sm:size-4'  />
												<span >My Profile</span> 
											</Link>
										</li>
										<div className="divider"></div>
										<li className=" px-6 py-2 hover:bg-gray-100 rounded ">
											<button
									className='flex items-center space-x-1 mb-3 text-gray-600 hover:text-gray-800'
									onClick={() => logout()}
								>
									<LogOut className="sm:size-4" />
									<span className=''>Logout</span>
								</button></li>
									</ul>}
									</div>
							</>
						) : (
							<>
								{authAdmin ? <Link to='/admin' className='btn bg-primary text-white'>Admin</Link> : 
								<>
								<Link to="/depot" className='text-neutral flex flex-col items-center'>
									<img src={warehouse} alt="" className="h-5" />
									<span className='text-xs '>Home</span>
								</Link>

								<Link to='/login' className='btn btn-ghost'>
									Sign In
								</Link>
								<Link to='/signup' className='btn btn-primary'>
									Join now
								</Link>
								</>
								}
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
  )
}

export default Navbar

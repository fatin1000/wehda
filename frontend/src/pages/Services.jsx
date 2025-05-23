import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BicepsFlexed, Building2, Hammer, Mail, Phone } from "lucide-react";

const fetchUsers = async ([service, city]) => {
    const res = await axiosInstance.get(`/users/services/${service}/${city}`);
    return res.data;
}

// const fetchUsers = async (key,service, city) => {
//     const res = await axiosInstance.get(`/users/services/${service}/${city}`);
//     return res.data;
// }


const Services = () => {
    const servicesOptions = ['field1',"field2","field3","field4","field5","field6","field7","field8","field9","field10"];
    const cityOptions = ['city1','city2','city3','city4',"city5","city6","city7","city8","city9","city10"]

    const [service, setService] = useState("");
    const [city, setCity] = useState("");
    const [Serching, setSerching] = useState(false);

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	
   const { data: usersServices , isLoading , isError ,isSuccess} = useQuery({
    queryKey: ["services", service, city],
    enabled: Serching,
    queryFn: () => fetchUsers([service, city]),
    //staleTime: 1000 * 60 * 5,
   });
   // const {data: usersServices , isLoading , isError} = useQuery(['users',service,city],fetchUsers)
   
    const handleSearch = () => {
       fetchUsers([service, city]);
       setSerching(true);
        console.log(service, city);
    };

     const DBservices = usersServices ? usersServices : [ "start" ];
  return (
    <div className='grid grid-cols-1 px-4 py-6 lg:grid-cols-4 gap-6'>
           
			<div className='hidden lg:block col-span-1'>
				<Sidebar user={authUser} />
			</div>

            <div className='col-span-1 mt-4 lg:col-span-3 '>
                <h3 className="text-2xl font-semibold text-orange-500">Serching for good Service 🤩 !</h3>
                <p className="text-gray-500">Here you can find the best services for you,with ...</p>

                
                <form className='col-span-1 mt-7 md:px-14 py-5 lg:col-span-3'>
                    <div className='flex items-center gap-4 mb-4'>
                        <label htmlFor='service' className="text-gray-500 w-[100px]">The Service</label>
                        <select
                        name="service"
                        id="service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="flex-1 p-2 rounded border"
                        >
                            <option value="" disabled className="text-gray-500 ">Select a service ...</option>
                            {servicesOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex items-center gap-4 mb-4'>
                        <label htmlFor='city' className="text-gray-500 w-[100px]">The City</label>
                        <select
                        name="city"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="flex-1 p-2 rounded border"
                        >
                            <option value="" disabled className="text-gray-500">Select a city ...</option>
                            {cityOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                        ))}	
                        </select>
                    </div>
                        <button type='button' className='bg-primary text-white w-full py-2 my-4 rounded sm:w-[120px]' onClick={handleSearch}>Search</button>
                </form>

                {/* the services providers */}
                <div className='col-span-1 mt-7 lg:col-span-3'>
                    
                    {(isLoading) ? (<div>Loading...</div>) : (isError) ? ( <div>Error loading users</div>) :
                            (DBservices[0] === "start") ? null :
                            (isSuccess && DBservices?.length === 0) ?
                            (<div className="flex justify-center">Obbbbs,It like there is No User provider {service} in {city} 😓</div>)
                            :(
                            <div>
                                <h3 className="text-2xl font-semibold mb-1">Services Providers</h3>
                                <h5 className="mb-6 text-gray-500">Users offering <span className="text-orange-500">{service}</span>  in <span className="text-orange-500">{city}</span></h5>

                                {DBservices.map((user) => (
                                    (user._id === authUser._id) ? null :
                                    (<div key={user._id} className="flex flex-col items-center gap-4 bg-white py-5 px-14 rounded border mb-4 sm:flex-row justify-between">
                                        <div>
                                        <Link to={`/profile/${user._id}`} className="flex items-center gap-2 mb-6">
                                        <img
                                            src={ user.profilePic ? user.profilePic : "/avatar.png"}
                                            alt={user.username}
                                            className="w-12 h-12 rounded-full "
                                        />
                                        <div>
                                            <h2 className="text-lg font-semibold">{user.username}</h2>
                                            <p className="text-gray-500">{user.headline}</p>
                                        </div>
                                        </Link>
                                        <p><Phone className="mr-2 text-orange-600 inline size-5" />  {user.phone}</p>
                                        <a href={`mailto:${user.email}`} ><Mail className="mr-2 text-orange-600 inline size-5" /> <span className="underline">{user.email}</span> </a>
                                        <p><Building2 className="mr-2 text-orange-600 inline size-5" /> {user.company}</p>
                                         {user.services ? (<p><BicepsFlexed className="mr-2 text-orange-600 inline size-5" /> Provide A Worker {user.labor}</p>) : null}
                                        </div>

                                        <div>
                                            <span className="font-semibold text-orange-500"><Hammer className="mr-2 text-orange-600 inline size-5" />services</span>  {user.fields.map((service) => (
                                                <p key={service.label}>{service.value}</p>
                                            ))}
                                        </div>
                                    </div>)
                                ))}
                                
                            </div>
                        )
                    }

                </div>
            </div>

    </div>
  )
}

export default Services;

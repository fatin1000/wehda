import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Building, Loader, Mail, Phone } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { cityOptions } from "../data/options";

const fetchUsers = async (city) => {
    const res = await axiosInstance.get(`/users/workers/${city}`);
    return res.data;
}

// const fetchUsers = async (key,service, city) => {
//     const res = await axiosInstance.get(`/users/services/${service}/${city}`);
//     return res.data;
// }



const Workers = () => {
    const { t } = useTranslation();

    const [city, setCity] = useState("");
    const [Serching, setSerching] = useState(false);

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });


    const { data: usersServices, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["services", city],
        enabled: Serching,
        queryFn: () => fetchUsers(city),
        staleTime: 1000 * 60 * 5,
    });
    // const {data: usersServices , isLoading , isError} = useQuery(['users',service,city],fetchUsers)

    const handleSearch = () => {
        fetchUsers(city);
        setSerching(true);
    };

    const DBservices = usersServices ? usersServices : ["start"];
    return (
        <div className='grid grid-cols-1 px-4 py-6 lg:grid-cols-4 gap-6'>

            <div className='hidden lg:block col-span-1'>
                <Sidebar user={authUser} />
            </div>

            <div className='col-span-1 mt-4 lg:col-span-3 '>
                <h3 className="text-2xl font-semibold text-orange-500">{t("workers.searchingForGoodWorkers")} 🤩 !</h3>
                <p className="text-gray-500">{t("workers.description")}</p>


                <form className='col-span-1 mt-7 md:px-14 py-5 lg:col-span-3'>
                    <div className='flex items-center gap-4 mb-4'>
                        <label htmlFor='city' className="text-gray-500 w-[100px]">{t("workers.theCity")}</label>
                        <select
                            name="city"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="flex-1 p-2 rounded border"
                        >
                            <option value="" disabled className="text-gray-500">{t("workers.selectCity")}</option>
                            {cityOptions.map((option) => (
                                <option key={option.label} value={option.value}>{t(option.label)}</option>
                            ))}
                        </select>
                    </div>
                    <button type='button' className='bg-primary text-white w-full py-2 my-4 rounded sm:w-[120px]' onClick={handleSearch}>{t("common.search")}</button>
                </form>

                {/* the services providers */}
                <div className='col-span-1 mt-7 lg:col-span-3'>

                    {(isLoading) ? (<div className="flex justify-center w-full"><Loader className="animate-spin text-primary" size={40} /></div>) : (isError) ? (<div>{t("workers.errorLoadingUsers")}</div>) :
                        (DBservices[0] === "start") ? null :
                            (isSuccess && DBservices?.length === 0) ?
                                (<div className="flex justify-center">{t("workers.noWorkersFound", { city })} 😓</div>)
                                : (
                                    <div>
                                        <h3 className="text-2xl font-semibold mb-1">{t("workers.workersProviders")}</h3>
                                        <h5 className="mb-6 text-gray-500">{t("workers.usersOfferingWorkers", { city })}</h5>

                                        {DBservices.map((user) => (
                                            (user._id === authUser._id) ? null :
                                                (<div key={user._id} className="flex flex-col md:items-center gap-4 p-4 bg-white md:py-5 md:px-14 rounded-md shadow-md border mb-4 md:flex-row md:justify-between">
                                                    <div>
                                                        <Link to={`/profile/${user._id}`} className="flex items-center gap-2 mb-6">
                                                            <img
                                                                src={user.profilePic ? user.profilePic : "/avatar.png"}
                                                                alt={user.username}
                                                                className="w-12 h-12 rounded-full mr-4"
                                                            />
                                                            <div>
                                                                <h2 className="text-lg font-semibold">{user.username}</h2>
                                                                <p className="text-gray-500">{user.headline}</p>
                                                            </div>
                                                        </Link>
                                                        <p className="flex items-center gap-2">
                                                            <Phone className="text-primary" size={20} />
                                                            <span>{user.phone}</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <Mail className="text-primary" size={20} />
                                                            <a href={`mailto:${user.email}`} > <span className="underline">{user.email}</span> </a>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <Building className="text-primary" size={20} /> <span>{user.company}</span>
                                                        </p>
                                                        {user.services && <p className="mt-4 font-semibold">Provide A Worker {user.labor}</p>}
                                                        {user.laborPayment && <p><span className="text-gray-500">Payment : </span> {user.laborPayment}</p>}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-primary">services : </p>
                                                        {user.fields.map((service) => (
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

export default Workers;

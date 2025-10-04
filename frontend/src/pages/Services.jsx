import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BicepsFlexed, Building2, Hammer, Mail, Phone } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { cityOptions , fildOptions} from "../data/options";

const fetchUsers = async ([service, city]) => {
    const res = await axiosInstance.get(`/users/services/${service}/${city}`);
    return res.data;
}

const Services = () => {
    const { t } = useTranslation();

    const [service, setService] = useState("");
    const [city, setCity] = useState("");
    const [Serching, setSerching] = useState(false);

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });


    const { data: usersServices, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["services", service, city],
        enabled: Serching,
        queryFn: () => fetchUsers([service, city]),
        //staleTime: 1000 * 60 * 5,
    });
    // const {data: usersServices , isLoading , isError} = useQuery(['users',service,city],fetchUsers)

    const handleSearch = () => {
        fetchUsers([service, city]);
        setSerching(true);
    };

    const DBservices = usersServices ? usersServices : ["start"];
    return (
        <div className='grid grid-cols-1 px-4 py-6 lg:grid-cols-4 gap-6'>

            <div className='hidden lg:block col-span-1'>
                <Sidebar user={authUser} />
            </div>

            <div className='col-span-1 mt-4 lg:col-span-3 '>
                <h3 className="text-2xl font-semibold text-orange-500">{t("services.searchingForGoodService")} 🤩 !</h3>
                <p className="text-gray-500">{t("services.description")}</p>


                <form className='col-span-1 mt-7 md:px-14 py-5 lg:col-span-3'>
                    <div className='flex items-center gap-4 mb-4'>
                        <label htmlFor='service' className="text-gray-500 w-[100px]">{t("services.theService")}</label>
                        <select
                            name="service"
                            id="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="flex-1 p-2 rounded border"
                        >
                            <option value="" disabled className="text-gray-500 ">{t("services.selectService")}</option>
                            {fildOptions.map((option) => (
                                <option key={option.value} value={option.value}>{t(option.label)}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex items-center gap-4 mb-4'>
                        <label htmlFor='city' className="text-gray-500 w-[100px]">{t("services.theCity")}</label>
                        <select
                            name="city"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="flex-1 p-2 rounded border"
                        >
                            <option value="" disabled className="text-gray-500">{t("services.selectCity")}</option>
                            {cityOptions.map((option) => (
                                <option key={option.label} value={option.value}>{t(option.label)}</option>
                            ))}
                        </select>
                    </div>
                    <button type='button' className='bg-primary text-white w-full py-2 my-4 rounded sm:w-[120px]' onClick={handleSearch}>{t("common.search")}</button>
                </form>

                {/* the services providers */}
                <div className='col-span-1 mt-7 lg:col-span-3'>

                    {(isLoading) ? (<div>{t("loading")}</div>) : (isError) ? (<div>{t("services.errorLoadingUsers")}</div>) :
                        (DBservices[0] === "start") ? null :
                            (isSuccess && DBservices?.length === 0) ?
                                (<div className="flex justify-center">{t("services.noProvidersFound")} {t(`fields.${service}`)} {t("services.in")} {t(`cities.${city}`)}  😓</div>)
                                : (
                                    <div>
                                        <h3 className="text-2xl font-semibold mb-1">{t("services.serviceProviders")}</h3>

                                        {DBservices.map((user) => (
                                            (user._id === authUser._id) ? null :
                                                (<div key={user._id} className="flex flex-col items-center gap-4 bg-white py-5 px-14 rounded border mb-4 sm:flex-row justify-between">
                                                    <div>
                                                        <Link to={`/profile/${user._id}`} className="flex items-center gap-2 mb-6">
                                                            <img
                                                                src={user.profilePic ? user.profilePic : "/avatar.png"}
                                                                alt={user.username}
                                                                className="w-12 h-12 rounded-full "
                                                            />
                                                            <div>
                                                                <h2 className="text-lg font-semibold">{user.username}</h2>
                                                                <p className="text-gray-500">{t(`auth.${(user.headline).toLowerCase()}`)}</p>
                                                            </div>
                                                        </Link>
                                                        <p><Phone className="mr-2 text-orange-600 inline size-5" />  {user.phone}</p>
                                                        <a href={`mailto:${user.email}`} ><Mail className="mr-2 text-orange-600 inline size-5" /> <span className="underline">{user.email}</span> </a>
                                                        <p><Building2 className="mr-2 text-orange-600 inline size-5" /> {user.company}</p>
                                                        {user.services ? (<p><BicepsFlexed className="mr-2 text-orange-600 inline size-5" /> {t("services.provideWorker")} {t(`profile.services.worker.${user.labor}`)}</p>) : null}
                                                    </div>

                                                    <div>
                                                        <span className="font-semibold text-orange-500"><Hammer className="mr-2 text-orange-600 inline size-5" />{t("services.services")}</span>  {user.fields.map((service) => (
                                                            <p key={service.label}>{t(`fields.${service.value}`)}</p>
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

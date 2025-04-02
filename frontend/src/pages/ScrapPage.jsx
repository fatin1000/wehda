import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import ScrapRequest from "../components/ScrapRequest";
import NotFound from "./NotFound";
import { Loader } from "lucide-react";

const ScrapPage = () => {
	const { id } = useParams();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: scrap, isLoading } = useQuery({
		queryKey: ["scrap", id],
		queryFn: () => axiosInstance.get(`/scraps/${id}`),
	});

	if (isLoading) return <div className='flex justify-center items-center gap-3 text-primary w-[100%] h-[100vh]' ><Loader size={40} className='animate-spin'/><p className="text-lg"> Loading scrap...</p></div>;
	if (!scrap?.data) return <NotFound />;

	return (
		<div className='grid grid-cols-1 px-4 py-6 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-3'>
				<ScrapRequest scrap={scrap.data} />
			</div>
		</div>
	);
};
export default ScrapPage;

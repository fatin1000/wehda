import AdminLayout from "../components/layout/AdminLayout"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Header from "./components/Header";
import { Search } from "lucide-react";
import { useState } from "react";
const Scraps = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

	const { data: allScraps, isLoading: allScarpsLoading, error } = useQuery({
    queryKey: ["adminAllScarps"],
    queryFn: async () => {
      const res = await axiosInstance.get("admin/allScraps");
      return res.data;
    },
  });

	const { mutate: desactiveScrap} = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.put(`admin/desActiveScraps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userScrap"] });
      queryClient.invalidateQueries({ queryKey: ["adminAllScarps"] });
      toast.success("desactive scrap successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: activeScrap} = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.put(`admin/activeScraps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userScrap"] });
      queryClient.invalidateQueries({ queryKey: ["adminAllScarps"] });
      toast.success("desactive scrap successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: scrapDelete } = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`admin/scrapDelete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userScrap"] });
      queryClient.invalidateQueries({ queryKey: ["adminAllScarps"] });
      toast.success("desactive scrap successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  let allScrapsArr = allScarpsLoading || !allScraps ? [] : allScraps;

  if(error) return <div>Error in loading Scraps</div>
  
  if (search.trim() !== "") {
     allScrapsArr =   allScrapsArr.filter((e) =>
         e.username.toLowerCase().includes(search.toLowerCase()) 
     );}
  return (
    <AdminLayout>
       <div>
       <Header title="Scraps" />

       <div className="bg-white rounded-lg shadow p-4 mt-2 my-4 sm:w-[90%] mx-auto">
					<div className="bg-gray-100 border border-gray-300 rounded-lg relative ">
					<input type="text" className=" bg-gray-100 py-2 px-4 rounded-lg" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for scraps" />
					<Search className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
					</div>
				</div>

       {!allScarpsLoading && allScrapsArr.length === 0 && (
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-center text-2xl text-gray-500 font-semibold">No Scrap found</p>
				</div>
			)}
        { allScarpsLoading ? <div>loading...</div> : (
			<div className="overflow-x-auto w-[400px] sm:overflow-x-hidden mx-auto sm:w-[90%] overflow-y-hidden">
          <table className="text-center bg-white rounded mx-auto w-full  ">
          <thead className="bg-gray-200">
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                    Item
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                    Quantity
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                    Crated At
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
               <tbody className="divide-y divide-gray-300">
               {allScrapsArr.map((scrap) => (
                <tr key={scrap._id} className={scrap.isDroped ? "bg-red-200" : ''}>
                  <td className="px-6 py-4 ">{scrap.itemName.value}</td>
                  <td className="px-6 py-4 ">{scrap.itemStatus}</td>
                  <td className="px-6 py-4 ">{scrap.quantity} of {scrap.oldQuantity} {scrap.units}</td>
                  <td className="px-6 py-4 ">{format(new Date(scrap.createdAt), 'dd/MM/yyyy')}</td>
                  <td>
                     {!scrap.isDroped ? <button className="btn btn-xs text-xs btn-warning me-1" onClick={() => desactiveScrap(scrap._id)}>
                        Desactive
                      </button> : <button className="btn btn-xs text-xs btn-success me-1" onClick={() => activeScrap(scrap._id)}>
                        Active
                      </button>}
                      <button className="btn btn-xs text-xs btn-error" onClick={() => scrapDelete(scrap._id)}>
                       Delete
                     </button>
                     
                  </td>
                </tr>
                ))}
                </tbody>
                </table>
                </div>
                )}
      </div>
    </AdminLayout>
  )
}

export default Scraps

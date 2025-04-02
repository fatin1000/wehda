import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../components/layout/AdminLayout"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import { useState } from "react";
import { Search } from "lucide-react";
 
const Mail = () => {
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();

	const { data: allMails, isLoading: allMailsLoading, error } = useQuery({
    queryKey: ["allMails"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/allMails");
      return res.data;
    },
  });
	

  const { mutate: deleteMail} = useMutation({
		mutationFn: async (id) => {
			await axiosInstance.delete(`/admin/deleteMail/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["allMails"] });
			toast.success("User deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
  const { mutate: ReadMail} = useMutation({
		mutationFn: async (id) => {
			await axiosInstance.put(`/admin/mailRead/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["allMails"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }
  let mails = allMailsLoading? [] : allMails

  if (search.trim() !== "") {
    mails = mails.filter((e) =>
         e.name.toLowerCase().includes(search.toLowerCase()) 
     );
  }
    return (
        <AdminLayout>
         <div>
         <Header title='Mails' />

         <div className="bg-white rounded-lg shadow p-4 mt-2 my-4 sm:w-[90%] mx-auto">
					<div className="bg-gray-100 border border-gray-300 rounded-lg relative ">
					<input type="text" className=" bg-gray-100 py-2 px-4 rounded-lg" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for mail by name" />
					<Search className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
					</div>
				</div>

        {!allMailsLoading && mails.length === 0 && (
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-center text-2xl text-gray-500 font-semibold">No users found</p>
				</div>
			)}

        { allMailsLoading ? <div>loading...</div> : mails.length > 0 ? (
			<div className="overflow-x-auto w-[400px] sm:overflow-x-hidden mx-auto sm:w-[90%] overflow-y-hidden">
          <table className="text-center bg-white p-5 m-4 rounded">
          <thead className="bg-gray-200">
						<tr >
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
                Email
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								company
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								Send At
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>
               <tbody className="divide-y divide-gray-500">
               {mails.map((m) => (
                    <tr key={m._id} className={m.read ? "bg-white" : "bg-blue-100"}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {m.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{m.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{m.company}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{format(new Date(m.createdAt), 'dd/MM/yyyy')}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                        <Link to={`/admin/mail/${m._id}`}
                            onClick={() => {ReadMail(m._id)}}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                          >
                            Read
                          </Link>
                          <button
                            onClick={() => deleteMail(m._id)}
                            className="bg-red-500 text-white py-2 px-4 rounded ms-2"
                          >
                            Delete
                          </button>
                         
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
                </div>
                ) : <div>No Mails</div>}
      </div>
        </AdminLayout>
        
      )
}

export default Mail

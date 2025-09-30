import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../components/layout/AdminLayout"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import UserRow from "./components/UserRow";
import Header from "./components/Header";
import { useState } from "react";
import { Search } from "lucide-react";
const Users = () => {
  const queryClient = useQueryClient();
const [search, setSearch] = useState("");
	const { data: allUsersData, isLoading: allUsersLoading, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("admin/allUsers");
      return res.data;
    },
  });
	

  const { mutate: deleteUser} = useMutation({
		mutationFn: async (id) => {
			await axiosInstance.delete(`admin/delete/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["allUsers"] });
			toast.success("User deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
  const { mutate: desactiveUser} = useMutation({
		mutationFn: async (id) => {
			await axiosInstance.put(`admin/desActive/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["allUsers"] });
			toast.success("User desactive User successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
  const { mutate: activeUser} = useMutation({
		mutationFn: async (id) => {
			await axiosInstance.put(`admin/active/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["allUsers"] });
			toast.success("User desactive User successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

  
  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  let allUsers = allUsersData || [];

  if (search.trim() !== "") {
	allUsers = allUsers.filter((e) =>
   		e.username.toLowerCase().includes(search.toLowerCase()) 
   );
}

const handeldeleteUser = (id) => {
	confirm("Are you sure you want to delete this user?") &&
	deleteUser(id);
}
  return (
    <AdminLayout>
      <div>
        <Header title='Users' />
		<div className="bg-white rounded-lg shadow p-4 mt-2 my-4 sm:w-[90%] mx-auto">
					<div className="bg-gray-100 border border-gray-300 rounded-lg relative ">
					<input type="text" className=" bg-gray-100 py-2 px-4 rounded-lg" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for User" />
					<Search className="text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
					</div>
				</div>

				{!allUsersLoading && allUsers.length === 0 && (
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-center text-2xl text-gray-500 font-semibold">No users found</p>
				</div>
			)}
        { allUsersLoading && <div>loading...</div> }
		{ allUsers.length > 0 && 
			<div className="overflow-x-auto w-[400px] sm:overflow-x-hidden mx-auto sm:w-[90%] overflow-y-hidden">
          <table className="text-center bg-white rounded mx-auto w-full  ">
          <thead className="bg-primary text-white ">
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								User
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								scrap
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								scrapRes
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								Join At
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								Plane
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'>
								Online
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>
               <tbody className="divide-y divide-gray-300">
               {allUsers.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      desactiveUser={desactiveUser}
                      activeUser={activeUser}
                      deleteUser={handeldeleteUser}
                    />
                  ))}
                </tbody>
                </table>
				</div>
				}

			
      </div>
      </AdminLayout>
  )
}

export default Users

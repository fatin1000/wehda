import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { AtSign, Building2, CalendarFold, MailX, PhoneCall, Undo2, User } from "lucide-react";
import { format } from "date-fns";

const Msg = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: mailMsg, isLoading: isMailLoading } = useQuery({
    queryKey: ["mailMsg", id],
    queryFn: () => axiosInstance.get(`/admin/mailMsg/${id}`),
  });

  const { mutate: deleteMail } = useMutation({
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

  console.log(mailMsg);

  return (
    <AdminLayout>
      {isMailLoading ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-gray-500 text-lg">Loading...</span>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg sm:px-12 sm:py-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Message Details</h2>
            <div className="flex">
              <Link
                to="/admin/mail"
                className="flex items-center justify-center bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-200 me-2"
              >
                <Undo2 className="w-4 h-4 mr-2" />
                Back
              </Link>
              <button
                className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                onClick={() => deleteMail(id)}
              >
                <MailX className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
          <div className="space-y-4 bg-white rounded-lg shadow">
            <div className="py-4 px-6  flex flex-col flex-wrap gap-2 sm:flex-row">
              <div className="w-[100%] text-sm text-gray-500 mb-6 flex items-center gap-2"><CalendarFold size={15} />{format(new Date(mailMsg.data.createdAt), 'dd/MM/yyyy')}</div>
              <div className="w-[45%] flex flex-col flex-wrap gap-2 sm:flex-row items-center">
              <h3 className=" text-gray-600  flex items-center gap-2"><User size={20}/>Sender : </h3>
              <p className="text-gray-700 font-semibold"> {mailMsg.data.name}</p>
              </div>
              <div className="w-[45%] flex flex-col gap-2 flex-wrap sm:flex-row items-center">
                <h3 className=" text-gray-600 flex items-center gap-2"><AtSign size={20} /> Email :</h3>
                <p className="text-gray-700 font-semibold"> {mailMsg.data.email}</p>
              </div>
              <div className="w-[45%] flex flex-col flex-wrap gap-2 sm:flex-row items-center">
                <h3 className=" text-gray-600 flex items-center gap-2"><Building2 size={20}  /> Company :</h3>
                <p className="text-gray-700 font-semibold">{mailMsg.data.company}</p>
              </div>
              <div className="w-[45%] flex flex-col flex-wrap gap-2 sm:flex-row items-center">
                <h3 className=" text-gray-600 flex items-center gap-2"><PhoneCall size={20} /> Phone :</h3>
                <p className="text-gray-700 font-semibold"> {mailMsg.data.phone}</p>
              </div>
              
            </div>
            <div className="divider divider-gray-500 px-4"></div>
            <div className="p-4 ">
              <h3 className="font-semibold text-gray-700 mb-4">Message :</h3>
              <p className="rounded px-4 py-6 bg-gray-100">{mailMsg.data.message}</p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Msg;

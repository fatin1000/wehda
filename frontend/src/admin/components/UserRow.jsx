/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import {X} from 'lucide-react'
import toast from 'react-hot-toast';

const UserRow = ({ user, desactiveUser, activeUser, deleteUser }) => {
        const queryClient = useQueryClient();

        const { data: userScraps, isLoading: userScrapsLoading } = useQuery({
          queryKey: ["userScrap", user._id], // استخدم user._id لجعل المفتاح فريداً
          queryFn: async () => {
            const res = await axiosInstance.get(`/admin/userScraps/${user._id}`); 
            return res.data;
          },
        });
        const[show,setShow]=useState(false)

        const { mutate: desactiveScrap} = useMutation({
          mutationFn: async (id) => {
            await axiosInstance.put(`/admin/desActiveScraps/${id}`);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userScrap", user._id] });
            toast.success("desactive scrap successfully");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        });
        const { mutate: activeScrap} = useMutation({
          mutationFn: async (id) => {
            await axiosInstance.put(`/admin/activeScraps/${id}`);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userScrap", user._id] });
            toast.success("desactive scrap successfully");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        });
        const { mutate: scrapDelete } = useMutation({
          mutationFn: async (id) => {
            await axiosInstance.delete(`/admin/scrapDelete/${id}`);
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userScrap", user._id] });
            toast.success("desactive scrap successfully");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        });
      
        
        return (
          <>
          <tr key={user._id} className={!user.active ?  'bg-gray-200' : user.isDeleted ? 'bg-red-200' : ''}>
            <td className="px-6 py-4 whitespace-nowrap">
              <Link to={`/profile/${user._id}`} className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    src={user.profilePic ? user.profilePic : "/avatar.png"}
                    alt={user.username}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <div className="font-medium">{user.username}</div>
                </div>
              </Link>
            </td>
            <td className="px-6 py-4 cursor-pointer" onClick={()=> setShow(!show)}>
              {userScrapsLoading ? "Loading..." : userScraps.length}
            </td>
            <td className="px-6 py-4 ">0</td>
            <td className="px-6 py-4 ">
              {format(new Date(user.createdAt), 'dd/MM/yyyy')}
            </td>
            <td className="px-6 py-4 ">
              {user.plan}
            </td>
            <td className="px-6 py-4 ">
              {user.isOnline ? (
                <div className="bg-green-200 text-green-700 rounded-full text-sm w-fit px-1 mx-auto border border-green-700">
                  Online
                </div>
              ) : (
                <div className="bg-red-200 text-red-700 rounded-full text-sm w-fit px-1 mx-auto border border-red-700">Offline</div>
              )}
            </td>
            <td className="px-6 py-4 ">
              {user.active ? (
                <button className="btn btn-xs text-xs btn-warning me-1" onClick={() => desactiveUser(user._id)}>
                  Desactive
                </button>
              ) : (
                <button className="btn btn-xs text-xs btn-success me-1" onClick={() => activeUser(user._id)}>
                  Activate
                </button>
              )}
              <button className="btn btn-xs text-xs btn-error" onClick={() => deleteUser(user._id)}>
                Delete
              </button>
            </td>
          </tr>
          <tr className='bg-gray-100 '>
          
           {show && <td colSpan={7} className="px-6 py-4">
           <div className='relative'><button className='absolute right-0 hover:text-red-600' onClick={()=> setShow(false)}><X /></button></div>
              <table className="divide-y divide-gray-400">
              <thead>
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
              <tbody className="divide-y divide-gray-300" >
                {userScraps.map((scrap) => (
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
            </td>}
          </tr>
          </>
        );
      };

export default UserRow

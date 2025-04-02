import Sidebar from "../../admin/components/Sidebar"

// eslint-disable-next-line react/prop-types
const AdminLayout = ({ children }) => {
  return (
    <div className='flex w-[100%] overflow-x-hidden'>
      <Sidebar />
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

export default AdminLayout

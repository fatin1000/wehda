import Sidebar from "../dashboard/components/common/Sidebar"

// eslint-disable-next-line react/prop-types
const DashboardLayout = ({ children }) => {
  return (
    <div className='flex w-[100%] overflow-x-hidden'>
      <Sidebar />
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout

import { useState } from "react";
import Sidebar from "../dashboard/components/common/Sidebar"
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='w-[100%] overflow-x-hidden'>
      <div className={isSidebarOpen ? "w-64" : "w-20"}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      </div>
      <motion.div
        initial={{ marginLeft: 80 }}
        animate={{ marginLeft: isSidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {children}
      </motion.div>

    </div>
  )
}

export default DashboardLayout


import Header from "../components/common/Header";
import Dashboardlayout from "../../layout/DashboardLayout";
import { Link } from "react-router-dom";
import { useState } from "react";
import MyScraps from "./MyScraps";
import MyScrapRes from "./MyScrapRes";
const MyDeals = () => {
    const [show, setShow] = useState("scraps");
  return (
    <Dashboardlayout>
    <div className='flex-1 relative py-6 px-4 lg:px-8 overflow-auto'>
        
        <div className='flex justify-between items-center max-w-7xl mx-auto '>
        <Header title='Your Scraps' />
        <Link to={"/create-scrap"} className='text-sm font-semibold'>
					<button className="btn bg-primary text-white"> + Add Scrap</button>
				</Link>
			</div>

            <div className="flex gap-4 mb-2 p-6">
		<button
			className={`px-4 py-2 rounded-md ${
				show === "scraps" ? "bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300"
			}`}
			onClick={() => setShow("scraps")}
		>
			My Scrap
		</button>
		<button
			className={`px-4 py-2 rounded-md ${
				show === "scrapsRes" ? "bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300"
			}`}
			onClick={() => setShow("scrapsRes")}
		>
			My Scrap Request 
		</button>
		</div>

        {show === "scraps" && 
		<div className='overflow-x-auto'>
		<MyScraps />
		</div>
		}
        {show === "scrapsRes" && <div className='overflow-x-auto'><MyScrapRes /></div>}
        
    </div>
    </Dashboardlayout>
  )
}

export default MyDeals

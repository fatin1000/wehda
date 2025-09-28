import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import CreateScrap from "./pages/CreateScrap";
import NotificationsPage from "./pages/NotificationsPage";
import ScrapPage from "./pages/ScrapPage";
import SettingsPage from "./components/dashboard/pages/SettingsPage";
import MyDeals from "./components/dashboard/pages/MyDeals";
import MyLikes from "./components/dashboard/pages/MyLikes";
import Network from "./components/dashboard/pages/Network";
import Pricing from "./components/home/Pricing";
import ProfilePage from "./pages/ProfilePage";
import Services from "./pages/Services";
import Workers from "./pages/Workers";
import DepotPage from "./pages/DepotPage";
import Contact from "./components/home/Contact";
import Overview from "./admin/Overview"
import Users from "./admin/Users"
import Settings from "./admin/Settings"
import Scraps from "./admin/Scraps"
import Forbidden from "./pages/Forbidden";
import Mail from "./admin/Mail";
import Msg from "./admin/components/Msg";
import AdminLoginPage from "./admin/auth/AdminLoginPage";
import NotFound from "./pages/NotFound";
import ScrapRes from "./components/dashboard/components/common/ScrapRes";

import './i18n';

function App() {


	const navigate = useNavigate();
	const token = localStorage.getItem("jwt-wehda");

const { data: authUser, isLoading } = useQuery({
  queryKey: ["authUser"],
  enabled: !!token,
  queryFn: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data || null;
    } catch (err) {
      if (err.response?.status === 401) return null;
      toast.error(err.response?.data?.message || "Something went wrong");
      return null;
    }
  },
});
	const { data: authAdmin, isLoading : isLoadingAdmin } = useQuery({
		queryKey: ["authAdmin"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/admin/adminAuth");
				if(!res.data) return null;
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null;
				}
				toast.error(err.response.data.message || "Something went wrong");
			}
		},
	});

	if (isLoading) return null;
	if (isLoadingAdmin) return null;

	const activeUser = authUser?.active === false ? false : authUser;
    if (authUser?.active == false) {
	  navigate("/forbidden")
	} 
	
	return (
		<Layout>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/depot' element={<DepotPage />} />
				<Route path='/pricing' element={<Pricing />} />
				<Route path='/contact' element={<Contact />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/depot"} />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/depot"} />} />
				<Route path='/create-scrap' element={ activeUser ? <CreateScrap /> : <Navigate to={"/login"} />} />
				<Route path='/notifications' element={activeUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
				<Route path='/scrap/:id' element={activeUser ? <ScrapPage /> : <Navigate to={"/login"} />} />
				<Route path='/profile/:id' element={activeUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
				<Route path='/dashboard'>
					<Route index element={activeUser ? <MyDeals /> : <Navigate to={"/login"} />} />
					<Route path='likes' element={activeUser ? <MyLikes /> : <Navigate to={"/login"} />} />
					<Route path='network' element={activeUser ? <Network /> : <Navigate to={"/login"} />} />
					<Route path='settings' element={activeUser ? <SettingsPage /> : <Navigate to={"/login"} />} />
					<Route path='scrap/:scrapId' element={activeUser ? <ScrapRes /> : <Navigate to={"/login"} />} />
				</Route>
				<Route  path="/services" element={activeUser ? <Services /> : <Navigate to={"/login"} />}/>
				<Route  path="/workers" element={activeUser ? <Workers /> : <Navigate to={"/login"} />}/>
				<Route path='/admin'>
					<Route index element={authAdmin ? <Overview /> : <Navigate to={"/admin/login"} />} />
					<Route path='users' element={authAdmin ? <Users /> : <Navigate to={"/admin/login"} />} />
					<Route path='scraps' element={authAdmin ? <Scraps /> : <Navigate to={"/admin/login"} />} />
					<Route path='mail' element={authAdmin ? <Mail /> : <Navigate to={"/admin/login"} />} />
					<Route path='mail/:id' element={authAdmin ? <Msg /> : <Navigate to={"/admin/login"} />} />
					<Route path='settings' element={authAdmin ? <Settings /> : <Navigate to={"/admin/login"} />} />
					<Route path='login' element={!authAdmin ? <AdminLoginPage /> : <Navigate to={"/admin"} />} />
				</Route>
				<Route path="/forbidden" element={<Forbidden/>}/>
				<Route path='*' element={<NotFound />} />
			</Routes>
			<Toaster />
		</Layout>
	);
}

export default App;

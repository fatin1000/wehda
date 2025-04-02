import { useQuery } from "@tanstack/react-query";
import Dashboardlayout from "../../layout/DashboardLayout";
import DangerZone from "../components/settings/DangerZone";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";

const SettingsPage = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	return (
		<Dashboardlayout>
		<div className='relative'>
			<div className='mx-auto py-6 px-4 lg:px-8'>
				<Profile img={authUser.profilePic ? authUser.profilePic : "/avatar.png"} username={authUser.username} headline={authUser.headline} id={authUser._id} />
				<Notifications />
				<Security />
				<DangerZone />
			</div>
		</div>
		</Dashboardlayout>
	);
};
export default SettingsPage;

import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";
const SignUpPage = () => {
	return (
		<div className='flex flex-col py-12 w-full px-10'>
			<div className='  sm:mx-auto sm:w-full sm:max-w-md'>
				<img className='mx-auto size-20 object-cover rounded overflow-hidden' src='/logo.jpg' alt='wehda' />
				<h2 className='text-center text-3xl font-extrabold text-gray-900'>
					Make the most of your professional life
				</h2>
			</div>
					<SignUpForm />

					
		</div>
	);
};
export default SignUpPage;


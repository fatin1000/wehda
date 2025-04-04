import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { ChevronDownIcon } from '@heroicons/react/16/solid'

import { cityOptions ,fildOptions } from "../../data/options.js";

const animatedComponents = makeAnimated();
const SignUpForm = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [company, setCompany] = useState("");
	const [location, setLocation] = useState("");
	const [services, setServices] = useState(false);
	const [headline, setHeadline] = useState("");
	const [laborPayment, setLaborPayment] = useState("daily");
	// fields
	const [fields, setFields] = useState([]);
	//loader
	const [labor, setLabor] = useState("");

	//go to next slide 
	const [step, setStep] = useState("step1");

	const queryClient = useQueryClient();

	const { mutate: signUpMutation, isLoading } = useMutation({
		mutationFn: async (data) => {
			const res = await axiosInstance.post("/auth/signup", data);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Something went wrong");
		},
	});

	const handleSignUp = (e) => {
		e.preventDefault();
		if (phone.length !== 9) {
			toast.error("Phone number must be 9 digits");
			return; // منع الإرسال إذا كان الرقم غير صالح
		  }
		signUpMutation({ username, email, password , phone, company, location, fields, services, labor, laborPayment,headline });
	};

	

	
	  const limitOptions = (current, fields, loader ) => {
		if (loader === "more than 9") return fields.length >= 7;

		return fields.length >= 3;
	  };	  
		const handleChange = (selected) => {
		  setFields(selected);
		};

		const handleNextStep = (newStep) => {
			setStep(newStep);
			window.scrollTo({
			  top: 0, // الانتقال إلى بداية الصفحة
			  //behavior: 'smooth',
			});
		  };
	return (
		<form onSubmit={handleSignUp}>
			
			 <div className="mx-auto mt-10 sm:max-w-[80%]">
				<div className="w-full">
				<ul className="steps mb-4 text-gray-500 text-sm w-[100%]">
			<li className="step step-primary">Register</li>
			<li className={step === "step2" ? "step step-primary" : "step"}>Details</li>
			</ul>
				</div>
			<div className="h-px bg-gray-200 mb-4" ></div>
			
			{step === "step1" &&	(<div className="pb-12">
			<h2 className="text-base/7 font-semibold text-primary">Personal Information</h2>
			<p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

			<div className=" mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

				<div className="sm:col-span-4">
				<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
					Your Name
				</label>
				<div className="mt-2">
					<input
					type='text'
					placeholder='Username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400"
					/>
				</div>
				</div>

				<div className="sm:col-span-4">
				<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
					Your Email
				</label>
				<div className="mt-2">
					<input
					type='email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 "
					/>
				</div>
				</div>

				<div className="sm:col-span-4">
				<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
					Your Phone Number
				</label>
				<div className="mt-2 flex items-center gap-1  w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border">
					<div className="flex items-center gap-1 ">
					<img src="./SA_flag.svg" alt="" className="h-4" />
					<span>+966</span>
					</div>
					<div className="divider lg:divider-horizontal"></div>
					<input
					type='tel'
					placeholder='505505505'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					className=" placeholder:text-gray-400  focus:outline-none "
					/>
				</div>
				</div>

				<div className="sm:col-span-4">
				<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
					Company Name
				</label>
				<div className="mt-2">
					<input
					type='text'
					placeholder='Your Company Name'
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 "
					/>
				</div>
				</div>


				<div className="sm:col-span-3">
				<label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
					Your Location
				</label>
				<div className="mt-2 grid grid-cols-1">
					<select
					id="city"
					name="city"
					onChange={(e) => setLocation(e.target.value)}
					value={location}
					autoComplete="country-name"
					className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 border placeholder:text-gray-400 "
					>
						<option value="" disabled>Select...</option>
						{cityOptions.map( e => <option key={e} value={e}>{e}</option>)}
					</select>
					<ChevronDownIcon
					aria-hidden="true"
					className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
					/>
				</div>
				</div>

				<div className="sm:col-span-4">
				<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
					Create Password
				</label>
				<div className="mt-2">
					<input
					type='password'
					placeholder='Password (6+ characters)'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 "
					/>
				</div>
				</div>

			</div>
			<div className="mt-6 flex items-center justify-end gap-x-6">
			<button
				type="button"
				className="btn btn-primary text-sm font-semibold leading-6 text-white sm:w-[250px]"
				onClick={() => handleNextStep("step2")}
			>
				 Next
				</button>
			</div>
				</div>
			
			)}

				{/* Notifications */}
				{step === "step2" && (<div className="pb-12">
					{/* <h2 className="text-base/7 font-semibold text-gray-900">Notifications</h2>
					<p className="mt-1 text-sm/6 text-gray-600">
						We will always let you know about important changes, but you pick what else you want to hear about.
					</p> */}
					<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<div className="flex  gap-3 col-span-3 items-center">
						<div className="flex w-full  h-10  gap-10">
							<label htmlFor="headline">Headline </label>
							<select name="headline" id="headline"
							className="flex-1  h-10 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 "
							value={headline}
							onChange={(e) => setHeadline(e.target.value)}
							>
								<option value="" disabled>Select...</option>
								<option value="Supplier">Supplier</option>
								<option value='Contractor' disabled>Contractor</option>
								<option value="Supplier and Contractor" disabled>Supplier and Contractor</option>
							</select>
						</div>
					</div>
					<div className="flex flex-col gap-3 col-span-4">
					<div className='flex items-center gap-2 py-3'>
						
						<button
							type="button"
							className={`
					relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none
					${services ? "bg-indigo-600" : "bg-gray-600"}
					`}
							onClick={() => setServices(!services)}
						>
							<span
								className={`inline-block size-4 transform transition-transform bg-white rounded-full 
						${services ? "translate-x-6" : "translate-x-1"}
						`}
							/>
						</button>
						<span className=''>Offer to provide labor to others</span>
					</div>

						{/* labor option */}
						{services && (
							<div className=" ms-6">
							<div className="flex items-center gap-x-3">
							<input
								id="labor"
								name="labor"
								type="radio"
								value={"less than 9"}
								onChange={(e) => setLabor(e.target.value)}
								className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
							/>
							<label htmlFor="less than 9" className="block font-medium text-gray-900">
								The workers is less than 9 ( 0 - 9)
							</label>
							</div>
	
							<div className="flex items-center gap-x-3">
							<input
								id="labor"
								name="labor"
								type="radio"
								value={"more than 9"}
								onChange={(e) => setLabor(e.target.value)}
								className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
							/>
							<label htmlFor="more than 9" className="block font-medium text-gray-900">
								The workers is more than 9 
							</label>
							</div>


							<div className="flex items-center gap-10 mt-4">
						
							<label htmlFor="laborPayment" className="text-gray-500">How do you pay your workers? </label>
							<select name="laborPayment" id="laborPayment"
							className="h-10 rounded-md w-fit bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400  sm:text-sm/6"
							value={laborPayment}
							onChange={(e) => setLaborPayment(e.target.value)}
							>
								<option value="" disabled>Select...</option>
								<option value="daily">Daily</option>
								<option value='monthly'>Monthly</option>
							</select>
					</div>
							</div>
						)}
						

                	</div>


					<div className="sm:col-span-3">
				<label htmlFor="filelds" className="block text-sm/6 font-medium text-gray-900">
					Select <span className=" text-primary py-2 px-3 border border-primary m-1 rounded-full">{ (labor === "" || labor === "less than 9")? "3" : "7" }</span> Fields you are working in
				</label>
				<div className="mt-2 grid grid-cols-1">
					<Select
						name="fields"
						id="fields"
						closeMenuOnSelect={false}
						components={animatedComponents}
						isMulti
						isSearchable
						options={fildOptions}
						value={fields}
						onChange={handleChange}
						isOptionDisabled={(option) => limitOptions(option, fields , labor)}
						/>				
				</div>
					</div>

		  		</div>

				<div className="mt-6 flex items-center justify-end gap-x-6">
				<button
					type="button"
					className="btn btn-outline sm:w-[250px]"
					onClick={()=> handleNextStep("step1")}
				>
					Back
				</button>
				<button type='submit' disabled={isLoading} className='btn bg-primary text-white sm:w-[250px]'>
					{isLoading ? <Loader className='size-5 animate-spin' /> : "Agree & Join"}
			 	</button>
				</div>
				</div>)}
				
			 </div>

		</form>
	);
};
export default SignUpForm;

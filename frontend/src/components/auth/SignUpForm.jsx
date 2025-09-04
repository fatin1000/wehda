import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useTranslation } from 'react-i18next';

import { ChevronDownIcon } from '@heroicons/react/16/solid'

import { cityOptions, fildOptions, headlineOptions, laborPaymentOptions } from "../../data/options.js";
import { useNavigate } from "react-router-dom";


const animatedComponents = makeAnimated();
const SignUpForm = () => {
	const { t } = useTranslation();
	const dir = localStorage.getItem("i18nextLng");
	console.log(dir);
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [company, setCompany] = useState("");
	const [location, setLocation] = useState("");
	const [services, setServices] = useState(false);
	const [headline, setHeadline] = useState("Supplier");
	const [record, setRecord] = useState(null);
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
			const res = await axiosInstance.post("/auth/signup", data, { headers: { "Content-Type": "multipart/form-data" } });
			return res.data;
		},
		onSuccess: () => {
			toast.success(t("auth.signup"));
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			const message = err.response?.data?.message;
		  
			if (err.response?.status === 403) {
			  navigate("/contact");
			} else {
			  toast.error(message || t("common.somethingWentWrong"));
			}
		  },
	});

	const handleSignUp = (e) => {
		e.preventDefault();
		if (phone.length !== 9) {
			toast.error(t("auth.phone"));
			return; // منع الإرسال إذا كان الرقم غير صالح
		}
		signUpMutation({ username, email, password, phone, company, location, fields, services, labor, laborPayment, headline ,record});
	};




	const limitOptions = (current, fields, loader) => {
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

	const translatedFildOptions = fildOptions.map(option => ({
		value: option.value,
		label: t(option.label)
	  }));
	  
	return (
		<form onSubmit={handleSignUp}>

			<div className="mx-auto mt-10 sm:max-w-[80%]">
				<div className="w-full">
					<ul className="steps mb-4 text-gray-500 text-sm w-[100%]">
						<li className="step step-primary">{t("auth.register")}</li>
						<li className={step === "step2" ? "step step-primary" : "step"}>{t("auth.details")}</li>
					</ul>
				</div>
				<div className="h-px bg-gray-200 mb-4" ></div>

				{step === "step1" && (<div className="pb-12">
					<h2 className="text-base/7 font-semibold text-primary">{t("auth.personalInfo")}</h2>
					<p className="mt-1 text-sm/6 text-gray-600">{t("auth.permanentAddress")}</p>

					<div className=" mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

						<div className="sm:col-span-4">
							<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
								{t("auth.username")}
							</label>
							<div className="mt-2">
								<input
									type='text'
									placeholder={t("auth.username")}
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400"
								/>
							</div>
						</div>

						<div className="sm:col-span-4">
							<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
								{t("auth.email")}
							</label>
							<div className="mt-2">
								<input
									type='email'
									placeholder={t("auth.email")}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 "
								/>
							</div>
						</div>

						<div className="sm:col-span-4">
							<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
								{t("auth.phone")}
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
								{t("auth.company")}
							</label>
							<div className="mt-2">
								<input
									type='text'
									placeholder={t("auth.company")}
									value={company}
									onChange={(e) => setCompany(e.target.value)}
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 "
								/>
							</div>
						</div>


						<div className="sm:col-span-3">
							<label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
								{t("auth.location")}
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
									<option value="" disabled>{t("form.select")}</option>
									{cityOptions.map(e => <option key={e.value} value={e.value}>{t(e.label)}</option>)}
								</select>
								<ChevronDownIcon
									aria-hidden="true"
									className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
								/>
							</div>
						</div>

						<div className="sm:col-span-4">
							<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
								{t("auth.createPassword")}
							</label>
							<div className="mt-2">
								<input
									type='password'
									placeholder={t("auth.createPassword")}
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
							{t("auth.next")}
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
						{/* <div className="flex  gap-3 col-span-3 items-center">
							<div className="flex w-full  h-10  gap-10">
								<label htmlFor="headline">{t("auth.headline")} </label>
								<select name="headline" id="headline"
									className="flex-1  h-10 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400 "
									value={headline}
									onChange={(e) => setHeadline(e.target.value)}
								>
									<option value="" disabled>{t("form.select")}</option>
									{headlineOptions.map(e => <option key={e.value} value={e.value}>{t(e.label)}</option>)}
								</select>
							</div>
						</div> */}

<div className="mb-6">
  <label htmlFor="record" className="block text-sm font-semibold text-gray-800 mb-2">
    {t("auth.record")}
  </label>

  <div className="relative flex items-center justify-between rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 hover:border-blue-400 transition-colors">
    <input
      type="file"
      id="record"
      name="record"
      accept=".pdf,image/*"
      required
      onChange={(e) => setRecord(e.target.files[0])}
      className="absolute inset-0 opacity-0 cursor-pointer z-10"
    />
    <div className="flex items-center gap-3 text-gray-600 text-sm z-0">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span>{t("auth.uploadRecord")}</span>
    </div>
  </div>

  {record && (
    <p className="mt-3 text-sm text-green-700 font-medium">
		{t("auth.uploaded")}
	   <span className="font-semibold">{record.name}</span>
    </p>
  )}
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
									{dir === "ltr" ? <span
										className={`inline-block size-4 transform transition-transform bg-white rounded-full 
										${services ? "translate-x-6" : "translate-x-1"}
										`} /> :
										<span
										className={`inline-block size-4 transform transition-transform bg-white rounded-full 
										${services ? "-translate-x-6" : "-translate-x-1"}
										`} />}
								</button>
								<span className=''>{t("auth.offerLabor")}</span>
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
											{t("auth.workersLessThan9")}
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
											{t("auth.workersMoreThan9")}
										</label>
									</div>


									<div className="flex items-center gap-10 mt-4">

										<label htmlFor="laborPayment" className="text-gray-500">{t("auth.howPayWorkers")} </label>
										<select name="laborPayment" id="laborPayment"
											className="h-10 rounded-md w-fit bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400  sm:text-sm/6"
											value={laborPayment}
											onChange={(e) => setLaborPayment(e.target.value)}
										>
											<option value="" disabled>{t("form.select")}</option>
											{laborPaymentOptions.map(e => <option key={e.value} value={e.value}>{t(e.label)}</option>)}
										</select>
									</div>
								</div>
							)}


						</div>


						<div className="sm:col-span-3">
							<label htmlFor="filelds" className="block text-sm/6 font-medium text-gray-900">
								{t("auth.selectFields")} <span className=" text-primary py-2 px-3 border border-primary m-1 rounded-full">{(labor === "" || labor === "less than 9") ? "3" : "7"}</span>
							</label>
							<div className="mt-2 grid grid-cols-1">
								<Select
									name="fields"
									id="fields"
									closeMenuOnSelect={false}
									components={animatedComponents}
									isMulti
									isSearchable
									options={translatedFildOptions}
									value={fields}
									onChange={handleChange}
									isOptionDisabled={(option) => limitOptions(option, fields, labor)}
								/>
							</div>
						</div>

					</div>

					<div className="mt-6 flex items-center justify-end gap-x-6">
						<button
							type="button"
							className="btn btn-outline sm:w-[250px]"
							onClick={() => handleNextStep("step1")}
						>
							{t("auth.back")}
						</button>
						<button type='submit' disabled={isLoading} className='btn bg-primary text-white sm:w-[250px]'>
							{isLoading ? <Loader className='size-5 animate-spin' /> : t("auth.agreeJoin")}
						</button>
					</div>
				</div>)}

			</div>

		</form>
	);
};
export default SignUpForm;

/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ChevronDownIcon, Info, Loader } from "lucide-react";
import { useTranslation } from 'react-i18next';


const ScrapRequestForm = ({ scrap }) => {
	const { t } = useTranslation();
	const scrapId = scrap._id
	const [quantity, setQuantity] = useState(scrap.quantity);
	const [price, setPrice] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");

	const [toggle, setToggle] = useState(false);


	const queryClient = useQueryClient();


	const { mutate: scrapRequestMutation, isPending } = useMutation({
		mutationFn: async (data) => {
			const res = await axiosInstance.post("/scrapResponse/request", data);
			return res.data;
		},
		onSuccess: () => {
			toast.success(t("scrap.sendRequest"));
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			queryClient.invalidateQueries({ queryKey: ["scraps"] });
			queryClient.invalidateQueries({ queryKey: ["scrap", scrapId] });
			queryClient.invalidateQueries({ queryKey: ["scrapResStatus", scrapId] });
			queryClient.invalidateQueries({ queryKey: ["MyScrapsRes"] });
			queryClient.invalidateQueries({ queryKey: ["MyScraps"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || t("common.somethingWentWrong"));
		},
	});

	const handleScrapRequest = (e) => {
		e.preventDefault();
		scrapRequestMutation({ quantity, price, paymentMethod, scrapId: scrap._id, recipient: scrap.author._id });
	};


	//   const handleCheckboxChange = (event) => {
	// 	const { value } = event.target;
	// 	setIncludeSerivces((prevState) =>
	// 	  prevState.includeSerivcess(value)
	// 		? prevState.filter((item) => item !== value)
	// 		: [...prevState, value]
	// 	);
	//   };

	return (
		<form onSubmit={handleScrapRequest} >
			<div className="max-w-[90%] mx-auto mt-10 sm:max-w-[80%]">
				<div className="pb-12">
					<h2 className="text-2xl text-primary font-semibold">{t("scrap.sendDeal")}</h2>
					<p className="mt-1 text-sm/6 text-gray-600">{t("scrap.dealDataNote")}</p>

					<div className=" mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						{(scrap.sell == "retail") && (<div className="sm:col-span-4">
							<label htmlFor="first-name" className="text-primary block text-sm/6 font-medium">
								{t("label.quantity")} :
							</label>
							<div className="mt-6 space-y-6">
								<div className="flex items-center gap-x-3">
									<input
										id="all quantity"
										name="quantity"
										type="radio"
										value={scrap.quantity}
										onChange={(e) => { setQuantity(e.target.value); setToggle(false); }}
										className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
									/>
									<label htmlFor="all quantity" className="block text-sm/6 font-medium text-gray-900">
										{t("scrap.allQuantity")}
									</label>
								</div>

								<div className="flex items-center gap-x-3">
									<input
										id="custom quantity"
										name="quantity"
										type="radio"
										value={quantity}
										onChange={(e) => { if (e.target.checked) { setToggle(true); } else { setToggle(false); } }}
										className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
									/>
									<label htmlFor="custom quantity" className="block text-sm/6 font-medium text-gray-900">
										{t("scrap.customizeQuantity")}
									</label>
									{toggle && (
										<input
											className="rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border"
											type="number"
											max={scrap.quantity}
											min={scrap.minAmount}
											value={quantity}
											onChange={(e) => setQuantity(e.target.value)} placeholder={t("scrap.enterQuantity")} />
									)}
								</div>
								<p className="mt-1 text-sm/6 text-gray-600">{t("scrap.quantityUnitNote")}</p>
							</div>

						</div>)}
						<div className="flex justify-between sm:col-span-4">
							<div className="sm:col-span-4 flex flex-col gap-2 sm:items-center sm:flex-row">
								<label htmlFor="last-name" className="text-primary block text-sm/6 font-medium ">
									{t("scrap.price")} :
								</label>
								<div className="mt-2 flex rounded-md shadow-sm relative">
									<input
										type="number"
										name="price"
										id="price"
										className="rounded-md  bg-white ps-3 py-1.5 text-base text-gray-900 border"
										value={price}
										onChange={(e) => setPrice(e.target.value)}
									/>
									<span className="mt-2 text-sm text-gray-500 absolute end-3">SR</span>
								</div>
							</div>

						</div>
						{price && <div className="sm:col-span-4 mt-1  text-yellow-700 bg-yellow-100 p-2 rounded flex gap-2"><Info size={70} /><p className="text-sm/6">{t("scrap.fairPriceNote")} {scrap.unitPrice} {t("scrap.is")} <span className="font-semibold">{scrap.unitPrice * quantity}</span> ,{quantity != scrap.quantity && <span> {t("scrap.andAllQuantityPrice")} {scrap.unitPrice * scrap.quantity} ,</span>}  {t("scrap.butYouCanCustomize")}</p> </div>}
						<div className="sm:col-span-4 flex flex-col gap-2 sm:items-center sm:flex-row">
							<label htmlFor="paymentMethod" className="min-w-[110px] text-sm/6 font-medium text-primary">
								{t("scrap.paymentMethod")} :
							</label>
							<div className="mt-2 grid grid-cols-1">
								<select
									id="paymentMethod"
									name="paymentMethod"
									onChange={(e) => setPaymentMethod(e.target.value)}
									value={paymentMethod}
									className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 border placeholder:text-gray-400 sm:text-sm/6"
								>
									<option value="" disabled>{t("form.select")}</option>
									<option value="Cash">{t("scrap.cash")}</option>
									<option value="Bank Transfer">{t("scrap.bankTransfer")}</option>
								</select>
								<ChevronDownIcon
									aria-hidden="true"
									className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
								/>
							</div>
						</div>
					</div>
				</div>
				<button type='submit' disabled={isPending} className='btn bg-primary w-full text-white max-w-[250px]'>
					{isPending ? <Loader className='size-5 animate-spin' /> : t("scrap.sendRequest")}
				</button>
			</div>

		</form>
	);
};
export default ScrapRequestForm

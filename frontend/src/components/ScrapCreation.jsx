import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Camera, Loader, XCircleIcon } from "lucide-react";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { cityOptions ,unitsOptions ,itemOptions ,categoryOptions,itemStatusOptions, sellOptions} from "../data/options";


const ScrapCreation = () => {
	
	const [itemName, setItemName] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [units, setUnits] = useState("");
	const [discription, setDiscription] = useState("");
	const [location ,setLocation] = useState("");
	const [category ,setCategory] =useState("");
	const [itemStatus,setItemStatus] = useState("");
	const [minAmount, setMinAmount] = useState(0);
	const [sell, setSell] = useState("");
	const [unitPrice, setUnitPrice] = useState(0);
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	


	const queryClient = useQueryClient();
	const navigate = useNavigate();


	const { mutate: createScrapMutation , isPending } = useMutation({
		mutationFn: async (data) => {
			const res = await axiosInstance.post("/scraps/create", data);
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Scrap created successfully");
			queryClient.invalidateQueries({ queryKey: ["scraps"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to create scrap");
		},
	});

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};

	const handleScrapCreation = async(e) => {
		e.preventDefault();
		if(quantity < minAmount) return ("Quantity should be greater than Min Amount");

		const scrapData = { itemName, quantity, units, discription,location,category,itemStatus ,sell,minAmount,unitPrice };
		if (image) scrapData.image = await readFileAsDataURL(image);
		createScrapMutation(scrapData);
		};

	const resetForm = () => {
		setItemName("");
		setQuantity(0);
		setUnits("");
		setDiscription("");
		setLocation("");
		setCategory("");
		setItemStatus("");
		setMinAmount(0);
		setSell("");
		setUnitPrice(0);
		
		setImage(null);
		setImagePreview(null);

		navigate("/depot");
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleItemChange = (selected) => {
		setItemName(selected);
	  };
		
	return (
		<form onSubmit={handleScrapCreation}>
			<div className="max-w-[90%] mx-auto mt-10 sm:max-w-[80%] ">
				<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
			{/* step 1 */}
				<h3 className="text-1xl mb-4 font-semibold leading-6 text-primary sm:col-span-6 text-3xl">Create Scrap</h3>
				<div className="sm:col-span-4 flex gap-2 items-center">
					<label htmlFor="itemName" className='min-w-[100px] text-sm font-medium text-gray-700'>Item Name</label>
					<Select
						name="itemName"
						id="itemName"
						options={itemOptions}
						value={itemName}
						onChange={handleItemChange}
						className='w-full flex-1'
						/>
				</div>
				<div className="sm:col-span-2"></div>
				<div className="sm:col-span-2 flex gap-2 items-center">
					<label htmlFor="quantity" className='min-w-[100px] text-sm font-medium text-gray-700'>
						Quantity</label>	
					<input
						type='number'
						id="quantity"
						name="quantity"
						min="1"
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						className='mt-1 p-2 border rounded-md w-full flex-1 shadow-sm'
					/>
				</div>
				<div className="sm:col-span-3 flex gap-2 items-center">
				<label htmlFor="unit" className=" text-sm font-medium text-gray-700">
					Unit
				</label>
				<div className="mt-2 grid grid-cols-1">
					<select
					id="unit"
					name="unit"
					onChange={(e) => setUnits(e.target.value)}
					value={units}
					className="shadow-sm col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 border placeholder:text-gray-400  sm:text-sm/6 flex-1"
					>
						<option value="" disabled>Select...</option>
						{unitsOptions.map( e => <option key={e} value={e}>{e}</option>)}
					</select>
					<ChevronDownIcon
					aria-hidden="true"
					className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
					/>
				</div>
				</div>
				<div className="sm:col-span-2 flex gap-2 items-center ">
					<label htmlFor="last-name" className="min-w-[100px] text-sm/6 font-medium text-gray-900">
						Buy
					</label>
					<div className="mt-2 rounded-md shadow-sm min-w-[100px] w-full">
								<select
								id="sell"
								name="sell"
								value={sell}
								onChange={(e) => setSell(e.target.value)}
								className="h-10 w-full rounded-md bg-white py-1.5 px-8 pl-3 text-base text-gray-900 border placeholder:text-gray-400  sm:text-sm/6 flex-1"
								>
									<option value="" disabled>Select...</option>
									{sellOptions.map( e => <option key={e} value={e}>{e}</option>)}
								</select>
						</div>
				</div>

				<div className="sm:col-span-2 flex gap-2 items-center">
					<label htmlFor="last-name" className="min-w-[100px] text-sm/6 font-medium text-gray-900">
						Unit Price
					</label>
					<div className="mt-2 flex rounded-md shadow-sm relative">
								<input
								type="number"
								name="price"
								id="price"
								min="1"
								className="rounded-md bg-white py-1.5 ps-2 text-base text-gray-900 border"
								value={unitPrice}
								onChange={(e) => setUnitPrice(e.target.value)}
								/>
								<span className="mt-2 text-sm text-gray-500 absolute end-3">SR</span>
							</div>
							
					</div>
				{sell === "retail" && (
				<div className="sm:col-span-2 flex gap-2 items-center">
					<label htmlFor="minAmount" className='min-w-[100px] text-sm font-medium text-gray-700'>
						Min Amount</label>	
					<input
						type='number'
						id="minAmount"
						name="minAmount"
						value={	minAmount}
						onChange={(e) => setMinAmount(e.target.value)}
						className='shadow-sm mt-1 p-2 border rounded-md w-full flex-1'
					/>
				</div>
				)}

				

        <div className="sm:col-span-6 flex gap-2 items-center">
				<label htmlFor="projectLocation" className="min-w-[110px] text-sm/6 font-medium text-gray-900">
					Category
				</label>
				<div className="mt-2 grid grid-cols-1">
					<select
					id="category"
					name="category"
					onChange={(e) => setCategory(e.target.value)}
					value={category}
					className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 border placeholder:text-gray-400  sm:text-sm/6 flex-1"
					>
						
						<option value="" disabled>Select...</option>
						{categoryOptions.map( e => <option key={e} value={e}>{e}</option>)}
					</select>
					<ChevronDownIcon
					aria-hidden="true"
					className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
					/>
				</div>
				</div>
		
				<div className="sm:col-span-4 ">
				{imagePreview && (
						<div className='mt-4 h-[300px] overflow-hidden rounded-lg relative'>
							<span><XCircleIcon size={30} className='absolute top-2 right-2 cursor-pointer' onClick={() => setImagePreview(null)}/></span>
							<img src={imagePreview} alt='Selected' className=' h-[100%] w-[100%] object-cover' />
						</div>
					)}

				{!imagePreview &&	<div className='flex justify-center items-center mt-4 border-dashed border-2 border-gray-300 rounded-lg h-[300px]'>
						<div className='flex flex-col justify-center items-center space-x-4'>
							<label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
								<Camera  size={20} className='mr-2' />
								<span> Add Photo</span>
								<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} required />
							</label>
							<p className="text-gray-500 text-sm mt-2">files allowed: png, jpg, jpeg</p>
						</div>

						
					</div>}
				
				</div>
				<div className="sm:col-span-4 ">
					<label htmlFor="discription" className='block text-sm font-medium text-gray-700'>Discription</label>
					<textarea
						id="discription"
						name="discription"
						value={discription}
						onChange={(e) => setDiscription(e.target.value)}
						className='mt-1 p-2 border rounded-md w-full'
					></textarea>
				</div>
				
				<div className="sm:col-span-6 flex gap-2 items-center">
				<label htmlFor="projectLocation" className="min-w-[110px] text-sm/6 font-medium text-gray-900">
					Location
				</label>
				<div className="mt-2 grid grid-cols-1">
					<select
					id="Location"
					name="Location"
					onChange={(e) => setLocation(e.target.value)}
					value={location}
					className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 border placeholder:text-gray-400  sm:text-sm/6 flex-1"
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


				
			
				<div className="sm:col-span-4 flex gap-2 items-center">
				<label htmlFor="projectStatus" className="min-w-[110px] text-sm/6 font-medium text-gray-900">
					Item Status
				</label>
				<div className="mt-2 grid grid-cols-1">
					<select
          id="itemStatus"
          name="itemStatus"
					onChange={(e) => setItemStatus(e.target.value)}
					value={itemStatus}
					className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 border placeholder:text-gray-400 sm:text-sm/6 flex-1"
					>
						<option value="" disabled>Select...</option>
						{itemStatusOptions.map( e => <option key={e} value={e}>{e}</option>)}
					</select>
					<ChevronDownIcon
					aria-hidden="true"
					className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
					/>
				</div>
				</div>

					</div>
					
					<button
							className='bg-primary text-white rounded-lg px-6 py-2 hover:bg-primary-dark transition-colors duration-200 mt-10'
							type='submit'
							disabled={isPending}
						>
							{isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
						</button>
			</div>
		</form>
	);
};
export default ScrapCreation;

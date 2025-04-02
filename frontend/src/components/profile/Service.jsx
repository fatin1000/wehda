/* eslint-disable react/prop-types */
import { BicepsFlexed, CircleArrowRight, ClipboardCheck, Handshake, Pencil } from "lucide-react"
import ProfileSection from "./ProfileSection"
import { useState } from "react";
import Select from 'react-select';
import { fildOptions } from "../../data/options";
import toast from "react-hot-toast";



const Service = ({ userData, onSave, isOwnProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingF, setIsEditingF] = useState(false);
	const [editedData, setEditedData] = useState({});


    const limitOptions = (current, fields, loader ) => {
		if (loader === "more than 9") return fields.length >= 7;

		return fields.length >= 3;
	  };
      const handleChange = (selected) => {
        setEditedData({ ...editedData, fields: selected });
      };	  
    const handleSave = () => {
        if (editedData?.fields?.length === 0) {
            toast.error("Please select at least one field before saving.");
            return;
        }
        if (editedData.services) {
            if (!editedData.labor) {
                toast.error("Please select at least one field before saving.");
                return;
            }
        }
		onSave(editedData);
		setIsEditing(false);
		setIsEditingF(false);
	};

  return (
    <ProfileSection icon={Handshake} title={"Services"}>
       

        <div className='mb-2'>
        
        {isEditing ? (
            <div className="mb-3">
             <input
            type="checkbox"
           id='services'
           name="services"
           checked={editedData.services ?? userData.services}
           onChange={(e) => setEditedData({ ...editedData, services : e.target.checked})}
         />
         <label htmlFor="services" className="font-medium text-gray-900">
         Do you offer to provide labor to others?
         </label>

         {/* labor option */}
						{(editedData.services ?? userData.services) && (
							<div className="mt-6 space-y-6">
							<div className="flex items-center gap-x-3">
							<input
								id="labor"
								name="labor"
								type="radio"
								value={"less than 9"}
								onChange={(e) => setEditedData({ ...editedData, labor: e.target.value })}
								className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
							/>
							<label htmlFor="less than 9" className="block text-sm/6 font-medium text-gray-900">
								The workers is less than 9
							</label>
							</div>
	
							<div className="flex items-center gap-x-3">
							<input
								id="labor"
								name="labor"
								type="radio"
								value={"more than 9"}
								onChange={(e) => setEditedData({ ...editedData, labor: e.target.value })}
								className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
							/>
							<label htmlFor="more than 9" className="block text-sm/6 font-medium text-gray-900">
								The workers is more than 9
							</label>
							</div>
                            <div>
                                
							<label htmlFor="laborPayment" className="text-gray-500">How do you pay your workers? </label>
							<select name="laborPayment" id="laborPayment"
							className="h-10 rounded-md w-fit bg-white px-3 py-1.5 text-base text-gray-900 border placeholder:text-gray-400  sm:text-sm/6"
							value={editedData.laborPayment ?? userData.laborPayment}
							onChange={(e) => setEditedData({ ...editedData, laborPayment: e.target.value })}
							>
								<option value="" disabled>Select...</option>
								<option value="daily">Daily</option>
								<option value='monthly'>Monthly</option>
							</select>
                            </div>
                                	</div>
						)}
         </div>
        ) : (
            <div className="mb-3">{(editedData.services ?? userData.services) ? (<div className="">
                <p className="font-semibold flex gap-1"><BicepsFlexed /> This User Provide Workers {userData.labor}</p> 
                <p className="text-gray-400"> payment Method : {userData.laborPayment}</p>
                </div>) : (isOwnProfile && (editedData.services ?? userData.services === false)) ? <p className="text-gray-400 italic">Do you want to offer to provide workers?</p> : <p className="text-gray-400 italic">This user does not offer to provide workers !</p>}</div>
        )}
         {isOwnProfile && (
					isEditing ? (
						<button
							className='w-full bg-green-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-green-700
							 transition duration-300 sm:w-auto'
							onClick={handleSave}
						>
							<ClipboardCheck className="size-4" />Save
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='w-full bg-blue-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-blue-700
							 transition duration-300 sm:w-auto'
						>
							<Pencil className="size-4" />Edit
						</button>
					)
				)
		}
        </div>

        <div className='mb-2'>
            <h3 className="mb-2 text-gray-400">Services He Provide :</h3>
        {/* onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })} */}
        {isEditingF ? (
            <div className="mb-4">
                <label htmlFor="filelds" className="block text-sm/6 font-medium text-gray-900">
					Select <span className="text-orange-500 underline">{ ((editedData.labor ?? userData.labor) === "" || (editedData.labor ?? userData.labor)  === "less than 9") ? "3" : "7" }</span>  Fields you are working in
				</label>
            <Select
            name="fields"
            id="fields"
            closeMenuOnSelect={false}
            isMulti
            isSearchable
            options={fildOptions}
            value={editedData.fields ?? userData.fields}
            onChange={handleChange}
            isOptionDisabled={(option) => limitOptions(option, (editedData.fields ?? userData.fields) , (editedData.labor ?? userData.labor))}
            />	
            </div>		
        ) : (
            <ul>
                {userData.fields.map( fild => <li key={fild.value} className="flex items-center gap-2 mb-2"><CircleArrowRight className="size-4 text-gray-500" /> <span>{fild.label}</span></li>)}
            </ul>
        )}

        {isOwnProfile && (
                            isEditingF ? (
                                <button
                                    className='w-full bg-green-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-green-700
                                    transition duration-300 sm:w-auto'
                                    onClick={handleSave}
                                >
                                    <ClipboardCheck className="size-4" />Save Services
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditingF(true)}
                                    className='w-full bg-blue-500 text-white py-2 px-4 rounded-full flex items-center gap-2 hover:bg-blue-700
                                    transition duration-300 sm:w-auto'
                                >
                                    <Pencil className="size-4" />Edit Services
                                </button>
                            )
                        )
                }
        </div>


       
    </ProfileSection>
  )
}

export default Service

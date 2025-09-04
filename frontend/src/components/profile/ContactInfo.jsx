/* eslint-disable react/prop-types */
import { ClipboardCheck, Mail, Pencil, Phone, PhoneCall } from "lucide-react"
import ProfileSection from "./ProfileSection"
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const ContactInfo = ({ userData, onSave, isOwnProfile }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    const handleSave = () => {
        onSave(editedData);
        setIsEditing(false);
    };

    return (
        <ProfileSection icon={PhoneCall} title={t('profile.contactInfo.title')}>
            <div className='flex items-center gap-2 mb-2'>
                <Phone size={16} className='text-gray-500' />
                {isEditing ? (
                    <input
                        type='text'
                        value={editedData.phone ?? userData.phone}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                        className='text-gray-700 text-center border'
                    />
                ) : (
                    <span className='text-gray-700'>{userData.phone}</span>
                )}
            </div>
            <div className='flex items-center gap-2 mb-4'>
                <Mail size={16} className='text-gray-500 mr-1' />
                {isEditing ? (
                    <input
                        type='text'
                        value={editedData.email ?? userData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        className='text-gray-700 text-center border'
                    />
                ) : (
                    <a href={`mailto:${userData.email}`} className='text-gray-700'>{userData.email}</a>
                )}
            </div>
            {isOwnProfile && (
                isEditing ? (
                    <button
                        className='bg-green-500 text-white py-2 px-4 rounded-full flex items-center gap-2 w-full hover:bg-green-700
							 transition duration-300 sm:w-auto'
                        onClick={handleSave}
                    >
                        <ClipboardCheck className="size-4" />{t('profile.save')} {t('navbar.Profile')}
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className='bg-blue-500 text-white py-2 px-4 rounded-full flex items-center gap-2 w-full hover:bg-blue-700
							 transition duration-300 sm:w-auto'
                    >
                        <Pencil className="size-4" />{t('profile.edit')} {t('navbar.Profile')}
                    </button>
                )
            )
            }
        </ProfileSection>
    )
}

export default ContactInfo

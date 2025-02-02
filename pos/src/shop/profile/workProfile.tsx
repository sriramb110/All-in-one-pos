import React, { useState } from "react";
import downloadImage from "../../assets/download.png";
import { Profiles } from "../Interface";
import { putBisProfile } from "../../common_component/services";

type ProfileProps = {
  profile: Profiles;
  editSuccess: () => void;
};

function WorkProfile({ profile, editSuccess }: ProfileProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableProfile, setEditableProfile] = useState<Partial<Profiles>>({
    businessName: profile.businessName,
    businessType: profile.businessType,
    registrationNumber: profile.registrationNumber,
    ownerName: profile.ownerName,
    contactEmail: profile.contactEmail,
    contactPhone: profile.contactPhone,
    businessProfile: profile.businessProfile,
    bio: profile.bio,
    establishedYear: profile.establishedYear,
  });

  // Explicitly typing the 'value' as keyof Profiles
  const personalDetails = [
    {
      value: "businessName",
      header: "Business Name",
      content: profile.businessName,
    },
    {
      value: "businessType",
      header: "Business Type",
      content: profile.businessType,
    },
    {
      value: "registrationNumber",
      header: "Registration Number",
      content: profile.registrationNumber,
      editable: true,
    },
    {
      value: "ownerName",
      header: "Owner Name",
      content: profile.ownerName,
      editable: true,
    },
    {
      value: "contactEmail",
      header: "Contact Email",
      content: profile.contactEmail,
      editable: true,
    },
    {
      value: "contactPhone",
      header: "Contact Phone",
      content: profile.contactPhone,
      editable: true,
    },
    {
      value: "businessProfile",
      header: "Business Profile",
      content: profile.businessProfile,
      editable: true,
    },
    { value: "bio", header: "BIO", content: profile.country, editable: true },
    {
      value: "establishedYear",
      header: "Established Year",
      content: profile.establishedYear,
      editable: true,
    },
  ];

  // Ensure handleChange uses keyof Profiles for the key type
  const handleChange = (key: keyof Profiles, value: string) => {
    setEditableProfile((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const editEnabile = () => {
    if (isEditing) {
      setEditableProfile({
        businessName: profile.businessName,
        businessType: profile.businessType,
        registrationNumber: profile.registrationNumber,
        ownerName: profile.ownerName,
        contactEmail: profile.contactEmail,
        contactPhone: profile.contactPhone,
        businessProfile: profile.businessProfile,
        bio: profile.bio,
        establishedYear: profile.establishedYear,
      });
    }
    setIsEditing(!isEditing);
  };

  const isDataChanged = () => {
    return Object.keys(editableProfile).some(
      (key) =>
        editableProfile[key as keyof Profiles] !==
        profile[key as keyof Profiles]
    );
  };

  const putProfileData = ()=>{
      putBisProfile(editableProfile).then((res) => { setIsEditing(!isEditing); editSuccess() }).catch((error)=>console.error(error))
      }

  return (
    <div className="w-full h-full -mt-5 flex justify-center items-center overflow-hidden">
      <div className="w-1/2 h-5/6 border flex flex-col justify-center items-center border-blue-200 rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-full h-fit flex p-1">
          <img
            src={downloadImage}
            alt="Profile"
            className="w-56 h-56 rounded-full ml-20 mt-2"
          />
          <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="font-serif text-3xl">WORK PROFILE</h1>
            <div className="gap-2 pt-2">
              <button
                onClick={editEnabile}
                className="px-4 py-2 bg-blue-500 text-white rounded-full m-2 hover:bg-blue-700"
              >
                {isEditing ? "Cancel EDIT" : "EDIT"}
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-full m-2 hover:bg-green-700">
                MEMBERSHEP
              </button>
            </div>
          </div>
        </div>
        <hr className="w-11/12 border-t border-gray-400 my-4" />
        <div className="w-full h-fit flex flex-col justify-center items-center gap-5">
          {personalDetails.map((item, index) => (
            <div key={index} className="flex w-5/6 h-8 gap-2">
              <h1 className="w-52 text-xl">{item.header}</h1>:
              {item.editable && isEditing ? (
                <input
                  type="text"
                  value={
                    editableProfile[item.value as keyof Partial<Profiles>] ?? ""
                  }
                  onChange={(e) =>
                    handleChange(item.value as keyof Profiles, e.target.value)
                  }
                  className="border border-black rounded-2xl px-2 py-0.5 text-xl w-1/2 bg-transparent"
                />
              ) : (
                <p className="w-fit p-1 text-xl">{item.content}</p>
              )}
            </div>
          ))}
        </div>
        <hr className="w-11/12 border-t border-gray-400 my-4" />
        <div className="w-full flex justify-center items-center h-1/4">
          <button
            className={
              isEditing && isDataChanged() ? "confirm" : "confirm_dissable"
            }
            disabled={!isEditing || !isDataChanged()}
            onClick={putProfileData}
          >
            Update Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkProfile;

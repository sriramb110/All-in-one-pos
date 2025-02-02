import React, { useState } from "react";
import downloadImage from "../../assets/download.png";
import { PersonalDetail, Profiles } from "../Interface";
import { putProfile } from "../../common_component/services";

type ProfileProps = {
  profile: Profiles;
  editSuccess: () => void;
};

function MyProfile({ profile, editSuccess }: ProfileProps) {
  const [editableProfile, setEditableProfile] = useState<Partial<Profiles>>({
    addressLine1: profile.addressLine1,
    addressLine2: profile.addressLine2,
    district: profile.district,
    state: profile.state,
    country: profile.country,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const personalDetails: PersonalDetail[] = [
    { value: "name", header: "NAME", content: profile.name },
    {
      value: "phoneNumber",
      header: "Phone number",
      content: profile.phoneNumber,
    },
    { value: "emailId", header: "Email ID", content: profile.emailId },
    {
      value: "addressLine1",
      header: "Address line 1",
      content: profile.addressLine1,
      editable: true,
    },
    {
      value: "addressLine2",
      header: "Address line 2",
      content: profile.addressLine2 ?? "",
      editable: true,
    },
    {
      value: "district",
      header: "District",
      content: profile.district,
      editable: true,
    },
    { value: "state", header: "State", content: profile.state, editable: true },
    {
      value: "country",
      header: "Country",
      content: profile.country,
      editable: true,
    },
  ];

  const editEnabile = () => {
    if (isEditing) {
      setEditableProfile({
        addressLine1: profile.addressLine1,
        addressLine2: profile.addressLine2,
        district: profile.district,
        state: profile.state,
        country: profile.country,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (key: keyof Profiles, value: string) => {
    setEditableProfile((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const isDataChanged = () => {
    return Object.keys(editableProfile).some(
      (key) =>
        editableProfile[key as keyof Profiles] !==
        profile[key as keyof Profiles]
    );
  };

  const putProfileData = () => {
    putProfile(editableProfile)
      .then((res) => {
        setIsEditing(!isEditing);
        editSuccess();
      })
      .catch((error) => console.error(error));
  };

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
            <h1 className="font-serif text-3xl">MY PROFILE</h1>
            <div className="gap-2 pt-2">
              <button
                onClick={editEnabile}
                className="px-4 py-2 bg-blue-500 text-white rounded-full m-2 hover:bg-blue-700"
              >
                {isEditing ? "Cancel EDIT" : "EDIT"}
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-full m-2 hover:bg-green-700">
                MEMBERSHIP
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
                  value={editableProfile[item.value] ?? ""}
                  onChange={(e) => handleChange(item.value, e.target.value)}
                  className="border border-black rounded-2xl px-2 py-0.5 text-xl w-1/2 bg-transparent"
                />
              ) : (
                <p className="w-fit px-1 text-xl">{item.content}</p>
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

export default MyProfile;

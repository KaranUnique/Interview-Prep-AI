import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const ProfileinfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  if (!user) return null;

  return (
    user && 
    <div className="flex items-center">
      {user.profileImageUrl ? (
        <img src={user.profileImageUrl} alt="Profile" className="w-11 h-11 bg-gray-300 rounded-full mr-3" />
      ) : (
        <div className="w-11 h-11 bg-gray-300 rounded-full mr-3 flex items-center justify-center font-bold text-white">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      )}
      <div>
        <div className="text-[15px] text-black font-bold leading-3">{user.name || user.email || ""}</div>
        <button className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileinfoCard;

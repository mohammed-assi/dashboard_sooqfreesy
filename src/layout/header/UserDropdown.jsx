import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { LOCAL_STORAGE, ROUTES } from "../../app/constants";
import { AUTH, FILEURL } from "../../config/endPoints";
import { getRequest } from "../../config/apiFunctions";

export default function UserDropdown() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { user, loading } = useSelector((state) => state.auth);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.PROFILE_PICTURE);
    localStorage.removeItem(LOCAL_STORAGE.USER);

    toast.success("Logout successful", {
      position: "top-right",
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      closeButton: true,
    });

    navigate(ROUTES.login);
  };

  const getAdminProfile = async () => {
    try {
      const res = await getRequest(AUTH.ADMIN_PROFILE);

      if (res?.status === 200) {
        const data = res?.data?.data;
        setAdminProfile(data);

        const imageUrl = data?.user_profile_url
          ? `${FILEURL}${data.user_profile_url}`
          : null;
        setPreviewImage(imageUrl);
      } else {
        toast.error("Failed to fetch profile");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching profile");
    }
  };

  useEffect(() => {
    getAdminProfile();
  }, []);

  const displayName = adminProfile?.username || user?.username || "Admin";
  const displayEmail = user?.email || "admin@yopmail.com";
  const displayImage = previewImage || user?.profile_picture || null;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        {displayImage ? (
          <span className="mr-2 overflow-hidden rounded-full h-11 w-11">
            <img
              src={displayImage}
              alt="User"
              className="h-full w-full object-cover"
            />
          </span>
        ) : (
          <span className="mr-2 overflow-hidden rounded-full h-11 w-11 flex items-center justify-center bg-gray-200">
            <i className="fa-solid fa-user fa-md text-gray-500" />
          </span>
        )}

        <span className="block mr-1 text-md truncate max-w-[120px]">
          {displayName}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] w-[260px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block text-md text-gray-700">{displayName}</span>
          <span className="mt-0.5 block text-sm text-gray-500 truncate">
            {displayEmail}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 dark:border-gray-800">
          <li>
            <Link
              onClick={closeDropdown}
              to={ROUTES.setting}
              className="flex items-center gap-3 px-3 py-2 text-md text-main hover:text-white rounded-lg group admin-header-dropdown"
            >
              <i className="fa-regular fa-gear" />
              Account settings
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-3 px-3 py-2 text-md text-main hover:text-white rounded-lg group admin-header-dropdown w-full"
            >
              <i className="fa-regular fa-right-from-bracket" />
              Log out
            </button>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}

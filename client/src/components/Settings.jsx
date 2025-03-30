import { useState } from "react";
import { useUser } from "../contexts/Context";
import { 
  Bell, 
  User, 
  Lock, 
  CreditCard, 
  Mail, 
  Moon, 
  LogOut, 
  Save,
  Trash2
} from "lucide-react";
import axios from "axios";
const Settings = () => {
  const { userId, userEmail, setUserId, setUserEmail, deleteAccount, logout } = useUser();
  
  // State for settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [changesSaved, setChangesSaved] = useState(false);
  const [isAlert, setIsAlert] = useState(false)
  const [alertMessage, setAlerMessage] = useState('')
  const [success, setSuccess] = useState(false)

  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, you'd save these to your backend
    console.log("Saving settings...");
    
    // Show success message
    setChangesSaved(true);
    setTimeout(() => setChangesSaved(false), 3000);
  };

  const handleChangePassword = async () => {
        if(confirmPassword !== newPassword){
            setIsAlert(true)
            setAlerMessage("Passwords do not match")
            return
        } else if(currentPassword.length === 0 || confirmPassword.length === 0 || newPassword.length === 0) {
            setIsAlert(true)
            setAlerMessage("Enter values in all fields")
            return
        }

        try{
            const response = await axios.put("https://localhost:5252/api/Auth/change-password", {
                email: userEmail,
                oldpassword: currentPassword,
                newpassword: newPassword
            }, {withCredentials: true})


            console.log(response)
            if (response.status === 200) {
                setIsAlert(false)
                setAlerMessage("")
                setSuccess(true)
                setCurrentPassword("")
                setConfirmPassword("")
                setNewPassword("")

            }

            else if (response.status === 401) {
                setIsAlert(true)
                setAlerMessage("Current password is not correct")
            }
        } catch(err){
            setIsAlert(true)
            setAlerMessage("Current password is not correct")
            console.log("ERROR CHANGING PASSWORDS: ", err)
        }
  }

  // Handle logout
  const handleLogout = () => {
    
    logout()
    // In a real app, you'd also make an API call to invalidate the session
    console.log("Logging out...");
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    deleteAccount()
    
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 p-4 sm:p-6 flex items-center justify-center">
  <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="md:flex">
          {/* Settings navigation */}
          <div className="w-full md:w-1/4 bg-blue-50 p-4">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Settings</h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center space-x-3 px-3 py-2 w-full rounded-md text-sm font-medium ${
                  activeTab === "profile" 
                    ? "bg-blue-100 text-blue-800" 
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
                }`}
              >
                <User size={18} />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab("account")}
                className={`flex items-center space-x-3 px-3 py-2 w-full rounded-md text-sm font-medium ${
                  activeTab === "account" 
                    ? "bg-blue-100 text-blue-800" 
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
                }`}
              >
                <Lock size={18} />
                <span>Account & Security</span>
              </button>
              
          
              
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center space-x-3 px-3 py-2 w-full rounded-md text-sm font-medium ${
                  activeTab === "notifications" 
                    ? "bg-blue-100 text-blue-800" 
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
                }`}
              >
                <Bell size={18} />
                <span>Notifications</span>
              </button>
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
          
          {/* Settings content */}
          <div className="w-full md:w-3/4 p-6">
            {/* Success message */}
            {changesSaved && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                Your changes have been saved successfully.
              </div>
            )}
            
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Settings</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userEmail || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-500"
                    />
                  
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {/* Account & Security Settings */}
            {activeTab === "account" && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Account & Security</h3>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Change Password</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end items-center gap-3">
                    {isAlert && (
                        <div className="text-red-500 text-bold pt-1">{alertMessage}</div>
                    )}
                    {success && (
                        <div className="bg-green-100 text-center w-1/2 flex justify-center items-center rounded-4xl text-bold h-[40px]">Password Successfully Changed!</div>
                    )}
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    Update Password
                  </button>
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Danger Zone</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Deleting your account will remove all of your data and cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
            
            
            
            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Notification Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Email Notifications</h4>
                      <p className="text-sm text-gray-500">
                        Receive budget alerts and monthly summaries via email.
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                        <div className={`block w-10 h-6 rounded-full ${emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${emailNotifications ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Push Notifications</h4>
                      <p className="text-sm text-gray-500">
                        Receive real-time updates on your device.
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={pushNotifications}
                          onChange={() => setPushNotifications(!pushNotifications)}
                        />
                        <div className={`block w-10 h-6 rounded-full ${pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${pushNotifications ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
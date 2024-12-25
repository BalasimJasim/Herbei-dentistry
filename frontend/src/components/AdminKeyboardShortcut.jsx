import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminKeyboardShortcut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let keys = "";
    let timer;

    const handleKeyPress = (e) => {
      // Clear the keys after 1 second of no input
      clearTimeout(timer);
      timer = setTimeout(() => {
        keys = "";
      }, 1000);

      // Add the key to the sequence
      keys += e.key.toLowerCase();

      // Check for the secret combination (e.g., "adminlogin")
      if (keys.includes("adminlogin")) {
        navigate("/admin/login");
        keys = "";
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(timer);
    };
  }, [navigate]);

  return null;
};

export default AdminKeyboardShortcut;

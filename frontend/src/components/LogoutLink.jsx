import { useNavigate } from "react-router-dom";

export default function LogoutLink({ className = "" }) {
  const navigate = useNavigate();

  const logout = async (event) => {
    event.preventDefault();

    try {
      await fetch("/logout", {
        credentials: "include",
        redirect: "follow"
      });
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/login");
    }
  };

  return (
    <a href="/logout" onClick={logout} className={className}>
      🚪 <span>Logout</span>
    </a>
  );
}

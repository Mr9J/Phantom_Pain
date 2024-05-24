import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Social = () => {
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  (async () => {
    const isLoggedIn = await checkAuthUser();
    if (!isLoggedIn) {
      navigate("/sign-in");
    }
  })();

  return <div>Social</div>;
};

export default Social;

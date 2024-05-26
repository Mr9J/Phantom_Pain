import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Social = () => {
  const { isAuthenticated, user } = useUserContext();
  const navigate = useNavigate();

  () => {
    !isAuthenticated && navigate("/login");
  };

  return (
    <div>
      Social
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>username</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Social;

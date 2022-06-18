import { useContext } from "react";
import { useHistory } from "react-router-dom";

import Context from "../../context";

function Header() {
  const { user, setUser } = useContext(Context);

  const history = useHistory();

  const logout = () => {
    const isLogout = window.confirm("Do you want to log out ?");
    if (isLogout) {
      localStorage.removeItem("auth");
      setUser(null);
      history.push("/login");
    }
  };

  return (
    <div className="header">
      <div className="header__left">
        <span>Uber Clone</span>
        {user && (
          <div className="header__right">
            <img src={user.image} alt={user.email} />
            <span>Hello, {user.fullname}</span>
          </div>
        )}
      </div>
      <span className="header__logout" onClick={logout}>
        <span>Logout</span>
      </span>
    </div>
  );
}

export default Header;

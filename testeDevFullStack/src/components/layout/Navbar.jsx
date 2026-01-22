import { Link } from "react-router-dom";
import "./Navbar.css"; // Opcional: para estilização
import { useAuth } from "../../contexts/AuthContext";



function Navbar() {
  const { signOut } = useAuth();
  function SignOut(e) {
    e.preventDefault();
signOut();
    window.location.href = "/";

  }
  return (
    <nav className="menu">
      <ul>
        <li>
          <Link to="/" onClick={(e) => { SignOut(e) }}>SignOut</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

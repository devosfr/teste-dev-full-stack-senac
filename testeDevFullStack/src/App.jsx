import Routes from "./routes/Routes";
import "./assets/styles/global.css";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/toast_custom.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <>

      <AuthProvider>
        <Routes />
      </AuthProvider>
      <ToastContainer autoClose={3000} position="top-right" />
    </>
  );
}

export default App;

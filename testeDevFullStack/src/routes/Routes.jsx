import { Routes as RoutesManager, Route } from "react-router-dom";
import Home from "../pages/Home";
import  Users from "../pages/Users";

function Routes() {
  return (
    <>
      <RoutesManager>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </RoutesManager>
    </>
  );
}

export default Routes;

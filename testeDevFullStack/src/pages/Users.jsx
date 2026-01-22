import { Button } from "../components/common/Button";
import Navbar from "../components/layout/Navbar";
import { useEffect, useState } from "react";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Form from "../components/common/Form";
import BoxUser from "../components/layout/BoxUser";
import Loader from "../components/common/Loader";
import api from "../services/api";
import "./Users.css";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";



function maskCPF(value) {
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return value.slice(0, 14); // Limit to 14 chars
}

function Users() {
  const numUsersPerPage = 3;
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate("/");
  }
  let [roles, setRoles] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({});
  const [formDataErrors, setFormDataErrors] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    loadUsers();
    loadRoles();
    if (selectedUserId) {
      loadUser();
    }
  }, [selectedUserId]);

  const handleUserUpdate = (userId) => {
    setSelectedUserId(userId);
  };

  const loadUser = async () => {
    setIsLoading(true);

    await api
      .get(`/users/${selectedUserId}`)
      .then((response) => {
        setFormData(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const loadRoles = async () => {

    setIsLoading(true);
    await api
      .get("/roles")
      .then((response) => {
        const _roles = response.data.map((role) => {
          return { value: role.id, label: role.name };
        });
        setRoles([..._roles]);
      })
      .catch((error) => {
        console.error("Erro ao buscar as roles:", error);
      });
  };
  const loadUsers = async () => {

    setIsLoading(true);
    await api
      .get("/users", {
        params: {
          currentPage: currentPage,
          perPage: 10,
        },
      })
      .then((response) => {
        setUsers([...users, ...response.data.data]);
        setCurrentPage(currentPage + 1);
        setTotalUsers(response.data.infos.total_users);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (totalUsers !== users.length) {
      fixCurrentPage();
    }
  }, [totalUsers]);

  const fixCurrentPage = () => {
    let maxNumPage = Math.ceil(totalUsers / numUsersPerPage);

    if (currentPage > maxNumPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const loadMore = () => {
    loadUsers();
  };

  const refreshUsers = async () => {
    setUsers([]);
    setCurrentPage(1);

    setIsLoading(true);
    await api
      .get("/users", {
        params: {
          currentPage: 1,
          perPage: 10,
        },
      })
      .then((response) => {

        setUsers(response.data.data);
        setCurrentPage(2);
        setTotalUsers(response.data.infos.total_users);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
        setIsLoading(false);
      });
  };

  const handleUpdate = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    setFormDataErrors({});

    await api
      .put(`/users/${selectedUserId}`, formData)
      .then((response) => {
        console.log(response);
        toast.success("Cadastro alterado com sucesso!");
        setFormData({});
        refreshUsers();
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.status === 422) {
          setFormDataErrors(error.response.data.errors);
        } else {
          toast.error(error.response.data);
        }

        setIsLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    setFormDataErrors({});
    formData.cpf = formData.cpf.replace(/\D/g, '');
    await api
      .post("/users", formData)
      .then(() => {

        toast.success("Cadastro realizado com sucesso!");

        refreshUsers();
        setFormData({});
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.status === 422) {
          const errorMessage = error.response.data.errors;
          if ("cpf" in errorMessage) {

            setFormDataErrors({
              cpf: [
                "O CPF informado já foi cadastrado.",],
            });
          }
          if ("email" in errorMessage) {

            setFormDataErrors({
              email: [
                "O campo email deve ter um formato de email valido",],
            });
          }
        } else {
          toast.error(error.response.data);
        }

        setIsLoading(false);
      });
  };

  return (
    <div>
      <Navbar />

      <div className="main">
        <div className="user-form">
          {selectedUserId ? (
            <>
              <h1>Alterar usuário</h1>
              <p>Altere os dados do usuário na aplicação.</p>
            </>
          ) : (
            <>
              <h1>Cadastrar novo usuário</h1>
              <p>Cadastre um novo usuário na aplicação.</p>
            </>
          )}
          <Form>
            <Input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Nome"
              validateErrors={formDataErrors?.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Input
              type="email"
              name="email"
              value={formData.email}
              placeholder="E-mail"
              validateErrors={formDataErrors?.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <Input
              type="text"
              name="cpf"
              value={formData.cpf}
              placeholder="CPF (123.456.789-01)"
              validateErrors={formDataErrors?.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: maskCPF(e.target.value) })
              }
            />

            <Input
              type="text"
              name="password"
              value={formData.password}
              placeholder="Senha"
              validateErrors={formDataErrors?.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Select
              name="role"
              value={formData.role}
              placeholder="Selecione um perfil"
              options={roles}
              validateErrors={formDataErrors?.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />


            {selectedUserId ? (
              <Button disableButton={!formData.name || !formData.email || !formData.cpf || !formData.password || !formData.role} onClick={(e) => handleUpdate(e)}>
                {isLoading ? "Alterando..." : "Alterar"}
              </Button>
            ) : (
              <Button disableButton={!formData.name || !formData.email || !formData.cpf || !formData.password || !formData.role} onClick={(e) => handleSubmit(e)}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            )}
          </Form>
        </div>

        <div className="feed_form">
          <h1>Listagem dos usuários</h1>
          <p>Listagem de todos usuários cadastrados na aplicação.</p>

          <h2 className="box_user_title">Tipo de usuário autenticado: {user?.roleId === '1' ? 'Administrador' : user?.roleId === '2' ? 'Moderador' : 'Leitor'}</h2>

          {users.length <= 0 ? (
            <>
              {isLoading ? (
                <Loader />
              ) : (
                <p>Ops! Nenhum usuário cadastrado até o momento!.</p>
              )}
            </>
          ) : (
            <>

              {users.map((user, index) => {
                return (
                  <BoxUser
                    key={index}
                    user={user}
                    users={users}
                    setUsers={setUsers}
                    totalUsers={totalUsers}
                    setTotalUsers={setTotalUsers}
                    onUpdate={handleUserUpdate}
                  />
                );
              })}

              {users.length < totalUsers && (
                <>
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <Button onClick={() => loadMore()}>Carregar mais</Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;

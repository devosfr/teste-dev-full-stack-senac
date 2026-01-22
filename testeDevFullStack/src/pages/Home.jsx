import { Button } from "../components/common/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Form from "../components/common/Form";
import api from "../services/api";
import "./Home.css";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";


function maskCPF(value) {
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return value.slice(0, 14); // Limit to 14 chars
}

function Home() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({});
  const [formDataErrors, setFormDataErrors] = useState({});


  useEffect(() => {
    setFormData({});
  }, []);

  const AccessAplication = async (e) => {
    e.preventDefault();
    setFormDataErrors({});

    const payload = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, '')
    };
    
    try {
      const response = await api.post("/users/login", payload);
      
      signIn(response.data.user);
      toast.success("Login realizado com sucesso!");
      setFormData({});
      navigate("/users");

    } catch (error) {
      if (error.response?.status === 422) {
        setFormDataErrors(error.response.data.errors);
      } else {
        toast.error("Erro ao realizar login");
      }
    } finally {
      setFormData({});
    }
  };


  return (
    <div className="home-container">
      <div className="login-card">
        <div className="card-header">
          <img src={logo} alt="Senac Learning" className="logo" />
        </div>

        <p className="login-title">FAÇA O SEU LOGIN</p>

        <div className="card-form">
          <Form>
            <div className="input-group">
              <Input
                label="CPF"
                type="text"
                placeholder="Digite seu CPF"
                name="cpf"
                maxLength={14}
                value={formData.cpf || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: maskCPF(e.target.value) })
                }
                error={formDataErrors.cpf}
              />
            </div>
            <div className="input-group">
              <PasswordInput
                name="password"
                value={formData.password || ""}
                placeholder="Digite sua senha"
                validateErrors={formDataErrors?.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="login-button" disableButton={!formData.cpf || !formData.password} onClick={(e) => { AccessAplication(e) }}>
              Acessar conta
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Home;

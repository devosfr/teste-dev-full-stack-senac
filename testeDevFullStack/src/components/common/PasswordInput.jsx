import { useState } from "react";
import "./PasswordInput.css";
import FieldError from "./FieldError";
import { BiShow, BiHide } from "react-icons/bi";

function PasswordInput({
  name,
  value,
  placeholder,
  validateErrors,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      {validateErrors?.map((errorMsg, index) => (
        <FieldError key={index}>{errorMsg}</FieldError>
      ))}

      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          name={name ?? ""}
          className={`${validateErrors?.length && "field_error"}`}
          value={value ?? ""}
          placeholder={placeholder ?? ""}
          onChange={onChange}
          autoComplete="off"
        />

        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? <BiHide /> : <BiShow />}
        </button>
      </div>
    </>
  );
}

export default PasswordInput;

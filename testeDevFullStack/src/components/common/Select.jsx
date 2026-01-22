import "./Input.css";
import FieldError from "./FieldError";

function Select({
  name,
  value,
  placeholder,
  options = [],
  validateErrors,
  onChange,
}) {
  return (
    <>
      {validateErrors?.map((errorMsg, index) => (
        <FieldError key={index}>{errorMsg}</FieldError>
      ))}

      <select
        name={name ?? ""}
        className={`${validateErrors?.length && "field_error"}`}
        value={value ?? ""}
        onChange={onChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Select;

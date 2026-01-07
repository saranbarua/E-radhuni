import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Input({
  label,
  required,
  type,
  placeholder,
  value,
  onChange,
  className,
  defaultValue,
  onInput,
  id,
  name,
  showPasswordToggle,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className={`w-full mb-4 ${className}`}>
      <label className="block font-medium mb-1">{label}</label>
      <div
        className={`relative w-full p-2 border border-primary focus-within:border-primary-light`}
      >
        <input
          id={id}
          name={name}
          required={required}
          type={inputType}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          onInput={onInput}
          className={`w-full h-full block outline-none bg-transparent pr-10`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <FontAwesomeIcon icon={faEye} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} size="lg" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

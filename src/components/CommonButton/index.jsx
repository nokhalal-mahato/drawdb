import "./styles.css";

const CommonButton = ({
  text,
  onClick,
  leftIcon,
  rightIcon,
  variant = "default",
  size = "medium",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`common-button ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="button-icon">{leftIcon}</span>}
      {text && <span className="button-text">{text}</span>}
      {rightIcon && <span className="button-icon">{rightIcon}</span>}
    </button>
  );
};

export default CommonButton;

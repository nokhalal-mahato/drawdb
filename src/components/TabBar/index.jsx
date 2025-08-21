import "./styles.css";

const TabBar = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  wrapperClassName = "",
  buttonClassName = "",
  activeButtonClassName = "",
}) => {
  return (
    <div className={`tab-bar-container ${className}`}>
      <div className={`tab-bar-wrapper ${wrapperClassName}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-button  ${buttonClassName} ${activeTab === tab.id ? `active ${activeButtonClassName}` : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;

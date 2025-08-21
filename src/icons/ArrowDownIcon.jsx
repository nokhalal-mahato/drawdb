import SVGUniqueID from "react-svg-unique-id";

export default function ArrowDownIcon(props) {
  const { width = 24, height = 24, stroke = "#475569" } = props;

  return (
    <SVGUniqueID>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 5V19M12 19L19 12M12 19L5 12"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SVGUniqueID>
  );
}

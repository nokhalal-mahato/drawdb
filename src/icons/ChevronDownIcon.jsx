import SVGUniqueID from "react-svg-unique-id";

export default function ChevronDownIcon(props) {
  const { width = 24, height = 24, stroke = "#334155" } = props;

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
          d="M6 9L12 15L18 9"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SVGUniqueID>
  );
}

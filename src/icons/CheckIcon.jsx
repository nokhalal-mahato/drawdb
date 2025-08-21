import SVGUniqueID from "react-svg-unique-id";

export default function CheckIcon(props) {
  const { width = 16, height = 11, stroke = "#22C55E" } = props;

  return (
    <SVGUniqueID>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 16 11"
        fill="none"
      >
        <path
          d="M14.6666 1L5.49992 10.1667L1.33325 6"
          stroke={stroke}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SVGUniqueID>
  );
}

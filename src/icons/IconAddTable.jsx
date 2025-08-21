import SVGUniqueID from "react-svg-unique-id";

export default function IconAddTable(props) {
  const { width = 26, height = 26, stroke = "currentColor" } = props;

  return (
    <SVGUniqueID>
      <svg height={height} width={width}>
        <path
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          d="M4 2 L20 2 A4 4 0 0 1 22 4 L22 14 M14 22 L4 22 A4 4 0 0 1 1 18 L1 4 A4 4 0 0 1 5 2 M22 17 L22 25 M18 21 L26 21 M1 8 L22 8"
        />
      </svg>
    </SVGUniqueID>
  );
}

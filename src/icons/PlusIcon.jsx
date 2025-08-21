import SVGUniqueID from "react-svg-unique-id";

export default function PlusIcon(props) {
  const { width = 20, height = 20, stroke = "white" } = props;

  return (
    <SVGUniqueID>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M9.99996 4.16406V15.8307M4.16663 9.9974H15.8333"
          stroke={stroke}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SVGUniqueID>
  );
}

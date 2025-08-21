import SVGUniqueID from "react-svg-unique-id";

export default function DataBaseIcon(props) {
  const { width = 20, height = 20, stroke = "white" } = props;

  return (
    <SVGUniqueID>
      <svg
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5 4.16406C17.5 5.54477 14.1421 6.66406 10 6.66406C5.85786 6.66406 2.5 5.54477 2.5 4.16406M17.5 4.16406C17.5 2.78335 14.1421 1.66406 10 1.66406C5.85786 1.66406 2.5 2.78335 2.5 4.16406M17.5 4.16406V15.8307C17.5 17.2141 14.1667 18.3307 10 18.3307C5.83333 18.3307 2.5 17.2141 2.5 15.8307V4.16406M17.5 9.9974C17.5 11.3807 14.1667 12.4974 10 12.4974C5.83333 12.4974 2.5 11.3807 2.5 9.9974"
          stroke={stroke}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SVGUniqueID>
  );
}

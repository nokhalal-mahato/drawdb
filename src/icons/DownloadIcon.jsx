import SVGUniqueID from "react-svg-unique-id";

export default function DownloadIcon(props) {
  return (
    <SVGUniqueID>
      <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
        <path
          stroke="#334155"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.362}
          d="M1 11v4h14v-4M8.002 1v10"
        />
        <path
          stroke="#334155"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.362}
          d="M3.8 7L8 11l4.2-4"
        />
      </svg>
    </SVGUniqueID>
  );
}

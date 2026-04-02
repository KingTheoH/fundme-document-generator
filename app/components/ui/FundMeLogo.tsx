"use client";

interface Props {
  size?: number;
  className?: string;
}

export default function FundMeLogo({ size = 28, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Heart-hands icon matching fundme.ph */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 27S4 19.5 4 11.5C4 8.4 6.4 6 9.5 6c1.9 0 3.6.9 4.7 2.3L16 10l1.8-1.7C18.9 6.9 20.6 6 22.5 6 25.6 6 28 8.4 28 11.5 28 19.5 16 27 16 27z"
          fill="#096651"
          opacity="0.2"
        />
        <path
          d="M16 27S4 19.5 4 11.5C4 8.4 6.4 6 9.5 6c1.9 0 3.6.9 4.7 2.3L16 10l1.8-1.7C18.9 6.9 20.6 6 22.5 6 25.6 6 28 8.4 28 11.5 28 19.5 16 27 16 27z"
          stroke="#096651"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Handshake inside heart */}
        <path
          d="M11 14c1-1 2.5-1 3.5 0l1.5 1.5 1.5-1.5c1-1 2.5-1 3.5 0"
          stroke="#096651"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13 16l3 3 3-3"
          stroke="#096651"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{ color: "#096651", fontWeight: 700, fontSize: size * 0.75, letterSpacing: "-0.01em" }}
      >
        FundMe
      </span>
    </span>
  );
}

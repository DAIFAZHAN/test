import React from "react";

function TaskIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g>
          <g transform="translate(1 1)">
            <rect
              width="14"
              height="14"
              x="0"
              y="0"
              fill="#4BADE8"
              rx="2"
            ></rect>
            <g
              stroke="#FFF"
              strokeLinecap="round"
              strokeWidth="2"
              transform="translate(4 4.5)"
            >
              <path d="M2 5l4-5"></path>
              <path d="M2 5L0 3"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default TaskIcon;

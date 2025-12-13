import * as S from "./DateHeaderStyled";
import { useNavigate } from "react-router-dom";

interface DateHeaderProps {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DateHeader({ setActive }: DateHeaderProps) {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.Header>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          onClick={() => navigate("/archive")}
          style={{ cursor: "pointer" }}
        >
          <path
            d="M23 11.648V18.3743C23 18.884 22.7659 19.3728 22.3491 19.7332C21.9324 20.0936 21.3671 20.2961 20.7778 20.2961H5.22222C4.63285 20.2961 4.06762 20.0936 3.65087 19.7332C3.23413 19.3728 3 18.884 3 18.3743V11.648H23ZM17.4444 3C17.7391 3 18.0217 3.10124 18.2301 3.28144C18.4385 3.46164 18.5556 3.70605 18.5556 3.96089V4.92178H20.7778C21.3671 4.92178 21.9324 5.12426 22.3491 5.48466C22.7659 5.84506 23 6.33388 23 6.84357V9.72624H3V6.84357C3 6.33388 3.23413 5.84506 3.65087 5.48466C4.06762 5.12426 4.63285 4.92178 5.22222 4.92178H7.44444V3.96089C7.44444 3.70605 7.56151 3.46164 7.76988 3.28144C7.97826 3.10124 8.26087 3 8.55556 3C8.85024 3 9.13286 3.10124 9.34123 3.28144C9.5496 3.46164 9.66667 3.70605 9.66667 3.96089V4.92178H16.3333V3.96089C16.3333 3.70605 16.4504 3.46164 16.6588 3.28144C16.8671 3.10124 17.1498 3 17.4444 3Z"
            fill="white"
          />
        </svg>
        <S.IconBox>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            onClick={() => navigate("/notification")}
            style={{ cursor: "pointer" }}
          >
            <path
              d="M8.26727 20C8.44281 20.304 8.69529 20.5565 8.99931 20.732C9.30334 20.9075 9.64821 20.9999 9.99927 20.9999C10.3503 20.9999 10.6952 20.9075 10.9992 20.732C11.3033 20.5565 11.5557 20.304 11.7313 20M1.26127 14.326C1.13063 14.4692 1.04442 14.6472 1.01312 14.8385C0.981826 15.0298 1.00679 15.226 1.08498 15.4034C1.16316 15.5807 1.2912 15.7316 1.45352 15.8375C1.61585 15.9434 1.80545 15.9999 1.99927 16H17.9993C18.1931 16.0001 18.3827 15.9438 18.5451 15.8381C18.7076 15.7324 18.8358 15.5817 18.9142 15.4045C18.9926 15.2273 19.0178 15.0311 18.9867 14.8398C18.9557 14.6485 18.8697 14.4703 18.7393 14.327C17.4093 12.956 15.9993 11.499 15.9993 7C15.9993 5.4087 15.3671 3.88258 14.2419 2.75736C13.1167 1.63214 11.5906 1 9.99927 1C8.40797 1 6.88185 1.63214 5.75663 2.75736C4.63141 3.88258 3.99927 5.4087 3.99927 7C3.99927 11.499 2.58827 12.956 1.26127 14.326Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            onClick={() => setActive((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <path
              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.IconBox>
      </S.Header>
    </S.Container>
  );
}

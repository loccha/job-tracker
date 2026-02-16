import { useEffect } from "react";

type UseClickOutsideProps = {
  ref: React.RefObject<HTMLElement | null>;
  onOutsideClick: () => void;
};

const useClickOutside = ({ ref, onOutsideClick }: UseClickOutsideProps) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, onOutsideClick]);
};

export default useClickOutside;

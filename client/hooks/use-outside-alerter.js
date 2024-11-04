import { useEffect, useRef } from "react";

// Custom hook which detects mouse clicks outside a component (used to implement modal closing)
// Credit: https://stackoverflow.com/a/45323523
export default ({ handleEvent }) => {
    const ref = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handleEvent();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    return ref;
}
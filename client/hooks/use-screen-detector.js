import { useState, useEffect } from 'react';

// Custom hook which continuously determines whether the current viewport size exceeds the given breakpoint
// Credit: https://stackoverflow.com/a/68508502
export default ({ breakpoint }) => {
    // Default Tailwind breakpoints
    const BREAKPOINTS = {
        "sm": 640,
        "md": 768,
        "lg": 1024,
        "xl": 1280,
        "2xl": 1536
    }

    const [isOver, setIsOver] = useState(false);

    useEffect(() => {
        if (window.innerWidth > BREAKPOINTS[breakpoint]) {
            setIsOver(true);
        } else {
            setIsOver(false);
        }

        const updateMedia = () => {
            if (window.innerWidth > BREAKPOINTS[breakpoint]) {
                setIsOver(true);
            } else {
                setIsOver(false);
            }
        };
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    }, []);

    return isOver;
}
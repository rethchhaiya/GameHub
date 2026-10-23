import { useEffect } from "react";
import { useLocation } from "react-router-dom"

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scroll({ top: 0, left: 0, behavior: "instant"});
    }, [pathname]);

    return null;
}

export default ScrollToTop

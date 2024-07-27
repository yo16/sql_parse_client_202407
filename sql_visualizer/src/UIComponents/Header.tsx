
import { HeaderMenu } from "./HeaderMenu";

import "./Header.css";

function Header() {
    return (
        <div className="header-container">
            <div>
                <h1 className="header-title">SQL Viewer</h1>
            </div>
            <div>
                <HeaderMenu />
            </div>
        </div>
    );
}

export { Header };

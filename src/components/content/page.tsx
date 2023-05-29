import { h } from 'preact'

import Navigation from "../navigation";
import Characters from "./pages/characters"
import Battle from "./pages/battle"

type Props = {
    page: string;
}
export default function Page( {page}: Props ) {
    // not needed, just curiosity to ignore Props
    let content: h.JSX.Element;

    return (
        <div class="oj-web-applayout-content-nopad oj-web-applayout-content">
            {page === "battle" && <Battle/>}
            {page === "characters" && <Characters />}
        </div>
    )
};
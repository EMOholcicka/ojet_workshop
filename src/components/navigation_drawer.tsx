// Modules
import { useState, useCallback } from "preact/hooks"
import { whenDocumentReady } from 'ojs/ojbootstrap';
import * as ko from 'knockout';
import 'ojs/ojknockout';
import 'ojs/ojdrawerpopup';
import 'ojs/ojbutton'; // Controls
import 'ojs/ojnavigationlist'; // Start drawer
import 'ojs/ojformlayout';
import 'ojs/ojinputtext';

import Navigation from "./navigation";

type Props = {
    opened: boolean;
    page: string;
}

export default function NavigationDrawer({ opened, page }: Props) {
    const [DrawerOpened, setDrawerOpened] = useState<boolean>(false);

    const handleHamburgerClicked = useCallback(() => setDrawerOpened(!DrawerOpened), []);

    return (
        <div>
            <oj-drawer-popup opened={DrawerOpened} onopenedChanged={(event) => !event.detail.value && setDrawerOpened(false)}>
                <div className="demo-drawer-header">
                    <div>
                        <h6>Welcome</h6>
                    </div>

                    <oj-button
                        display="icons"
                        chroming="outlined"
                        onojAction={() => setDrawerOpened(false)}>
                        <span slot="startIcon" className="oj-ux-ico-close"></span>
                        Close
                    </oj-button>
                </div>
                <Navigation edge={"start"} page={page}/>
            </oj-drawer-popup>
        </div>

    )
}
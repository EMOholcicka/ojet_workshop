import { useState, useCallback } from "preact/hooks"

import Header from "./header";
import ContentLayout from "./content/content-layout";

import { WorkshopPropsType } from "./app-types"


export default function Workshop({ appName, appSubName, loggerUser, page }: WorkshopPropsType) {
    const [DrawerOpened, setDrawerOpened] = useState<boolean>(false);

    const handleDrawerClosed = useCallback(() => {
        if (DrawerOpened) {
            setDrawerOpened(false);
        }
    }, [DrawerOpened])

    const handleHamburgerClicked = useCallback(() => setDrawerOpened(!DrawerOpened), []);

    return (
        <div id="appContainer" className="oj-web-applayout-page">
            <Header appName={appName}
                    appSubName={appSubName}
                    loggerUser={loggerUser}
                    page={page}
                    onHamburgerclicked={handleHamburgerClicked}/>
            <ContentLayout DrawerOpened={DrawerOpened}
                           onDraverClosed={handleDrawerClosed}
                           page={page}/>

        </div>
    )
}
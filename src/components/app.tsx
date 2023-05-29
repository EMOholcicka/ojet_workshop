import { createContext } from "preact"
import {registerCustomElement} from "ojs/ojvcomponent";
import {useState, useEffect, useMemo } from "preact/hooks";

import Context = require("ojs/ojcontext");
import CoreRouter = require("ojs/ojcorerouter");
import UrlParamAdapter = require("ojs/ojurlparamadapter");

import Workshop from "./workshop";

import {RouteType} from "./app-types";

// TODO make enum

export const ROUTES: RouteType[] = [
    {path: "", redirect: "characters"},
    {path: "characters", detail: {label: "Characters", icon: "oj-ux-ico-android"}},
    {path: "battle", detail: {label: "Battle", icon: "oj-ux-ico-crosshair"}},
];


type Props = {
    appName?: string;
    appSubName?: string;
}

export const RouterContext = createContext<CoreRouter<CoreRouter.DetailedRouteConfig> | null>(null);

export const App = registerCustomElement(
    "app-root",
    ({appName = "Workshop website", appSubName = "SubApp"}: Props) => {
        const [loggerUser, setLoggedUser] = useState<string>("");
        const [page, setPage] = useState<string>(ROUTES.filter(item => item.path == "")[0].redirect as string)

        useEffect
        (() => {
            Context.getPageContext().getBusyContext().applicationBootstrapComplete();

            setTimeout(() => setLoggedUser("Workshop User"), 1000);
        }, []);

        const router = useMemo(() => new CoreRouter<CoreRouter.DetailedRouteConfig>(ROUTES,
            {urlAdapter: new UrlParamAdapter()}), []);

        // synch router state
        useEffect
        (() => {
            router.sync();
            router.currentState.subscribe((actionable) => {
                if (actionable.state) {
                    setPage(actionable.state.path);
                }
            })
        }, []);

        return (
            <RouterContext.Provider value={router}>
                <div>
                    {loggerUser ? <Workshop appName={appName} appSubName={appSubName} loggerUser={loggerUser} page={page}/> :
                        <h1>application is loading</h1>}
                </div>
            </RouterContext.Provider>
        );
    }
);

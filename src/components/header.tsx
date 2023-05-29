import { useCallback } from "preact/hooks"

import "ojs/ojtoolbar";
import "ojs/ojmenu";
import "ojs/ojbutton";

import { WorkshopPropsType } from "./app-types"
import Navigation from "./navigation";
import NavigationDrawer from "./navigation_drawer"

type Props = WorkshopPropsType & {
  onHamburgerclicked: () => void;
}

export default function Header({ appName, appSubName, loggerUser, page , onHamburgerclicked}: Props) {

  return (
    <header role="banner" class="oj-web-applayout-header">
      <div class="oj-flex-bar oj-sm-align-items-center">
        <div class="oj-flex-bar-start">
          <oj-button display="icons" chroming="borderless" onojAction={onHamburgerclicked}>
            <span
                slot="startIcon" class="oj-ux-ico-menu"></span>
          </oj-button>
        </div>
        <div class="oj-flex-bar-middle oj-sm-align-items-baseline">
          <h1
            class="oj-sm-only-hide oj-web-applayout-header-title"
            title={`${appName} ${appSubName}`}>
            <strong>{appName}</strong> {appSubName}
          </h1>
        </div>
        <div class="oj-flex-bar-end">
        <oj-toolbar>
          <oj-menu-button id="userMenu" chroming="borderless">
            <span slot="startIcon" class="oj-ux-ico-user-configuration" />
            <span>{loggerUser}</span>
            <span slot="endIcon" class="oj-component-icon oj-button-menu-dropdown-icon"></span>
            <oj-menu slot="menu" >
              <oj-option value="out" onClick={() => console.log("Sign out user")}>Sign Out
              <span slot="startIcon" class="oj-ux-ico-door" />
              </oj-option>
            </oj-menu>
          </oj-menu-button>
        </oj-toolbar>
        </div>
      </div>

      <div class="oj-sm-only-hide">
        <Navigation edge="top" page={page}/>
      </div>


    </header>
  );  
}

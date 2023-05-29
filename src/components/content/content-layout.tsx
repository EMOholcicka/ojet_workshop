import 'ojs/ojknockout';
import 'ojs/ojdrawerpopup';
import 'ojs/ojbutton'; // Controls
import 'ojs/ojnavigationlist'; // Start drawer
import 'ojs/ojformlayout';
import 'ojs/ojinputtext';

import Navigation from "../navigation";
import Page from "./page";

type Props = {
  DrawerOpened: boolean;
  onDraverClosed: () => void;
  page: string;
}
export default function ContentLayout( {DrawerOpened, onDraverClosed, page}: Props ) {
  return (
    <div>
      <Page page={page}/>

      <div>
        <oj-drawer-popup opened={DrawerOpened} onopenedChanged={(event) => !event.detail.value && onDraverClosed()}>
          <div className="demo-drawer-header">
            <div>
              <h6>Welcome</h6>
            </div>

            <oj-button
                display="icons"
                chroming="outlined"
                onojAction={() => onDraverClosed()}>
              <span slot="startIcon" className="oj-ux-ico-close"></span>
              Close
            </oj-button>
          </div>
          <Navigation edge={"start"} page={page}/>
        </oj-drawer-popup>
      </div>
    </div>
  );
};

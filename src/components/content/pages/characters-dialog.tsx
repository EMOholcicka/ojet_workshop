import { useRef , useEffect, useState } from "preact/hooks";
import { ojDialog } from "ojs/ojdialog"
import "ojs/ojdialog";
import "ojs/ojradioset";
import "ojs/ojswitch";

import {CharacterType} from "./character-types";

type Props = {
    isOpened: boolean | undefined;
    dialogData?: CharacterType;
    closeDialog: (ref:any,type:string) => void;
};

export default function RouteDialog(props: Props) {
    const dialogRef = useRef<ojDialog>(null);

    useEffect(() => {
        props.isOpened? dialogRef.current?.open(): dialogRef.current?.close();
    }, [props.isOpened]);

    const closeDialog = () => {
        props.closeDialog(dialogRef, 'close')
    }

    return (
        <div>
            <oj-dialog ref={dialogRef}
                       dialogTitle={props.dialogData?.Name}
                       cancelBehavior="icon"
                       onojClose={closeDialog}>
                <div>
                <oj-form-layout direction="row" max-columns="2">
                    <oj-input-text label-hint="Name" readonly={true} value={props.dialogData?.Name}/>
                    <oj-input-text label-hint="Homeworld" autocomplete="off" value={props.dialogData?.Homeworld}/>
                    <oj-input-text label-hint="Born" value={props.dialogData?.Born}/>

                    <oj-radioset label-hint="Gender" value={props.dialogData?.Gender}>
                        <oj-option value="male">Male</oj-option>
                        <oj-option value="female">Female</oj-option>
                        <oj-option value="n/a">None</oj-option>
                    </oj-radioset>

                    <oj-switch label-hint="Is Jedi?" value={props.dialogData?.IsJedi}/>
                    <oj-input-text label-hint="Greeting" value={props.dialogData?.Greeting}/>

                </oj-form-layout>
                </div>

                <div slot="footer">
                    <oj-button id="okButton" onojAction={closeDialog}>OK</oj-button>
                </div>


            </oj-dialog>
        </div>
    )
}

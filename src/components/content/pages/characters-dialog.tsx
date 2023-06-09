import { useRef , useEffect, useState } from "preact/hooks";
import { ojDialog } from "ojs/ojdialog"
import "ojs/ojdialog";
import "ojs/ojradioset";
import "ojs/ojswitch";

import {CharacterType} from "./character-types";

type Props = {
    isOpened: boolean | undefined;
    isEdit: boolean;
    dialogData?: CharacterType;
    closeDialog: (ref:any,type:string) => void;
    closeEdit: (ref:any,type:string) => void;
};

export default function RouteDialog(props: Props) {
    const dialogRef = useRef<ojDialog>(null);

    useEffect(() => {
        props.isOpened? dialogRef.current?.open(): dialogRef.current?.close();
    }, [props.isOpened]);

    const closeDialog = () => {
        props.closeDialog(dialogRef, 'close')
        props.closeEdit(dialogRef, 'close')
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
                    <oj-input-text label-hint="Homeworld" readonly={!props.isEdit} autocomplete="off" value={props.dialogData?.Homeworld}/>
                    <oj-input-text label-hint="Born" readonly={!props.isEdit} value={props.dialogData?.Born}/>

                    <oj-radioset label-hint="Gender" readonly={!props.isEdit} value={props.dialogData?.Gender}>
                        <oj-option value="male">Male</oj-option>
                        <oj-option value="female">Female</oj-option>
                        <oj-option value="n/a">None</oj-option>
                    </oj-radioset>

                    {!props.isEdit ?
                        <oj-input-text label-hint="Is Jedi?" readonly={true} value={props.dialogData?.IsJedi}/> :
                        <oj-switch label-hint="Is Jedi?" readonly={!props.isEdit} value={props.dialogData?.IsJedi}/>}

                    <oj-input-text label-hint="Greeting" readonly={!props.isEdit} value={props.dialogData?.Greeting}/>


                </oj-form-layout>
                </div>

                <div slot="footer">
                    <oj-button id="okButton" onojAction={closeDialog}>OK</oj-button>
                    {props.isEdit && <oj-button id="okButton" chroming="callToAction" onojAction={closeDialog}>Edit</oj-button>}
                </div>


            </oj-dialog>
        </div>
    )
}

import { useState } from "preact/hooks";
import { ComponentProps } from "preact";
import ArrayDataProvider= require("ojs/ojarraydataprovider");
import { RESTDataProvider } from 'ojs/ojrestdataprovider';
import "ojs/ojinputtext";
import RouteDialog from "./characters-dialog";


type OnoffRecord = {
    db_host: string;
    db_sid: string;
    db_cdb: string;
}

type TableProps = ComponentProps<"oj-table">;

let INIT_DATAPROVIDER = new RESTDataProvider<OnoffRecord["db_host"], OnoffRecord>({
    keyAttributes: "id",
    url: "",
    transforms: {},
});


export default function Battle() {

    const setColumnsDefault: TableProps["columnsDefault"] = { sortable: "disabled", maxWidth: '90%'};
    const API_ENDPOINT: Readonly<string> = 'http://localhost:3333/onoff';
    const keyAttributes: string = "Name";
    const columnsDef: TableProps["columns"] = [
        { headerText: "DB hostname", field: "dbhost", headerClassName: "oj-sm-only-hide", className: "oj-sm-only-hide", resizable: "enabled", sortable: "enabled"},
        { headerText: "Container Database", field: "cdb", resizable: "enabled", template: "deptNameTemplate" , sortable: "enabled" },
        { headerText: "Nkeys", field: "pdbs", headerClassName: "oj-sm-only-hide", className: "oj-sm-only-hide", resizable: "enabled" },
    ];
    const [formData, setFormData] = useState<Partial<OnoffRecord>>({});

    // TODO disable buttons when selecting ALL hosts
    const [isFormLocked, setFormLocked] = useState<boolean>(false);

    const [tableDataProvider, settableDataProvider] = useState<RESTDataProvider<OnoffRecord["db_host"], OnoffRecord>>(INIT_DATAPROVIDER)

    const fetchItems = () => {
        settableDataProvider(new RESTDataProvider<OnoffRecord["db_host"], OnoffRecord>({
            keyAttributes: keyAttributes,
            url: API_ENDPOINT,
            transforms: {
                fetchFirst: {
                    request: async (options) => {
                        const url = new URL(options.url);
                        formData.db_host && url.searchParams.set('dbhost', String(formData.db_host))
                        formData.db_cdb && url.searchParams.set('cdb', String(formData.db_cdb))
                        formData.db_sid && url.searchParams.set('pdbs', String(formData.db_sid))
                        return new Request(url.href);
                    },

                    response: async ({ body }) => {
                        const { data } = body;
                        return { data: data };
                    },
                },
            },
        }))
    }

    const onValueChangeHandler = (event: {currentTarget: any, detail: any}) => {
        setFormData({
            ...formData,
            [event.currentTarget.id]: event.detail.value
        })
    }



    return (
        <div class="oj-form-control-max-width-md">
            <oj-form-layout
                id="formLayoutOptions"
                max-columns="4"
                direction="row"
                user-assistance-density="compact">
                <oj-input-text
                    id="db_host"
                    onvalueChanged={onValueChangeHandler}
                    disabled={isFormLocked}
                    label-hint="DB hostname (leave empty for all)">
                </oj-input-text>

                <oj-input-text
                    id="db_cdb"
                    disabled={isFormLocked}
                    onvalueChanged={onValueChangeHandler}
                    label-hint="Container Database (CDB)">
                </oj-input-text>

                <oj-input-text
                    id="db_pdbs"
                    disabled={isFormLocked}
                    onvalueChanged={onValueChangeHandler}
                    label-hint="Portable Databse (PDB)">
                </oj-input-text>

                <oj-form-layout
                    id="formLayoutOptions"
                    columns={5}
                    direction="row"
                    user-assistance-density="efficient">
                    <oj-button id="submitBtn" onojAction={fetchItems}>
                        Submit
                    </oj-button>

                    <oj-button id="submitBtn">
                        Clear
                    </oj-button>
                </oj-form-layout>

            </oj-form-layout>


                    <div className="oj-flex">
                        <div className="oj-flex-item oj-sm-padding-22x-horizontal">
                            <oj-table
                                id="table"
                                aria-label="Character"
                                data={tableDataProvider}
                                columnsDefault={setColumnsDefault}
                                columns={columnsDef}
                                scrollPolicy="loadMoreOnScroll"
                                display='grid'
                            />
                        </div>
                    </div>
            </div>
    )
};
import { useCallback, useState } from "preact/hooks";
import { ComponentProps } from "preact";
import 'ojs/ojtable';

import { ojTable } from 'ojs/ojtable';
import {CharacterType, RouteType} from '../../app-types';
import { RESTDataProvider } from 'ojs/ojrestdataprovider';
type TableProps = ComponentProps<"oj-table">;
const setSelectionMode: TableProps["selectionMode"] = {
    row: "single",
    column: "single"
};
const setColumnsDefault: TableProps["columnsDefault"] = { sortable: "disabled" };
const API_ENDPOINT: Readonly<string> = 'http://localhost:3333/star-wars';
const keyAttributes: string = "Name";


const CharacterDataProvider = new RESTDataProvider<CharacterType["Name"], CharacterType>({
    keyAttributes: keyAttributes,
    url: API_ENDPOINT,
    transforms: {
        fetchFirst: {
            request: async (options) => {
                const url = new URL(options.url);
                const { size, offset } = options.fetchParameters;
                url.searchParams.set("limit", String(size));
                url.searchParams.set("offset", String(offset));
                return new Request(url.href);
            },
            response: async ({ body }) => {
                const { data, totalSize, hasMore } = body;
                return { data: data, totalSize, hasMore };
            },
        },
    },
});

const setScrollPolicy: TableProps["scrollPolicyOptions"] = {
    fetchSize: 10,
    maxCount: 20
};


const columnsDef: TableProps["columns"] = [
    { headerText: "Name", field: "Name", headerClassName: "oj-sm-only-hide", className: "oj-sm-only-hide", resizable: "enabled", sortable: "enabled"},
    { headerText: "Homeworld", field: "Homeworld", resizable: "enabled", template: "deptNameTemplate" , sortable: "enabled" },
    { headerText: "Born", field: "Born", headerClassName: "oj-sm-only-hide", className: "oj-sm-only-hide", resizable: "enabled" },
    { headerText: "Jedi", field: "Jedi", resizable: "enabled" },
    { headerText: "Created", field: "Created", resizable: "disabled", template: "actionTemplate" },
];

const sideLogos = {
    jedi: 'https://logos-world.net/wp-content/uploads/2022/07/Jedi-Logo.png',
    neutral: 'https://logos-world.net/wp-content/uploads/2020/11/Star-Wars-Logo.png',
    rebel: 'https://logos-world.net/wp-content/uploads/2022/02/Star-Wars-Rebel-Logo.png'
}

export default function Characters() {
    const [orderImage, setorderImage] = useState<string>(sideLogos['neutral']);

    const handleAlertChanged = useCallback((event: ojTable.firstSelectedRowChanged<CharacterType["Name"], CharacterType>) => {
        if (event.detail.value.data.Jedi === 'yes') {
            setorderImage(sideLogos['jedi'])
        } else {
            setorderImage(sideLogos['rebel'])
        }

    }, []);

    return (<div class="oj-flex oj-sm-flex-items-initial oj-sm-justify-content-center">
            <div>
                <div className="oj-flex oj-sm-flex-items-initial oj-sm-justify-content-center" style="width: 1px; min-width: 100%;">
                    <div className="oj-sm-padding-2x-horizontal">
                        <img
                            src={orderImage}
                            alt="bulleted list image"
                            width="400"
                            height="400" />
                    </div>
            </div>

                    <div class="oj-flex">
                        <div className="oj-flex-item oj-sm-padding-2x-horizontal">
                            <oj-table
                                id="table"
                                aria-label="Character"
                                data={CharacterDataProvider}
                                columnsDefault={setColumnsDefault}
                                columns={columnsDef}
                                scrollPolicy="loadMoreOnScroll"
                                scrollPolicyOptions={setScrollPolicy}
                                selectionMode={setSelectionMode}
                                onfirstSelectedRowChanged={handleAlertChanged}
                            />
                        </div>
                    </div>
                </div>
        </div>
    )
};
import { ComponentProps } from "preact";
import { useMemo, useCallback, useState } from "preact/hooks";

import { ojTable } from "ojs/ojtable";
import { ojButton } from "ojs/ojbutton";

import "ojs/ojtable";
import "ojs/ojbutton";
import "ojs/ojdialog";

import { CharacterAPIType, CharacterType } from "./character-types"

import { RESTDataProvider } from "ojs/ojrestdataprovider";
import RouteDialog from "./characters-dialog";


type TableProps = ComponentProps<"oj-table">;

const setColumnsDefault: TableProps["columnsDefault"] = { sortable: "disabled" };
const setSelectionMode: TableProps["selectionMode"] = { row: "single", column: "none" };
const setScrollPolicy: TableProps["scrollPolicyOptions"] = { fetchSize: 10, maxCount: 500 };

const columns: TableProps["columns"] = [
    { headerText: "Greeting", field: "Greeting" },
    { headerText: "Name", field: "Name" },
    { headerText: "Gender", template: "genderTemplate" },
    { headerText: "Homeworld", field: "Homeworld" },
    { headerText: "Born", field: "Born" },
    { headerText: "Is jedi?", field: "Jedi" },
    { headerText: "Created", field: "Created", renderer: (cell) => {
            return {
                insert: cell.row.Created.toLocaleDateString()
            };
        } },
    { headerText: "", template: "actionTemplate" }
];



const API_ENDPOINT: Readonly<string> = "http://localhost:3333/star-wars";

export default function Characters() {
    const [dialogOpened, setDialogOpened] = useState<boolean>();
    const [dialogData, setDialogData] = useState<CharacterType>();

    const loadCharacter = useCallback((character: CharacterAPIType): CharacterType => {
        return {
            ...character,
            ...{ Created: new Date(character.Created),
                 IsJedi: character.Jedi === "yes",
                 Greeting: character.Jedi === "yes" ? "May the force be with you..." : "Hi!"
            }
        } as CharacterType;
    }, []);

    const restDataProvider: RESTDataProvider<CharacterAPIType["Name"], CharacterAPIType> = useMemo(() => new RESTDataProvider({
        keyAttributes: "Name",
        url: API_ENDPOINT,
        transforms: {
            fetchFirst: {
                request: async (options) =>  {
                    const url = new URL(options.url);

                    const { size, offset } = options.fetchParameters;
                    url.searchParams.set("limit", String(size));
                    url.searchParams.set("offset", String(offset));

                    return new Request(url.href);
                },
                response: async ({ body }) => {
                    const { totalSize, hasMore, data } = body;
                    return {
                        data: data.map((row: CharacterAPIType) => loadCharacter(row)),
                        totalSize,
                        hasMore
                    };
                }
            }
        }
    }), []);

    const renderGenderColumn = useCallback((cell: ojTable.CellTemplateContext<CharacterType["Name"], CharacterType>) =>
            cell.row.Gender === "female" ? <span className="oj-ux-ico-female" /> : <span className="oj-ux-ico-male" />,
        []);

    const handleCharacterDelete = useCallback((name: string) => {
        if (confirm("Oooooh! Looks like the Force wasn't with you on this one!")) {
            (async () => {
                const request = new Request(API_ENDPOINT + '/' + name, {
                    headers: new Headers({
                        "Content-type": "application/json; charset=UTF-8"
                    }),
                    method: "DELETE"
                });

                const response: CharacterAPIType = await (await fetch(request)).json();

                restDataProvider.mutate({
                    remove: {
                        data: [loadCharacter(response)],
                        keys: new Set([response.Name]),
                        metadata: [{key: response.Name}]
                    }
                });
            })();
        }
    }, []);

    const renderActionColumn = useCallback((cell: ojTable.CellTemplateContext<CharacterType["Name"], CharacterType>) => {
        const handleEdit = (event: ojButton.ojAction) => {
            event.detail.originalEvent.stopPropagation();
            console.log('edit', cell.row);
        };

        const handleDelete = (event: ojButton.ojAction) => {
            event.detail.originalEvent.stopPropagation();
            handleCharacterDelete(cell.row.Name);
        };

        return [
            <oj-button class="oj-button-sm" onojAction={handleEdit} display="icons">
                <span slot="startIcon" className="oj-ux-ico-edit"></span> Edit
            </oj-button>,

            <oj-button class="oj-button-sm" onojAction={handleDelete} display="icons">
                <span slot="startIcon" className="oj-ux-ico-delete-all"></span> Delete
            </oj-button>
        ];
    }, []);

    const handleDialogClose = (ref: any, type: any) => {
        type === "create" ? setDialogOpened(false) : setDialogOpened(false);
        ref.current.close();
    };

    const handleRouteSelect = useCallback((event: ojTable.firstSelectedRowChanged<CharacterType["Name"], CharacterType>) => {
        setDialogOpened(true)
        setDialogData(event.detail.value.data)
    }, []);

    return (
        <div className="demo-flex-display">

            <div className="oj-flex oj-sm-flex-items-1">
                <div className="oj-flex-bar-middle oj-sm-justify-content-center">DIV with picture here</div>
            </div>


            <div className="oj-flex oj-sm-flex-items-1">
                <oj-table
                    aria-label="Alerts"
                    data={restDataProvider}
                    columnsDefault={setColumnsDefault}
                    selectionMode={setSelectionMode}
                    scrollPolicy="loadMoreOnScroll"
                    scrollPolicyOptions={setScrollPolicy}
                    columns={columns}
                    onfirstSelectedRowChanged={handleRouteSelect}
                    class="oj-bg-body table-sizing oj-flex-item full-height">
                    <template slot="genderTemplate" render={renderGenderColumn}/>
                    <template slot="actionTemplate" render={renderActionColumn}/>
                </oj-table>
            </div>

            <div>
                <RouteDialog isOpened={dialogOpened} dialogData={dialogData} closeDialog={handleDialogClose}/>
            </div>

        </div>
    );
}

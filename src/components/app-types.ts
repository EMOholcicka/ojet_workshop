export type WorkshopPropsType = {
    appName: string;
    appSubName: string;
    loggerUser: string;
    page: string;
};

type RouteDescription = {
    label: string;
    icon: string;
}

export type RouteType = {
    path: string;
    detail?: RouteDescription;
    redirect?: string;
}

export type CharacterType = {
    "Name": string,
    "Gender": string,
    "Homeworld": string,
    "Born": string,
    "Jedi": string,
    "Created": string;
}
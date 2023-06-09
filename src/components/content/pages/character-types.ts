export type CharacterAPIType = {
    Name: string;
    Gender: string;
    Homeworld: string;
    Born: string;
    Jedi: string | boolean;
    Created: string;
};

export type CharacterType = CharacterAPIType & {
    Created: Date;
    Greeting: string;
    Permissions?: string[];
    IsJedi: boolean;
};

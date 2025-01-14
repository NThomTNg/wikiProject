export interface Character {
    CharacterID: number;
    Name: string;
    Title?: string;
    Biography?: string;
    BirthDate?: string;
    DeathDate?: string;
    NationID?: number;
    ReligionID?: number;
    ImageURL?: string;
  }

export interface Nations {
    NationID: number;
    Name: string;
    Government?: string;
    CapitalLocationID?: number;
    Description?: string;
    FoundingDate?: string;
    MajorReligionID?: number;
    Culture?: string;
    Economy?: string;
    MilitaryStrength?: string;
    ImageURL?: string | null;
  }

export interface Nation {
    NationID: number;
    Name: string;
    Government: string;
    CapitalLocationID: number;
    Description: string;
    FoundingDate: string;
    MajorReligionID: number;
    Culture: string;
    Economy: string;
    MilitaryStrength: string;
    CreatedDate: string;
    LastModifiedDate: string;
    ImageURL: string;
}
export interface Location {
    LocationID: number;
    Name: string;
    LocationType: string;
    Description: string;
    NationID: number;
    CoordinateX: number;
    CoordinateY: number;
    Climate: string;
    Population: number;
    CreatedDate: string;
    LastModifiedDate: string;
}

export interface LocationWithRelations extends Location {
    NationName?: string | null;
}

export interface Character {
    CharacterID: number;
    Name: string;
    Title?: string | null;
    Biography?: string | null;
    BirthDate?: string | null;
    DeathDate?: string | null;
    NationID?: number | null;
    ReligionID?: number | null;
    ImageURL?: string | null;
    CreatedDate: Date;
    LastModifiedDate: Date;
  }

  export interface Religion {
    ReligionID: number;
    Name: string;
    Description?: string | null;
    Deities?: string | null;
    HolyText?: string | null;
    Practices?: string | null;
    FoundingDate?: string | null;
    Hierarchy?: string | null;
    CreatedDate: Date;
    LastModifiedDate: Date;
    ImageURL?: string | null;
  }

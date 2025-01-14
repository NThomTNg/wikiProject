export interface Nations {
    NationID: number;
    Name: string;
    Government: string | null;
    CapitalLocationID: number | null;
    Description: string | null;
    FoundingDate: string | null;
    MajorReligionID: number | null;
    Culture: string | null;
    Economy: string | null;
    MilitaryStrength: string | null;
    CreatedDate: string;
    LastModifiedDate: string;
    ImageURL: string | null;
}

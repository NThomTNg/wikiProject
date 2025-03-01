export interface Nation {
  NationID: number;
  Name: string;
  Government?: string | null;
  CapitalLocationID?: number | null;
  Description?: string | null;
  FoundingDate?: string | null;
  MajorReligionID?: number | null;
  Culture?: string | null;
  Economy?: string | null;
  MilitaryStrength?: string | null;
  CreatedDate: Date;
  LastModifiedDate: Date;
  ImageURL?: string | null;
}

export interface Location {
  LocationID: number;
  Name: string;
  LocationType: string;
  Description?: string | null;
  NationID?: number | null;
  CoordinateX?: number | null;
  CoordinateY?: number | null;
  Climate?: string | null;
  Population?: number | null;
  CreatedDate: Date;
  LastModifiedDate: Date;
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

export interface CharacterWithRelations extends Character {
  NationName?: string | null;
  ReligionName?: string | null;
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

export interface CharacterRelationship {
  RelationshipID: number;
  CharacterID1: number;
  CharacterID2: number;
  RelationType: string;
  Description?: string | null;
}

export interface CharacterTag {
  CharacterTagID: number;
  CharacterID: number;
  TagName: string;
}

export interface CharacterFormData {
  nations: Nation[];
  religions: Religion[];
  locations: Location[];
}

export interface Event {
  EventID: number;
  Title: string;
  Description?: string | null;
  EventDate?: string | null;
  LocationID?: number | null;
  NationID?: number | null;
  CreatedDate: Date;
  LastModifiedDate: Date;
}

export interface EventWithRelations extends Event {
  LocationName?: string | null;
  NationName?: string | null;
}

export interface HistoryEntry {
  HistoryID: number;
  Title: string;
  Content?: string | null;
  TimelinePeriod?: string | null;
  StartYear?: number | null;
  EndYear?: number | null;
  Category?: string | null;
  NationID?: number | null;
  CharacterID?: number | null;
  EventID?: number | null;
  LocationID?: number | null;
  ReligionID?: number | null;
  SortOrder?: number;
  CreatedDate: Date;
  LastModifiedDate: Date;
  ImageURL?: string | null;
}

export interface HistoryEntryWithRelations extends HistoryEntry {
  NationName?: string | null;
  CharacterName?: string | null;
  EventTitle?: string | null;
  LocationName?: string | null;
  ReligionName?: string | null;
}
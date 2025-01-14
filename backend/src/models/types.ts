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

export interface Religion {
  ReligionID: number;
  Name: string;
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
}
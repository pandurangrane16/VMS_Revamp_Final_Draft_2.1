export class ZoneMaster{
    id!:number;
    zoneName !:string;
    description !: string;
    isActive !: boolean;
    createdBy!:string;
    modifiedBy!:string;
    isDeleted:boolean;
}

export class ZoneCoords {
    id!:number;
    zoneId!:number;
    latitude!:number;
    longitude!:number;
    seqNo :number;
}
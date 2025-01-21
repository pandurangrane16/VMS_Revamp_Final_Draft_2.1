export class PlaylistMaster {
    id: number;
    playlistName: string;
    height: number;
    width: number;
    status: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    remarks: string;
    auditedBy: string;
}
export class MediaDuration {
    path: string;
}

export class PlBlMdDetails {
    plId: number;
    blId: number;
    mdId: number;
    sequenceNo: number;
    duration: string;
    effectIn: number;
    effectOut: number;
    partyId: string;
    tarrifId: string;
    mediaName: string;
    mdType: string;
}

export class MediaDetails {
    id: number;
    uploadSetId: number;
    fileType: string;
    fileName: string;
    fileSize: number;
    filePath: string;
    status: number;
    isActive: boolean;
    isDeleted: boolean;
    createdDate: Date;
    createdBy: string;
    modifiedBy: string;
    seqNo: number;
    block: number;
    eIn: number;
    eOut: number;
    party: string;
    tarrif: string;
    duration: string;
    selected: boolean;
    isNew: boolean;
    mdType: string;
    mdId:number;
    displayName:string;
}

export class mediaAudit {
    mediaType:string;
    mediaPath:string;
}
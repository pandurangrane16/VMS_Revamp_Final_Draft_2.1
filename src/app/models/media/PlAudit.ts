import { PlaylistMaster } from "./PlaylistMaster";

export class PlaylistApproval {
    plAudit: PlaylistAuditMedias[];
    plMaster: PlaylistMaster;
}
export class PlaylistAuditMedias {
    plHeight: number;
    plWidth: number;
    blocks: BlData[];
    plMaster: PlaylistMaster;
    checkedUpd: boolean;
    title:string;
}


export class BlData {
    plId: number;
    blId: number;
    height: number;
    width: number;
    left: number;
    top: number;
    src: string;
    seq: number;
}

export class MediaDuration {
    path: string;
}
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
  party: number;
  tarrif: number;
  duration?: number;
  selected: boolean;
  isNew: boolean;
}

export class MediaUpload {
  id: number;
  uploadSetId: string;
  status: number;
  remarks: string;
  isDeleted: boolean;
  createdBy: string;
  modifiedBy: string;
}

export class TextDetails {
  id: number;
  uploadSetId: number;
  textContent: string;
  font: string;
  fontSize: number;
  fontStyle: string;
  foreColor: string;
  backColor: string;
  scrollingDirection: number;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: string;
  fileName: string;
  status: string;
  modifiedBy: string;
}

export class MediaDet {
  sequence: number;
  mediaName: string;
  mediaPath: string;
}

export class BlockWiseMedia {
  blId: number;
  medias: MediaDet[];
}
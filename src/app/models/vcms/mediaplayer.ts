export class Mediaplayer {
    IpAddress!:string 
    RequestData!:string;
    CreationTime!:Date;
    status!:number;
    mediaplayername!:string;
    mediaText!:string;
    IsAudited!:boolean;
    AuditedBy!:string;
    Reason!:string;    
    AuditedTime!:Date;    
    VmsId!:number;  
    RequestType! :string; 
    ResponseData! :string;
    ResponseId! : number;
    id!:number;
    controllerName! :string;
    medianame!:string;
    createddate!:Date;
}

export class mediaPlayerSave{
    name:string;
    mediaLoopCount:string;
    controllerName! :string;
    tiles : any[];
}
 export class MediaPlayerTiles {
    tileNo:number;
    isPlayOrder:boolean;
    duration: number;
    mediaLoopCount:number;
    partyIdCommon:string;
    tarrifIdCommon: string;
    fontSizeCommon: string;
    //playlistLoopCount: ['', ''],
    playlistLoopCount:number;
    colorFont: string;
    colorBg: string;
    playlist: any[];
    filesize :number;
 }

 export class mpPlaylist{
    playOrder:number;
    imageTextDuration: number;
    mediaId: number;
    mediaName: string;
    videoLoopCount: string;
    partyId: string;
    tarrifId: string;
    textStyle: any;
    filesize:any;
 }

 export class mpTextStyle{
    fontSize :number;
    fontColor : string;
    backgroundColor :string;
 }
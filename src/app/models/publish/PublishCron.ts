export class PublishCron{
    id:number;
    publishId:number;
    vmsId:string;
    playlistId:string;
    cronStartTime:string;
    cronEndTime:string;
    isDeleted:boolean;
    isProcessed:boolean;
    uniqueId :number;
}

export class PublishCronVM {
    publishCrons : PublishCron[]=[];
    globalFrom : any;
    globalTo : any;
}
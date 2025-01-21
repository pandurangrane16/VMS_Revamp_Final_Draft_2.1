export class SelectedMediaVCMS{
    tileNo:number;
    playlist:PlaylistMedia[];
}
export class PlaylistMedia{
    index : number;
    mediaId : number;
    mediaName :string;
    playOrder :number;
    imageTextDuration:number;
    videoLoopCount:number;
    textStyle :{}
}
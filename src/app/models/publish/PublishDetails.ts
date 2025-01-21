export class publishTime {
    sequence: number;
    plId: number;
    playlistName: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
  }
  
  export class publishDetails {
    zones: number[];
    vms: number[];
    pubFrom: string;
    pubTo: string;
    pubTime: publishTime[];
    username: string;
    pubType : string;
    status : number;
  }
  
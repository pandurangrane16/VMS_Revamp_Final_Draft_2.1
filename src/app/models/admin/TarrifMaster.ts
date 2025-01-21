export class TarrifMaster{
    id!:number;
    tarrifCode !:string;
    tarrifType !: string;
    uomName !: string;
    amount !: number;
    gstPer!:string;
    totalAmount!:number;
    remarks !: string;
    isActive !: boolean;
    isDeleted !: boolean;
    createdBy!:string;
    modifiedBy !:string;
    createdDate !: Date;
}
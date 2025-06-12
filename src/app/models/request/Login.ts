export class Login{
    public Username !: string;
    public Password !: string;
    public VectorBase64 !: string;
}

export class Reset{
    public username !: string;
    public newPassword !: string;
    public otp !: string;
    public emailId ! :string;
}
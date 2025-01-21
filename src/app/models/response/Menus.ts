export class Menus{
    menuId !: string;
    moduleName !: string;
    headerMenuName !: string;
    childCount !: number;
    childMenuName !: string;
    childPosition !: number;
    headerPosition !: number;
    menuPath !: string;
    checkedAdd !:boolean;
    checkedUpd !:boolean;
    checkedDel !: boolean;
    menuIcon!:string;
}

export class MenusVM {
    link_name !: string;
    link !: string;
    icon !:string;
    id !: string;
    sub_menu!:SubMenu[];
}

export class SubMenu {
    link_name!:string;
    link!:string;
    checkedAdd !: boolean;
    checkedUpd !: boolean;
    checkedDel !: boolean;
}
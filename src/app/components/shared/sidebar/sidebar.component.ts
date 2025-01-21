import * as $ from 'jquery';
import { Component } from '@angular/core';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { User } from 'src/app/models/response/User';

import PerfectScrollbar from 'perfect-scrollbar';
import { Menus, MenusVM, SubMenu } from 'src/app/models/response/Menus';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  user: User | null;
  menus: Menus[] = [];
  menusVM: MenusVM[] = [];
  openSidebar: boolean = true;
  isMenuOpen: boolean = false;
  isShow: boolean = false;
  isCollapsed: boolean = false;
  element: any;
  index:any;
  showMenu:any;
  ClickedShow:any;
  ClickedHide:any;
  HighlightRow:number;
  currentState = { show: false} ;
  constructor(private _facadeService: UserFacadeService,
    private _commonFacade: CommonFacadeService) {
    this.user = this._facadeService.user;

    this.ClickedShow = function(index :any){
      this.HighlightRow = index;
  }
  
 /*  this.ClickedShow= function(index :any){ 
    this.isShow = !this.isShow; 
    if (this.isShow) { 
      this.HighlightRow = index; 
    } else { 
      this.HighlightRow = -1;
    } 
}  */
  }
  
  menuSidebar = [
    {
      link_name: "My View",
      link: "/dashboard",
      icon: "icon-layout menu-icon",
      id: "myview",
      sub_menu: [
        {
          link_name: "Dashboard",
          link: "/dashboard",
        }, {
          link_name: "Map view",
          link: "/mapview",
        }
      ]
    },
    {
      link_name: "Administration",
      link: "/zone-management",
      icon: "icon-book menu-icon",
      id: "admin",
      sub_menu: [
        {
          link_name: "Zone Management",
          link: "/zone-management",
        }, {
          link_name: "Screen Management",
          link: "/vms-management",
        },
        {
          link_name: "Media Clearance",
          link: "/media-clearence",
        },
      ]
    },
    {
      link_name: "User Management",
      link: "/users",
      icon: "icon-head menu-icon",
      id: "admin",
      sub_menu: [
        {
          link_name: "Users",
          link: "/users",
        }, {
          link_name: "Roles",
          link: "/roles",
        },
      ]
    },
    {
      link_name: "Media",
      link: "/media-upload",
      icon: "icon-video menu-icon",
      id: "admin",
      sub_menu: [
        {
          link_name: "Media Upload",
          link: "/media-upload",
        }, {
          link_name: "Playlist Creation",
          link: "/playlist-creation",
        },
      ]
    },
    {
      link_name: "Audit",
      link: "/media-audit",
      icon: "icon-help menu-icon",
      id: "admin",
      sub_menu: [
        {
          link_name: "Media Audit",
          link: "/media-audit",
        }, {
          link_name: "Playlist Audit",
          link: "/playlist-audit",
        },
      ]
    },
    {
      link_name: "Reports",
      link: "/playlistreport",
      icon: "icon-file menu-icon",
      id: "admin",
      sub_menu: [
        {
          link_name: "Playlist Reports",
          link: "/playlistreport",
        }, {
          link_name: "Operational Reports",
          link: "/operationalreport",
        },
      ]
    }

  ]
  ngOnInit() {
    this.menus = [];
    this.menusVM = [];
    var data = this._commonFacade.getSession("Role");
    console.log(data);
    this._facadeService.getMenuDetailsByRole(data == null ? 0 : JSON.parse(data));
    let _data = this._facadeService.menus$;
    console.log(_data);
    _data.forEach(ele => {
      this.menusVM = [];
      if (ele != undefined && ele.length > 0) {
        0
        let _subMnuArr: SubMenu[] = [];
        this.menus = ele;
        this.menus.sort(x => x.headerPosition);
        var previousMenuName = "";
        this.menus.forEach(menu => {
          let _mnu = new MenusVM();
          if (menu.childCount == 0) {
            let _subMnuArr: SubMenu[] = [];
            _mnu.link_name = menu.headerMenuName;
            _mnu.icon = menu.menuIcon;
            _mnu.id = menu.menuId;
            _mnu.link = menu.menuPath;
            let subMnu = new SubMenu();
            subMnu.link = menu.menuPath;
            subMnu.link_name = menu.headerMenuName;
            subMnu.checkedAdd = menu.checkedAdd;
            subMnu.checkedUpd = menu.checkedUpd;
            subMnu.checkedDel = menu.checkedDel;
            _subMnuArr.push(subMnu);
            _mnu.sub_menu = _subMnuArr;
            this.menusVM.push(_mnu);
          }
          else {
            let _mnu = new MenusVM();
            if (previousMenuName == menu.headerMenuName) {
              let subMnu = new SubMenu();
              subMnu.link = menu.menuPath;
              subMnu.link_name = menu.childMenuName;
              _subMnuArr.push(subMnu);
            }
            else {
              _subMnuArr = [];
              _mnu.link_name = menu.headerMenuName;
              _mnu.icon = menu.menuIcon;
              _mnu.id = menu.menuId;
              _mnu.link = menu.menuPath;
              let subMnu = new SubMenu();
              subMnu.link = menu.menuPath;
              subMnu.link_name = menu.childMenuName;
              _subMnuArr.push(subMnu);
              if (previousMenuName != "" || menu.childPosition == 1) {
                _mnu.sub_menu = _subMnuArr;
                this.menusVM.push(_mnu);
              }
            }
          }
          previousMenuName = menu.headerMenuName;
        });
      }
    });
   
    var body = $("body");
    var sidebar = $('.sidebar');
    jQuery(function () {
      function addActiveClass(element: any) {
        if (current === "") {
          //for root url
          if (element.attr('href').indexOf("dashboard") !== -1) {
            element.parents('.nav-item').last().addClass('active');
            if (element.parents('.sub-menu').length) {
              element.closest('.collapse').addClass('show');
              element.addClass('active');
            }
          }
        } else {
          if (element.parents('.sub-menu').length) {
            element.closest('.collapse').addClass('show');
            element.addClass('active');
          }
          if (element.parents('.submenu-item').length) {
            element.addClass('active');
          }
        }
        // }
      }

      var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
      $('.nav li a', sidebar).each(function () {
        var $this = $(this);
        addActiveClass($this);
      })
      $('.nav-link').on('click', function () {
        console.log('navlink clicked');
        let $div = $(this).next('div').toggleClass('show');
        $('div').not($div).removeClass('show');
        $(this).attr('aria-expanded', 'true');
        $('.nav-link').not(this).attr('aria-expanded', 'false');
        return false; // prevent
      });
      $('.horizontal-menu .nav li a').each(function () {
        var $this = $(this);
        addActiveClass($this);
      })

      //Close other submenu in sidebar on opening any

      sidebar.on('show.bs.collapse', '.collapse', function () {
        sidebar.find('.collapse.show').removeClass('show');
      });


      //Change sidebar and content-wrapper height
      applyStyles();

      function applyStyles() {
        //Applying perfect scrollbar
        if (!body.hasClass("rtl")) {
          if ($('.settings-panel .tab-content .tab-pane.scroll-wrapper').length) {
            const settingsPanelScroll = new PerfectScrollbar('.settings-panel .tab-content .tab-pane.scroll-wrapper');
          }
          if ($('.chats').length) {
            const chatsScroll = new PerfectScrollbar('.chats');
          }
          if (body.hasClass("sidebar-fixed")) {
            if ($('#sidebar').length) {
              var fixedSidebarScroll = new PerfectScrollbar('#sidebar .nav');
            }
          }
        }
      }

    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

  }
  
  // clickItem(index) {
  //  // this.isShow = !this.isShow ;
  //  this.isShow = index;
  //  }
  // clicked(event) {
  // this.isShow = !this.isShow;
  // event.srcElement.classList.remove("rotate");
  // } 
  // rotate(event){
  //   event.srcElement.classList.remove("rotate");
  //   setTimeout(()=>{
  //     event.srcElement.classList.add("rotate");
  //   },0)
  // }
  // clicked(itemEl: HTMLElement){ 
  //   itemEl.classList.add("hover-open");
  // } 
  // toggleMenu2(index: number) {
  //   this.isShow = !this.isShow;
  // }
  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.add("hover-open");
  }
  hideSubmenu(itemEl: HTMLElement) {
    itemEl.classList.remove("hover-open");

  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}

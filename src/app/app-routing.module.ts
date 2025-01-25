import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { AuthGuradService } from './_auth/auth-gurad.service';
import { UserComponent } from './components/user/user/user.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { MapViewComponent } from './components/dashboard/map-view/map-view.component';
import { EncdecComponent } from './components/_extras/encdec/encdec.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { AdminConfigurationComponent } from './components/admin/admin-configuration/admin-configuration.component';
import { ZoneMngComponent } from './components/admin/zone-mng/zone-mng.component';
import { AddZoneComponent } from './components/admin/add-zone/add-zone.component';
import { ErrorPageComponent } from './components/shared/error-page/error-page.component';
import { VmsMasterComponent } from './components/admin/VMS_Management/vms-master/vms-master.component';
import { AddVmsComponent } from './components/admin/VMS_Management/add-vms/add-vms.component';
import { PartyMngComponent } from './components/admin/party-mng/party-mng.component';
import { AddPartyComponent } from './components/admin/party-mng/add-party/add-party.component';
import { AddTariffComponent } from './components/admin/tariff-mng/add-tariff/add-tariff.component';
import { TariffMngComponent } from './components/admin/tariff-mng/tariff-mng.component';
import { MediaClearanceComponent } from './components/admin/media-clearance/media-clearance.component';
import { RoleMasterComponent } from './components/user/role-master/role-master.component';
import { AddRoleComponent } from './components/user/role-master/add-role/add-role.component';
import { AccessConfigComponent } from './components/user/role-master/access-config/access-config.component';
import { AddUserComponent } from './components/user/user/add-user/add-user.component';
import { MediaUploadComponent } from './components/media/media-upload/media-upload.component';
import { PlaylistCreationComponent } from './components/media/playlist-creation/playlist-creation.component';
import { PlaylistConfigureComponent } from './components/media/playlist-configure/playlist-configure.component';
import { MediaAuditComponent } from './components/media/media-audit/media-audit.component';
import { PlaylistAuditComponent } from './components/media/playlist-audit/playlist-audit.component';
import { PublishOperationsComponent } from './components/publish/publish-operations/publish-operations.component';
import { PublishStatusComponent } from './components/publish/publish-status/publish-status.component';
import { ListViewComponent } from './components/dashboard/list-view/list-view.component';
import { NetworkReportComponent } from './components/reports/network-report/network-report.component';
import { PlaylistReportComponent } from './components/reports/playlist-report/playlist-report.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { PlaylistStatusComponent } from './components/media/playlist-status/playlist-status.component';
import { ChatAppComponent } from './components/shared/chat-app/chat-app.component';
import { NotificationPanelComponent } from './components/shared/notification-panel/notification-panel.component';
import { MediaUploadcvmsComponent } from './components/cvms/media-uploadcvms/media-uploadcvms.component';
import { MediaplayerComponent } from './components/cvms/mediaplayer/mediaplayer.component';
import { MediaschedulerComponent } from './components/cvms/mediascheduler/mediascheduler.component';
import { MediaUploadCvmsListComponent } from './components/cvms/media-upload-cvms-list/media-upload-cvms-list.component';
import { EmergencyPlayCvmsComponent } from './components/cvms/emergency-play-cvms/emergency-play-cvms.component';
import { MediaPlayerCvmsComponent } from './components/cvms/media-player-cvms/media-player-cvms.component';
import { MediaplayerlistComponent } from './components/cvms/mediaplayerlist/mediaplayerlist.component';
import { MedialiveplaylistComponent } from './components/cvms/medialiveplaylist/medialiveplaylist.component';
import { MediaschedulerListComponent } from './components/cvms/mediascheduler-list/mediascheduler-list.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },

  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "encdec",
    component: EncdecComponent,
    canActivate: [AuthGuradService]
  },

  {
    path: "config",
    component: ConfigurationComponent,
    data: { title: 'Configuration' },
    canActivate: [AuthGuradService]
  },

  {
    path: "users/user-master",
    component: UserComponent,
    data: { title: 'User Management' },
    canActivate: [AuthGuradService]
  },

  {
    path: "users/add-user",
    component: AddUserComponent,
    data: { title: 'Add User' },
    canActivate: [AuthGuradService]
  },
  {
    path: "users/role-master",
    component: RoleMasterComponent,
    data: { title: 'Role Management' },
    canActivate: [AuthGuradService]
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    data: [{ title: 'Dashboard' }],
    canActivate: [AuthGuradService]
  },
  {
    path: 'admin-dashboard',
    data: { title: 'Dashboard' },
    component: AdminDashboardComponent,
    //canActivate:[AuthGuradService]
  },
  {
    path: 'admin-config',
    component: AdminConfigurationComponent,
    canActivate: [AuthGuradService]
  },
  {
    path: 'map-view',
    component: MapViewComponent,
    data: { title: 'Map View' },
    canActivate: [AuthGuradService]
  },
  {
    path: 'dashboard/list-view',
    component: ListViewComponent,
    data: { title: 'List View' },
    canActivate: [AuthGuradService]
  },
  {
    path: 'masters/zone-master',
    component: ZoneMngComponent,
    data: { title: 'Zone Management' },
    canActivate: [AuthGuradService]
  },
  {
    path: "admin/add-zone",
    component: AddZoneComponent,
    data: { title: 'Add Zone' },
    canActivate: [AuthGuradService]
  },
  {
    path: 'masters/vms-master',
    component: VmsMasterComponent,
    data: { title: 'VMS Management' },
    canActivate: [AuthGuradService]
  },
  {
    path: "masters/add-vms",
    component: AddVmsComponent,
    data: { title: 'Add Zone' },
    canActivate: [AuthGuradService]
  },
  {
    path: 'masters/party-master',
    component: PartyMngComponent,
    data: { title: 'Party Management' },
    canActivate: [AuthGuradService]
  },
  {
    path: "masters/add-party",
    component: AddPartyComponent,
    data: { title: 'Add Party' },
    canActivate: [AuthGuradService]
  },
  {
    path: 'masters/tarrif-master',
    component: TariffMngComponent,
    data: { title: 'Tariff Management' },
    canActivate: [AuthGuradService]
  },
  {
    path: "masters/add-tariff",
    component: AddTariffComponent,
    data: { title: 'Add Tariff' },
    canActivate: [AuthGuradService]
  },
  {
    path: 'error-page',
    component: ErrorPageComponent,
    canActivate: [AuthGuradService]
  },
  {
    path: "masters/media-clearance",
    component: MediaClearanceComponent,
    data: { title: 'Media Clearance' },
    canActivate: [AuthGuradService]
  },
  {
    path: "masters/add-role",
    component: AddRoleComponent,
    data: { title: 'Add Role' },
    canActivate: [AuthGuradService]
  },
  {
    path: "masters/access-config",
    component: AccessConfigComponent,
    data: { title: 'Add Role' },
    canActivate: [AuthGuradService]
  },
  {
    path: "masters/access-config",
    component: AccessConfigComponent,
    data: { title: 'Add Role' },
    canActivate: [AuthGuradService]
  },
  {
    path: "medias/media-upload",
    component: MediaUploadComponent,
    data: { title: 'Media Upload' },
    canActivate: [AuthGuradService]
  },
  {
    path: "medias/playlist-creation",
    component: PlaylistCreationComponent,
    data: { title: 'Playlist Creation' },
    canActivate: [AuthGuradService]
  },
  {
    path: "medias/playlist-configure",
    component: PlaylistConfigureComponent,
    data: { title: 'Playlist Configuration' },
    canActivate: [AuthGuradService]
  },
  {
    path: "medias/playlist-status",
    component: PlaylistStatusComponent,
    data: { title: 'Playlist Status' },
    canActivate: [AuthGuradService]
  },
  {
    path: "audit/media-audit",
    component: MediaAuditComponent,
    data: { title: 'Media Audit' },
    canActivate: [AuthGuradService]
  },
  {
    path: "audit/playlist-audit",
    component: PlaylistAuditComponent,
    data: { title: 'Playlist Audit' },
    canActivate: [AuthGuradService]
  },
  {
    path: "audit/playlist-audit",
    component: PlaylistAuditComponent,
    data: { title: 'Playlist Audit' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "publish/publish-operation", 
    component: PublishOperationsComponent,
    data: { title: 'Publish Operations' },
    //canActivate: [AuthGuradService]
  },
  { 
    path: "publish/media-status", 
    component: PublishStatusComponent,
    data: { title: 'Publish Status' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "reports/network-report", 
    component: NetworkReportComponent,
    data: { title: 'Network Report' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "reports/playlist-report", 
    component: PlaylistReportComponent,
    data: { title: 'Playlist Report' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "notification", 
    component: NotificationPanelComponent,
    data: { title: 'Notification Report' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "cvms/upload-media", 
    component: MediaUploadcvmsComponent,
    data: { title: 'Upload Media' },
    canActivate: [AuthGuradService]
  },
  
  { 
    path: "cvms/uploadMedia", 
    component: MediaUploadCvmsListComponent,
    data: { title: 'Upload Media' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "cvms/createMediaPlayerAndPlaylist", 
    component: MediaplayerlistComponent,
    data: { title: 'Media Player' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "cvms/MediaPlayerPlaylist", 
    component: MediaPlayerCvmsComponent,
    data: { title: 'Media Player' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "cvms/createMediaPlayerScheduler", 
    component: MediaschedulerComponent,
    data: { title: 'Media Scheduler' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "cvms/MediaPlayerSchedulerList", 
    component: MediaschedulerListComponent,
    data: { title: 'Media Scheduler' },
    canActivate: [AuthGuradService]
  },
  { 
    path: "cvms/livePlay", 
    component: EmergencyPlayCvmsComponent,
    data: { title: 'Emergency Play' },
    canActivate: [AuthGuradService]
  },  
  { 
    path: "cvms/livePlaylist", 
    component: MedialiveplaylistComponent,
    data: { title: 'Emergency Play' },
    canActivate: [AuthGuradService]
  },  
  
  //Wild Card Route for 404 request 
  { path: '**',  
  component: PageNotFoundComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

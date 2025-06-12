export const environment = {
    version:"2.1.6",
    production: false,
    user:"superadmin",
    password:"Cms$$2023#1",
    EncryptKey : "770A8A65DA156D24EE2A093277530142",
    EncryptIV : "770A8A65DA156D24EE2A093277530142",

    //UAT Server Settings
    SSE_Url : "http://10.20.2.15:8026/publish_api/notify",
    PreviewPath : "http://10.20.2.15:8026/mediaLists/playlists/",
    Socket_URL : "http://10.20.2.15:8030",
    //Vadodara UAT Server Settings
    // SSE_Url : "http://10.100.43.157:8026/publish_api/notify",
    // Socket_URL : "10.20.1.111:8028",
    // PreviewPath : "http://10.100.43.157:8026/mediaLists/playlists/",

    // //Development Settings
    // PreviewPath : "https://172.19.32.161:442/mediaLists/playlists/",
    // SSE_Url : "https://172.19.32.161:442/publish_api/notify",
    // Socket_URL : "http://172.19.32.161:3000/",
    autoTimeout : 15
  };
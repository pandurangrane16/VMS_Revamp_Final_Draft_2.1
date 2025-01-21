$(document).ready(function () {
    $("#map").hide();
    $('#vmsZoneList').DataTable({
    // searching: true,
    // responsive: true,
    // autoWidth: false,
    // bPaginate: true,
    // dom: 'Bfltip',
    // buttons: [
    //     {
    //         className: 'btn btn-export border-0 btn-outline-export',
    //         text: "<button class='btn text-white font-13 tunjuk'><i class='fa fa-pencil'></i></button>",
    //         action: function ( e, dt, node, config ) {
    //             $('#myTable').DataTable().ajax.reload();
    //         },
    //         titleAttr: 'Refresh Log'
    //     }
    // ],
  dom: 'Bfltip',
  buttons: [
      {   className: 'btn btn-success btn-rounded text-dark mr-3  ',
          text: '<i class="icon-plus"></i> Add New zone',
          action: function ( e, dt, node, config ) {
              $(".table-responsive").addClass("d-none");
              $("#zoneMap").removeClass("p-2");
              $("#zoneMap").addClass("p-0");
              $(".card-header").removeClass("d-none");
              $("#map").show();
           
          }
      }
  ],
      "lengthMenu": [ [8, 10, 25, 50, -1], [8, 10, 25, 50, "All"] ]
    });

    $("#addZone").click(function(){
       $("#map").hide();
        $(".table-responsive").removeClass("d-none");
        $("#map").show();
        $(".card-header").addClass("d-none");
        $("#zoneMap").addClass("p-2");
      });
  

  });

  
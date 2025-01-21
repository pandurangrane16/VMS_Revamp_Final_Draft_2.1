$(document).ready(function () {
    $('#vmsList').DataTable({
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
      {   className: 'btn btn-success btn-rounded text-dark mr-3 ',
          text: '<i class="icon-plus"></i> Add New VMS',
          action: function ( e, dt, node, config ) {
            $('#addVmsModal').modal();
           
          }
      }
  ],
      "lengthMenu": [ [8, 10, 25, 50, -1], [8, 10, 25, 50, "All"] ]
    });
  
  });

 $(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'DD/MM/YYYY'
  });
});


(function( $ ){
    $( document ).ready( function() {
        $( '.input-range').each(function(){
            var value = $(this).attr('data-slider-value');
            var separator = value.indexOf(',');
            if( separator !== -1 ){
                value = value.split(',');
                value.forEach(function(item, i, arr) {
                    arr[ i ] = parseFloat( item );
                });
            } else {
                value = parseFloat( value );
            }
            $( this ).slider({
                formatter: function(value) {
                    console.log(value);
                    return '$' + value;
                },
                min: parseFloat( $( this ).attr('data-slider-min') ),
                max: parseFloat( $( this ).attr('data-slider-max') ), 
                range: $( this ).attr('data-slider-range'),
                value: value,
                tooltip_split: $( this ).attr('data-slider-tooltip_split'),
                tooltip: $( this ).attr('data-slider-tooltip')
            });
        });
        
     } );
    } )( jQuery );

  
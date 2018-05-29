// Include libraries
var sql = window.SQL;


var current_url = window.location.href;
var root_url = current_url.substring( 0, current_url.lastIndexOf("/") );
console.log( root_url );

var file_input = document.getElementById('file');

file_input.onchange = function() {
    var file = file_input.files[0];
    console.log( file );

    var r = new FileReader();

    r.onload = function() {
        var Uints = new Uint8Array(r.result);

        var db;
        db = new SQL.Database(Uints);

        build_display_table( db, "tb_record" );
    }

    r.readAsArrayBuffer(file);
}


function build_display_table( db, table_name )
{
    console.log( db );
    var virtual_table_name = table_name + "_pragma";

    var cols_array = db.exec( "PRAGMA main.table_info(" + table_name + ")" );
    //console.log( "CREATE VIRTUAL TABLE " + virtual_table_name + " USING superview (PRAGMA main.table_info(" + table_name + ") )" );
    //db.exec( "CREATE VIRTUAL TABLE " + virtual_table_name + " USING PRAGMA main.table_info(" + table_name + ")" );
    
    console.log( cols_array );
    console.log( cols_array[0] );
    const cols_array_object = Object.entries( cols_array[0] )[1];
    //const cols_array_object = { columns: Array, values: Array };
    console.log( cols_array_object[1] );
    //console.log( Object.entries( cols_array_object )[1] );
    //console.log( parse_tuple( cols_array[0].toString() ) );

    //var col_names = db.exec( "SELECT 'name' FROM " + virtual_table_name );

    //console.log( col_names );


    $( 'main' ).append( "<table id='"+table_name+"'><thead><tr></tr></thead><tbody></tbody></table>" );

    var $table = $( "#"+table_name );
    var $thead = $table.find( "thead" );
    var $tbody = $table.find( "tbody" );

    $.each( cols_array_object[1], function( i, value )
    {
        console.log( value[1] );
        $thead.find( 'tr' ).append( "<th>" + value[1] + "</th>" );
    });
    $thead.find( 'tr' ).append()

    var res = db.exec( "SELECT * FROM " + table_name );
    console.log( Object.entries( res[0] )[1][1] );

    $.each( Object.entries( res[0] )[1][1], function( i, row )
    {
        var tr = document.createElement( 'tr' );
        $.each( row, function( i, value ){
            var cell = document.createElement( 'td' );

            if ( i === 2 ) // local filepath
            {
                if( ( row[i] != null ) && ( row[i].toString() != '' ) )
                {
                    var anchor = document.createElement( 'a' );
                    anchor.href = 'imgstore/' + row[i];
                    anchor.appendChild( document.createTextNode( 'Local Filepath' ) );
                    cell.appendChild( anchor );
                }
            }
            else if( i === 3 ) // remote filepath
            {
                if( ( row[i] != null ) && ( row[i].toString() != '' ) )
                {
                    var anchor = document.createElement( 'a' );
                    anchor.href = row[i];
                    anchor.appendChild( document.createTextNode( 'External Link' ) );
                    cell.appendChild( anchor );
                }
            }
            else if( i === 4 ) // source URL
            {
                if( ( row[i] != null ) && ( row[i].toString() != '' ) )
                {
                    var anchor = document.createElement( 'a' );
                    anchor.href = row[i];
                    anchor.appendChild( document.createTextNode( 'Source URL' ) );
                    cell.appendChild( anchor );
                }
            }
            else
            {
                cell.appendChild( document.createTextNode( row[i] ) );
            }
            tr.appendChild( cell );
        });
        console.log( tr );
        $tbody[0].appendChild( tr );
        //$.each
    });

}

function parse_tuple( tuple ) {
    var tuple_string = tuple.toString();
    return JSON.parse( "[" + tuple_string.replace(/\(/g, "[").replace(/\)/g, "]") + "]");
}


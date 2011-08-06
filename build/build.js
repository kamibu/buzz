var fs = require( 'fs' );

var files = [ 'buzz', 'utils', 'sound', 'group' ];

var src = fs.readFileSync( '../LICENSE', 'utf-8' );
for ( var i = 0; i < files.length; ++i ) {
    var filename = files[ i ];

    content = fs.readFileSync( '../src/' + filename + '.js', 'utf8' );

    src += "( function() {\n\n";
    src += content;
    src += "\n} )();\n\n";
}

fs.writeFileSync( 'buzz.js', src );

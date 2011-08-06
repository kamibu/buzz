function group( sounds ) {
    sounds = argsToArray( sounds, arguments );
}

// publics
group.prototype.getSounds = function() {
    return sounds;
};

group.prototype.add = function( soundArray ) {
    soundArray = argsToArray( soundArray, arguments );
    for( var a = 0; a < soundArray.length; a++ ) {
        sounds.push( soundArray[ a ] );
    }
};

group.prototype.remove = function( soundArray ) {
    soundArray = argsToArray( soundArray, arguments );
    for( var a = 0; a < soundArray.length; a++ ) {
        for( var i = 0; i < sounds.length; i++ ) {
            if ( sounds[ i ] == soundArray[ a ] ) {
                delete sounds[ i ];
                break;
            }
        }
    }
};

group.prototype.load = function() {
    fn( 'load' );
    return this;
};

group.prototype.play = function() {
    fn( 'play' );
    return this;
};

group.prototype.togglePlay = function( ) {
    fn( 'togglePlay' );
    return this;
};

group.prototype.pause = function( time ) {
    fn( 'pause', time );
    return this;
};

group.prototype.stop = function() {
    fn( 'stop' );
    return this;
};

group.prototype.mute = function() {
    fn( 'mute' );
    return this;
};

group.prototype.unmute = function() {
    fn( 'unmute' );
    return this;
};

group.prototype.toggleMute = function() {
    fn( 'toggleMute' );
    return this;
};

group.prototype.setVolume = function( volume ) {
    fn( 'setVolume', volume );
    return this;
};

group.prototype.increaseVolume = function( value ) {
    fn( 'increaseVolume', value );
    return this;
};

group.prototype.decreaseVolume = function( value ) {
    fn( 'decreaseVolume', value );
    return this;
};

group.prototype.loop = function() {
    fn( 'loop' );
    return this;
};

group.prototype.unloop = function() {
    fn( 'unloop' );
    return this;
};

group.prototype.setTime = function( time ) {
    fn( 'setTime', time );
    return this;
};

group.prototype.setduration = function( duration ) {
    fn( 'setduration', duration );
    return this;
};

group.prototype.set = function( key, value ) {
    fn( 'set', key, value );
    return this;
};

group.prototype.bind = function( type, func ) {
    fn( 'bind', type, func );
    return this;
};

group.prototype.unbind = function( type ) {
    fn( 'unbind', type );
    return this;
};

group.prototype.bindOnce = function( type, func ) {
    fn( 'bindOnce', type, func );
    return this;
};

group.prototype.trigger = function( type ) {
    fn( 'trigger', type );
    return this;
};

group.prototype.fade = function( from, to, duration, callback ) {
    fn( 'fade', from, to, duration, callback );
    return this;
};

group.prototype.fadeIn = function( duration, callback ) {
    fn( 'fadeIn', duration, callback );
    return this;
};

group.prototype.fadeOut = function( duration, callback ) {
    fn( 'fadeOut', duration, callback );
    return this;
};

// privates
function fn() {
    var args = argsToArray( null, arguments ),
        func = args.shift();

    for( var i = 0; i < sounds.length; i++ ) {
        sounds[ i ][ func ].apply( sounds[ i ], args );
    }
}

function argsToArray( array, args ) {
    return ( array instanceof Array ) ? array : Array.prototype.slice.call( args );
}

buzz.group = group;

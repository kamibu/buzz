function Group( sounds ) {
    sounds = argsToArray( sounds, arguments );
}

// publics
Group.prototype.getSounds = function() {
    return sounds;
};

Group.prototype.add = function( soundArray ) {
    soundArray = argsToArray( soundArray, arguments );
    for( var a = 0; a < soundArray.length; a++ ) {
        sounds.push( soundArray[ a ] );
    }
};

Group.prototype.remove = function( soundArray ) {
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

Group.prototype.load = function() {
    fn( 'load' );
    return this;
};

Group.prototype.play = function() {
    fn( 'play' );
    return this;
};

Group.prototype.togglePlay = function( ) {
    fn( 'togglePlay' );
    return this;
};

Group.prototype.pause = function( time ) {
    fn( 'pause', time );
    return this;
};

Group.prototype.stop = function() {
    fn( 'stop' );
    return this;
};

Group.prototype.mute = function() {
    fn( 'mute' );
    return this;
};

Group.prototype.unmute = function() {
    fn( 'unmute' );
    return this;
};

Group.prototype.toggleMute = function() {
    fn( 'toggleMute' );
    return this;
};

Group.prototype.setVolume = function( volume ) {
    fn( 'setVolume', volume );
    return this;
};

Group.prototype.increaseVolume = function( value ) {
    fn( 'increaseVolume', value );
    return this;
};

Group.prototype.decreaseVolume = function( value ) {
    fn( 'decreaseVolume', value );
    return this;
};

Group.prototype.loop = function() {
    fn( 'loop' );
    return this;
};

Group.prototype.unloop = function() {
    fn( 'unloop' );
    return this;
};

Group.prototype.setTime = function( time ) {
    fn( 'setTime', time );
    return this;
};

Group.prototype.setduration = function( duration ) {
    fn( 'setduration', duration );
    return this;
};

Group.prototype.set = function( key, value ) {
    fn( 'set', key, value );
    return this;
};

Group.prototype.bind = function( type, func ) {
    fn( 'bind', type, func );
    return this;
};

Group.prototype.unbind = function( type ) {
    fn( 'unbind', type );
    return this;
};

Group.prototype.bindOnce = function( type, func ) {
    fn( 'bindOnce', type, func );
    return this;
};

Group.prototype.trigger = function( type ) {
    fn( 'trigger', type );
    return this;
};

Group.prototype.fade = function( from, to, duration, callback ) {
    fn( 'fade', from, to, duration, callback );
    return this;
};

Group.prototype.fadeIn = function( duration, callback ) {
    fn( 'fadeIn', duration, callback );
    return this;
};

Group.prototype.fadeOut = function( duration, callback ) {
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

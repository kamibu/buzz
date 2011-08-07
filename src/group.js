function group( sounds ) {
    this.sounds = argsToArray( sounds, arguments );
}

// publics
group.prototype.getSounds = function() {
    return this.sounds;
};

group.prototype.add = function( soundArray ) {
    soundArray = argsToArray( soundArray, arguments );
    for( var a = 0; a < soundArray.length; a++ ) {
        this.sounds.push( soundArray[ a ] );
    }
};

group.prototype.remove = function( soundArray ) {
    soundArray = argsToArray( soundArray, arguments );
    for( var a = 0; a < soundArray.length; a++ ) {
        for( var i = 0; i < this.sounds.length; i++ ) {
            if ( this.sounds[ i ] == soundArray[ a ] ) {
                delete this.sounds[ i ];
                break;
            }
        }
    }
};

group.prototype.load = function() {
    return this.fn( 'load' );
};

group.prototype.play = function() {
    return this.fn( 'play' );
};

group.prototype.togglePlay = function( ) {
    return this.fn( 'togglePlay' );
};

group.prototype.pause = function( time ) {
    return this.fn( 'pause', time );
};

group.prototype.stop = function() {
    return this.fn( 'stop' );
};

group.prototype.mute = function() {
    return this.fn( 'mute' );
};

group.prototype.unmute = function() {
    return this.fn( 'unmute' );
};

group.prototype.toggleMute = function() {
    return this.fn( 'toggleMute' );
};

group.prototype.setVolume = function( volume ) {
    return this.fn( 'setVolume', volume );
};

group.prototype.increaseVolume = function( value ) {
    return this.fn( 'increaseVolume', value );
};

group.prototype.decreaseVolume = function( value ) {
    return this.fn( 'decreaseVolume', value );
};

group.prototype.loop = function() {
    return this.fn( 'loop' );
};

group.prototype.unloop = function() {
    return this.fn( 'unloop' );
};

group.prototype.setTime = function( time ) {
    return this.fn( 'setTime', time );
};

group.prototype.setduration = function( duration ) {
    return this.fn( 'setduration', duration );
};

group.prototype.set = function( key, value ) {
    return this.fn( 'set', key, value );
};

group.prototype.bind = function( type, func ) {
    return this.fn( 'bind', type, func );
};

group.prototype.unbind = function( type ) {
    return this.fn( 'unbind', type );
};

group.prototype.bindOnce = function( type, func ) {
    return this.fn( 'bindOnce', type, func );
};

group.prototype.trigger = function( type ) {
    return this.fn( 'trigger', type );
};

group.prototype.fade = function( from, to, duration, callback ) {
    return this.fn( 'fade', from, to, duration, callback );
};

group.prototype.fadeIn = function( duration, callback ) {
    return this.fn( 'fadeIn', duration, callback );
};

group.prototype.fadeOut = function( duration, callback ) {
    return this.fn( 'fadeOut', duration, callback );
};

group.prototype.fn = function() {
    var args = argsToArray( null, arguments ),
        func = args.shift();

    for( var i = 0; i < this.sounds.length; i++ ) {
        this.sounds[ i ][ func ].apply( this.sounds[ i ], args );
    }

    return this;
};

// privates
function argsToArray( array, args ) {
    return ( array instanceof Array ) ? array : Array.prototype.slice.call( args );
}

buzz.group = group;

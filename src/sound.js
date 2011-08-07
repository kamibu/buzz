function sound( src, options ) {
    var supported = buzz.isSupported(), i;

    this.pid = 0;
    this.events = [];
    this.eventsOnce = {};

    options = options || {};

    if ( supported ) {
        for( i in buzz.defaults ) {
            options[ i ] = options[ i ] || buzz.defaults[ i ];
        }

        this.sound = document.createElement( 'audio' );

        if ( src instanceof Array ) {
            for( i in src ) {
                addSource( this.sound, src[ i ] );
            }
        } else if ( options.formats.length ) {
            for( i in options.formats ) {
                addSource( this.sound, src + '.' + options.formats[ i ] );
            }
        } else {
            addSource( this.sound, src );
        }

        if ( options.loop ) {
            this.loop();
        }

        if ( options.autoplay ) {
            this.sound.autoplay = 'autoplay';
        }

        if ( options.preload === true ) {
            this.sound.preload = 'auto';
        } else if ( options.preload === false ) {
            this.sound.preload = 'none';
        } else {
            this.sound.preload = options.preload;
        }

        this.setVolume( options.volume );

        buzz.sounds.push( this );
    }
    else {
        for ( i in this ) {
            if ( i in sound.prototype && typeof this[ i ] == "function" && i != "unsupported" ) {
                this[ i ] = this.unsupported;
            }
        }
    }
}

sound.prototype.load = function() {
    this.sound.load();
    return this;
};

sound.prototype.play = function() {
    this.sound.play();
    return this;
};

sound.prototype.togglePlay = function() {
    if ( this.sound.paused ) {
        this.sound.play();
    } else {
        this.sound.pause();
    }
    return this;
};

sound.prototype.pause = function() {
    this.sound.pause();
    return this;
};

sound.prototype.isPaused = function() {
    return this.sound.paused;
};

sound.prototype.stop = function() {
    this.setTime( this.getDuration() );
    this.sound.pause();
    return this;
};

sound.prototype.isEnded = function() {
    return this.sound.ended;
};

sound.prototype.loop = function() {
    this.sound.loop = 'loop';
    this.bind( 'ended.buzzloop', function() {
        this.currentTime = 0;
        this.play();
    });
    return this;
};

sound.prototype.unloop = function() {
    this.sound.removeAttribute( 'loop' );
    this.unbind( 'ended.buzzloop' );
    return this;
};

sound.prototype.mute = function() {
    this.sound.muted = true;
    return this;
};

sound.prototype.unmute = function() {
    this.sound.muted = false;
    return this;
};

sound.prototype.toggleMute = function() {
    this.sound.muted = !this.sound.muted;
    return this;
};

sound.prototype.isMuted = function() {
    return this.sound.muted;
};

sound.prototype.setVolume = function( volume ) {
    if ( volume < 0 ) volume = 0;
    if ( volume > 100 ) volume = 100;
    this.volume = volume;
    this.sound.volume = volume / 100;
    return this;
};

sound.prototype.getVolume = function() {
    return this.volume;
};

sound.prototype.increaseVolume = function( value ) {
    return this.setVolume( this.volume + ( value || 1 ) );
};

sound.prototype.decreaseVolume = function( value ) {
    return this.setVolume( this.volume - ( value || 1 ) );
};

sound.prototype.setTime = function( time ) {
    this.whenReady( function() {
        this.sound.currentTime = time;
    });
    return this;
};

sound.prototype.getTime = function() {
    var time = Math.round( this.sound.currentTime * 100 ) / 100;
    return isNaN( time ) ? buzz.defaults.placeholder : time;
};

sound.prototype.setPercent = function( percent ) {
    return this.setTime( buzz.utils.fromPercent( percent, this.sound.duration ) );
};

sound.prototype.getPercent = function() {
    var percent = Math.round( buzz.utils.toPercent( this.sound.currentTime, this.sound.duration ) );
    return isNaN( percent ) ? buzz.defaults.placeholder : percent;
};

sound.prototype.setSpeed = function( duration ) {
    this.sound.playbackRate = duration;
};

sound.prototype.getSpeed = function() {
    return this.sound.playbackRate;
};

sound.prototype.getDuration = function() {
    var duration = Math.round( this.sound.duration * 100 ) / 100;
    return isNaN( duration ) ? buzz.defaults.placeholder : duration;
};

sound.prototype.getPlayed = function() {
    return timerangeToArray( this.sound.played );
};

sound.prototype.getBuffered = function() {
    return timerangeToArray( this.sound.buffered );
};

sound.prototype.getSeekable = function() {
    return timerangeToArray( this.sound.seekable );
};

sound.prototype.getErrorCode = function() {
    if ( this.sound.error ) {
        return this.sound.error.code;
    }
    return 0;
};

sound.prototype.getErrorMessage = function() {
    switch( this.getErrorCode() ) {
        case 1:
            return 'MEDIA_ERR_ABORTED';
        case 2:
            return 'MEDIA_ERR_NETWORK';
        case 3:
            return 'MEDIA_ERR_DECODE';
        case 4:
            return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
        default:
            return null;
    }
};

sound.prototype.getStateCode = function() {
    return this.sound.readyState;
};

sound.prototype.getStateMessage = function() {
    switch( this.getStateCode() ) {
        case 0:
            return 'HAVE_NOTHING';
        case 1:
            return 'HAVE_METADATA';
        case 2:
            return 'HAVE_CURRENT_DATA';
        case 3:
            return 'HAVE_FUTURE_DATA';
        case 4:
            return 'HAVE_ENOUGH_DATA';
        default:
            return null;
    }
};

sound.prototype.getNetworkStateCode = function() {
    return this.sound.networkState;
};

sound.prototype.getNetworkStateMessage = function() {
    switch( this.getNetworkStateCode() ) {
        case 0:
            return 'NETWORK_EMPTY';
        case 1:
            return 'NETWORK_IDLE';
        case 2:
            return 'NETWORK_LOADING';
        case 3:
            return 'NETWORK_NO_SOURCE';
        default:
            return null;
    }
};

sound.prototype.set = function( key, value ) {
    this.sound[ key ] = value;
    return this;
};

sound.prototype.get = function( key ) {
    return key ? this.sound[ key ] : this.sound;
};

sound.prototype.bind = function( types, func ) {
    var that = this,
        efunc = function( e ) { func.call( that, e ); };

    types = types.split( ' ' );

    for( var t = 0; t < types.length; t++ ) {
        var type = types[ t ],
            idx = type;
            type = idx.split( '.' )[ 0 ];

            this.events.push( { idx: idx, func: efunc } );
            this.sound.addEventListener( type, efunc, true );
    }
    return this;
};

sound.prototype.unbind = function( types ) {
    types = types.split( ' ' );

    for( var t = 0; t < types.length; t++ ) {
        var idx = types[ t ];
            type = idx.split( '.' )[ 0 ];

        for( var i = 0; i < this.events.length; i++ ) {
            var namespace = this.events[ i ].idx.split( '.' );
            if ( this.events[ i ].idx == idx || ( namespace[ 1 ] && namespace[ 1 ] == idx.replace( '.', '' ) ) ) {
                this.sound.removeEventListener( type, this.events[ i ].func, true );
                delete this.events[ i ];
            }
        }
    }
    return this;
};

sound.prototype.bindOnce = function( type, func ) {
    var that = this;

    this.eventsOnce[ this.pid++ ] = false;
    this.bind( this.pid + type, function() {
       if ( !this.eventsOnce[ this.pid ] ) {
           this.eventsOnce[ this.pid ] = true;
           func.call( that );
       }
       that.unbind( this.pid + type );
    });
};

sound.prototype.trigger = function( types ) {
    types = types.split( ' ' );

    for( var t = 0; t < types.length; t++ ) {
        var idx = types[ t ];

        for( var i = 0; i < this.events.length; i++ ) {
            var eventType = this.events[ i ].idx.split( '.' );
            if ( this.events[ i ].idx == idx || ( eventType[ 0 ] && eventType[ 0 ] == idx.replace( '.', '' ) ) ) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent( eventType[ 0 ], false, true );
                this.sound.dispatchEvent( evt );
            }
        }
    }
    return this;
};

sound.prototype.fadeTo = function( to, duration, callback ) {
    if ( duration instanceof Function ) {
        callback = duration;
        duration = buzz.defaults.duration;
    } else {
        duration = duration || buzz.defaults.duration;
    }

    var from = this.volume,
        delay = duration / Math.abs( from - to ),
        that = this;
    this.play();

    function doFade() {
        setTimeout( function() {
            if ( from < to && that.volume < to ) {
                that.setVolume( that.volume += 1 );
                doFade();
            } else if ( from > to && that.volume > to ) {
                that.setVolume( that.volume -= 1 );
                doFade();
            } else if ( callback instanceof Function ) {
                callback.apply( that );
            }
        }, delay );
    }
    this.whenReady( function() {
        doFade();
    });

    return this;
};

sound.prototype.fadeIn = function( duration, callback ) {
    return this.setVolume(0).fadeTo( 100, duration, callback );
};

sound.prototype.fadeOut = function( duration, callback ) {
    return this.fadeTo( 0, duration, callback );
};

sound.prototype.fadeWith = function( sound, duration ) {
    this.fadeOut( duration, function() {
        this.stop();
    });

    sound.play().fadeIn( duration );

    return this;
};

sound.prototype.whenReady = function( func ) {
    var that = this;
    if ( this.sound.readyState === 0 ) {
        this.bind( 'canplay.buzzwhenready', function() {
            func.call( that );
        });
    } else {
        func.call( that );
    }
};

sound.prototype.unsupported = function() {
    return this;
};

// privates
function timerangeToArray( timeRange ) {
    var array = [],
        length = timeRange.length - 1;

    for( var i = 0; i <= length; i++ ) {
        array.push({
            start: timeRange.start( length ),
            end: timeRange.end( length )
        });
    }
    return array;
}

function getExt( filename ) {
    return filename.split('.').pop();
}

function addSource( sound, src ) {
    var source = document.createElement( 'source' );
    source.src = src;
    if ( buzz.types[ getExt( src ) ] ) {
        source.type = buzz.types[ getExt( src ) ];
    }
    sound.appendChild( source );
}

buzz.sound = sound;

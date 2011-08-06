function Sound( src, options ) {
    var pid = 0,
        events = [],
        eventsOnce = {},
        supported = buzz.isSupported(),
        i;

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
            if ( this.hasOwnProperty( i ) && typeof this[ i ] == "function" && i != "unsupported" ) {
                this[ i ] = this.unsupported;
            }
        }
    }
}

Sound.prototype.load = function() {
    this.sound.load();
    return this;
};

Sound.prototype.play = function() {
    this.sound.play();
    return this;
};

Sound.prototype.togglePlay = function() {
    if ( this.sound.paused ) {
        this.sound.play();
    } else {
        this.sound.pause();
    }
    return this;
};

Sound.prototype.pause = function() {
    this.sound.pause();
    return this;
};

Sound.prototype.isPaused = function() {
    return this.sound.paused;
};

Sound.prototype.stop = function() {
    this.setTime( this.getDuration() );
    this.sound.pause();
    return this;
};

Sound.prototype.isEnded = function() {
    return this.sound.ended;
};

Sound.prototype.loop = function() {
    this.sound.loop = 'loop';
    this.bind( 'ended.buzzloop', function() {
        this.currentTime = 0;
        this.play();
    });
    return this;
};

Sound.prototype.unloop = function() {
    this.sound.removeAttribute( 'loop' );
    this.unbind( 'ended.buzzloop' );
    return this;
};

Sound.prototype.mute = function() {
    this.sound.muted = true;
    return this;
};

Sound.prototype.unmute = function() {
    this.sound.muted = false;
    return this;
};

Sound.prototype.toggleMute = function() {
    this.sound.muted = !this.sound.muted;
    return this;
};

Sound.prototype.isMuted = function() {
    return this.sound.muted;
};

Sound.prototype.setVolume = function( volume ) {
    if ( volume < 0 ) volume = 0;
    if ( volume > 100 ) volume = 100;
    this.volume = volume;
    this.sound.volume = volume / 100;
    return this;
};

Sound.prototype.getVolume = function() {
    return this.volume;
};

Sound.prototype.increaseVolume = function( value ) {
    return this.setVolume( this.volume + ( value || 1 ) );
};

Sound.prototype.decreaseVolume = function( value ) {
    return this.setVolume( this.volume - ( value || 1 ) );
};

Sound.prototype.setTime = function( time ) {
    this.whenReady( function() {
        this.sound.currentTime = time;
    });
    return this;
};

Sound.prototype.getTime = function() {
    var time = Math.round( this.sound.currentTime * 100 ) / 100;
    return isNaN( time ) ? buzz.defaults.placeholder : time;
};

Sound.prototype.setPercent = function( percent ) {
    return this.setTime( utils.fromPercent( percent, this.sound.duration ) );
};

Sound.prototype.getPercent = function() {
    var percent = Math.round( utils.toPercent( this.sound.currentTime, this.sound.duration ) );
    return isNaN( percent ) ? buzz.defaults.placeholder : percent;
};

Sound.prototype.setSpeed = function( duration ) {
    this.sound.playbackRate = duration;
};

Sound.prototype.getSpeed = function() {
    return this.sound.playbackRate;
};

Sound.prototype.getDuration = function() {
    var duration = Math.round( this.sound.duration * 100 ) / 100;
    return isNaN( duration ) ? buzz.defaults.placeholder : duration;
};

Sound.prototype.getPlayed = function() {
    return timerangeToArray( this.sound.played );
};

Sound.prototype.getBuffered = function() {
    return timerangeToArray( this.sound.buffered );
};

Sound.prototype.getSeekable = function() {
    return timerangeToArray( this.sound.seekable );
};

Sound.prototype.getErrorCode = function() {
    if ( this.sound.error ) {
        return this.sound.error.code;
    }
    return 0;
};

Sound.prototype.getErrorMessage = function() {
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

Sound.prototype.getStateCode = function() {
    return this.sound.readyState;
};

Sound.prototype.getStateMessage = function() {
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

Sound.prototype.getNetworkStateCode = function() {
    return this.sound.networkState;
};

Sound.prototype.getNetworkStateMessage = function() {
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

Sound.prototype.set = function( key, value ) {
    this.sound[ key ] = value;
    return this;
};

Sound.prototype.get = function( key ) {
    return key ? this.sound[ key ] : this.sound;
};

Sound.prototype.bind = function( types, func ) {
    var that = this,
        efunc = function( e ) { func.call( that, e ); };

    types = types.split( ' ' );

    for( var t = 0; t < types.length; t++ ) {
        var type = types[ t ],
            idx = type;
            type = idx.split( '.' )[ 0 ];

            events.push( { idx: idx, func: efunc } );
            this.sound.addEventListener( type, efunc, true );
    }
    return this;
};

Sound.prototype.unbind = function( types ) {
    types = types.split( ' ' );

    for( var t = 0; t < types.length; t++ ) {
        var idx = types[ t ];
            type = idx.split( '.' )[ 0 ];

        for( var i = 0; i < events.length; i++ ) {
            var namespace = events[ i ].idx.split( '.' );
            if ( events[ i ].idx == idx || ( namespace[ 1 ] && namespace[ 1 ] == idx.replace( '.', '' ) ) ) {
                this.sound.removeEventListener( type, events[ i ].func, true );
                delete events[ i ];
            }
        }
    }
    return this;
};

Sound.prototype.bindOnce = function( type, func ) {
    var that = this;

    eventsOnce[ pid++ ] = false;
    this.bind( pid + type, function() {
       if ( !eventsOnce[ pid ] ) {
           eventsOnce[ pid ] = true;
           func.call( that );
       }
       that.unbind( pid + type );
    });
};

Sound.prototype.trigger = function( types ) {
    types = types.split( ' ' );

    for( var t = 0; t < types.length; t++ ) {
        var idx = types[ t ];

        for( var i = 0; i < events.length; i++ ) {
            var eventType = events[ i ].idx.split( '.' );
            if ( events[ i ].idx == idx || ( eventType[ 0 ] && eventType[ 0 ] == idx.replace( '.', '' ) ) ) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent( eventType[ 0 ], false, true );
                this.sound.dispatchEvent( evt );
            }
        }
    }
    return this;
};

Sound.prototype.fadeTo = function( to, duration, callback ) {
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

Sound.prototype.fadeIn = function( duration, callback ) {
    return this.setVolume(0).fadeTo( 100, duration, callback );
};

Sound.prototype.fadeOut = function( duration, callback ) {
    return this.fadeTo( 0, duration, callback );
};

Sound.prototype.fadeWith = function( sound, duration ) {
    this.fadeOut( duration, function() {
        this.stop();
    });

    sound.play().fadeIn( duration );

    return this;
};

Sound.prototype.whenReady = function( func ) {
    var that = this;
    if ( this.sound.readyState === 0 ) {
        this.bind( 'canplay.buzzwhenready', function() {
            func.call( that );
        });
    } else {
        func.call( that );
    }
};

Sound.prototype.unsupported = function() {
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

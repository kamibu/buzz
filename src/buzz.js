var buzz = {
    defaults: {
        autoplay: false,
        duration: 5000,
        formats: [],
        loop: false,
        placeholder: '--',
        preload: 'metadata',
        volume: 80
    },

    types: {
        'mp3': 'audio/mpeg',
        'ogg': 'audio/ogg',
        'wav': 'audio/wav',
        'aac': 'audio/aac',
        'm4a': 'audio/x-m4a'
    },

    sounds: [],

    el: document.createElement( 'audio' ),

    all: function() {
        return new buzz.group( this.sounds );
    },

    isSupported: function() {
        return !!this.el.canPlayType;
    },

    isOGGSupported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/ogg; codecs="vorbis"' );
    },

    isWAVSupported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/wav; codecs="1"' );
    },

    isMP3Supported: function() {
        return !!this.el.canPlayType && this.el.canPlayType( 'audio/mpeg;' );
    },

    isAACSupported: function() {
        return !!this.el.canPlayType && ( this.el.canPlayType( 'audio/x-m4a;' ) || this.el.canPlayType( 'audio/aac;' ) );
    }
};

window.buzz = buzz;

/*******************************
 * jquery.nameshuffler.js
 * A jQuery-plugin, a tool to shuffle set of names and divide them in groups.
 * Petri Salmela <pesasa@iki.fi>
 *******************************/

;(function($){

    if (window.jQuery) {
        jQuery.htmlPrefilter = function( html ) {
            return html;
        }
    }

    var Shuffler = function(place, options){
        options = $.extend(true, {}, Shuffler.defaults, options);
        this.place = $(place);
        this.autoshuffle = !!options.autoshuffle;
        this.setAttrs();
        this.setStyles();
        this.initHandlers();
        this.show();
        this.names = [];
        this.groupCount = 4;
        this.groupSize = 0;
        this.lastSet = 'groupCount';
    };

    Shuffler.prototype.show = function(){
        var html = (this.autoshuffle ? Shuffler.templates.htmlautoshuffle : Shuffler.templates.html);
        this.place.html(html);
    };

    Shuffler.prototype.updateData = function(){
        var inputs = this.place.find('.nameshuffler-inputarea input.nameshuffler-textinput');
        this.names = [];
        for (var i = 0, len = inputs.length; i < len; i++){
            this.names.push(inputs.eq(i).val());
        };
        if (this.lastSet === 'groupCount') {
            this.groupSize = Math.floor(this.names.length / this.groupCount)
        } else if (this.lastSet === 'groupSize') {
            this.groupCount = Math.floor(this.names.length / this.groupSize);
        };
        this.place.find('.nameshuffler-outputarea input.nameshuffler-groupcount').val(this.groupCount);
        this.place.find('.nameshuffler-outputarea input.nameshuffler-groupsize').val(this.groupSize);
        this.randomGroup();
    };

    Shuffler.prototype.randomGroup = function(shuffle){
        var groups = [];
        var names = this.names.slice();
        if (this.autoshuffle || shuffle){
            names = names.sort(function(a,b){return Math.random()- 0.5;});
        };
        for (var i = 0; i < this.groupCount; i++) {
            groups.push([]);
        };
        for (var i = 0, len = names.length; i < len; i++) {
            groups[i % this.groupCount].push(names[i]);
        };
        this.drawGroups(groups);
    };

    Shuffler.prototype.drawGroups = function(groups){
        var results = this.place.find('.nameshuffler-outputarea .nameshuffler-resultarea');
        results.empty();
        var namelist, groupbox, group;
        for (var i = 0, len = groups.length; i < len; i++){
            group = groups[i];
            groupbox = $(Shuffler.templates.group);
            groupbox.find('.nameshuffler-grouphead').html('<h2>Ryhmä '+ (i+1) + '</h2>');
            namelist = [];
            for (var j = 0, nlen = group.length; j < nlen; j++) {
                namelist.push('<li>' + group[j] + '</li>');
            };
            groupbox.find('.nameshuffler-groupbody').html(namelist.join('\n'));
            results.append(groupbox);
        };
    };

    Shuffler.prototype.initHandlers = function() {
        var shuff = this;
        this.place.on('keyup', '.nameshuffler-namelist li input.nameshuffler-textinput', function(event){
            event.stopPropagation();
            var inputs = shuff.place.find('.nameshuffler-inputarea input.nameshuffler-textinput');
            var current = $(this);
            var index = inputs.index(current);
            switch (event.keyCode) {
                case 38:
                    inputs.eq(Math.max(index-1, 0)).focus();
                    break;
                case 40:
                    inputs.eq(Math.min(index+1, inputs.length-1)).focus();
                    break;
                case 13:
                    shuff.addField(index);
                    break;
                case 8:
                    if (event.ctrlKey && inputs.length > 1) {
                        current.closest('li').remove();
                        if (index !== 0) {
                            inputs.eq(index-1).focus();
                        } else {
                            inputs.eq(0).focus();
                        };
                    };
                    break;
                default:
                    break;
            };
            shuff.updateData();
        });
        this.place.on('change', '.nameshuffler-outputarea .nameshuffler-groupcount', function(event){
            event.stopPropagation();
            event.preventDefault();
            shuff.groupCount = $(this).val() | 0;
            shuff.lastSet = 'groupCount';
            shuff.updateData();
        });
        this.place.on('change', '.nameshuffler-outputarea .nameshuffler-groupsize', function(event){
            event.stopPropagation();
            event.preventDefault();
            shuff.groupSize = $(this).val() | 0;
            shuff.lastSet = 'groupSize';
            shuff.updateData();
        });
        this.place.on('click', '.nameshuffler-outputarea .nameshuffler-groupshuffle', function(event){
            event.stopPropagation();
            event.preventDefault();
            shuff.randomGroup(true);
        });
    };

    Shuffler.prototype.addField = function(index){
        var listitems = this.place.find('.nameshuffler-namelist > li');
        listitems.eq(index).after('<li><input class="nameshuffler-textinput" type="text" /></li>');
        var listitems = this.place.find('.nameshuffler-namelist > li');
        listitems.eq(index + 1).find('input.nameshuffler-textinput').last().focus();
    }

    Shuffler.prototype.setAttrs = function() {
        this.place.addClass('nameshuffler-wrapper');
    };

    Shuffler.prototype.setStyles = function() {
        if ($('head style#nameshuffler-styles').length === 0) {
            $('head').append('<style id="nameshuffler-styles" type="text/css">' + Shuffler.style + '</style>');
        };
    };

    Shuffler.defaults = {
        autoshuffle: false
    }

    Shuffler.style = [
        '.nameshuffler-wrapper {border: 1px solid #777; border-radius: 4px; padding: 0.5em; background-color: #eee;}',
        '.nameshuffler-wrapper .nameshuffler-content {display: flex; flex-flow: col nowrap; align-items: stretch;}',
        '.nameshuffler-wrapper .nameshuffler-inputarea {flex: 1; flex-grow: 0; flex-shrink: 1; min-width: 25em; min-height: 100px; padding: 1em;}',
        '.nameshuffler-wrapper .nameshuffler-outputarea {flex: 1; flex-grow: 1; flex-shrink: 0; padding: 1em; border-left: 1px solid black;}',
        '.nameshuffler-wrapper .nameshuffler-namelist li input.nameshuffler-textinput {width: 100%; box-sizing: border-box;}',
        '.nameshuffler-wrapper .nameshuffler-groupset {display: inline-block; background-color: white; border: 1px solid #777; padding: 0.5em; box-shadow: 8px 8px 8px rgba(0,0,0,0.5); margin: 1em; vertical-align: top; min-width: 15em;}',
        '.nameshuffler-wrapper .nameshuffler-groupset .nameshuffler-grouphead {border-bottom: 1px solid black;}',
        '.nameshuffler-wrapper .nameshuffler-groupset .nameshuffler-grouphead h2 {font-size: 120%;}',
        '.nameshuffler-wrapper .nameshuffler-helparea {font-size: 80%;}',
        '@media print {.nameshuffler-wrapper .nameshuffler-inputarea, .nameshuffler-wrapper .nameshuffler-buttonarea, .nameshuffler-wrapper .nameshuffler-helparea, .nameshuffler-wrapper > h1 {display: none;} .nameshuffler-wrapper .nameshuffler-outputarea {border-left: none;} .nameshuffler-wrapper .nameshuffler-groupset {box-shadow: none;}}'
    ].join('\n');

    Shuffler.templates = {
        html: [
            '<h1>Ryhmittelijä</h1>',
            '<div class="nameshuffler-content">',
            '    <div class="nameshuffler-inputarea">',
            '        <div>Syötä tähän nimiä.</div>',
            '        <ol class="nameshuffler-namelist">',
            '            <li><input class="nameshuffler-textinput" type="text" /></li>',
            '        </ol>',
            '        <div class="nameshuffler-helparea"><em>Enter</em>=rivin lisäys,<br /><em>ctrl+backspace</em>=rivin poisto,<br /><em>nuoli ylös, nuoli alas</em>=liikkuminen</div>',
            '    </div>',
            '    <div class="nameshuffler-outputarea">',
            '        <div class="nameshuffler-buttonarea"><label>Ryhmiä: <input class="nameshuffler-groupcount" type="number" min="1" max="50" value="4" /></label> <label>Vähimmäiskoko: <input class="nameshuffler-groupsize" type="number" min="1" max="200" value="0" /></label><button class="nameshuffler-groupshuffle">Sekoita</button></div>',
            '        <div class="nameshuffler-resultarea"></div>',
            '    </div>',
            '</div>'
        ].join('\n'),
        htmlautoshuffle: [
            '<h1>Ryhmittelijä</h1>',
            '<div class="nameshuffler-content">',
            '    <div class="nameshuffler-inputarea">',
            '        <div>Syötä tähän nimiä.</div>',
            '        <ol class="nameshuffler-namelist">',
            '            <li><input class="nameshuffler-textinput" type="text" /></li>',
            '        </ol>',
            '        <div class="nameshuffler-helparea"><em>Enter</em>=rivin lisäys,<br /><em>ctrl+backspace</em>=rivin poisto,<br /><em>nuoli ylös, nuoli alas</em>=liikkuminen</div>',
            '    </div>',
            '    <div class="nameshuffler-outputarea">',
            '        <div class="nameshuffler-buttonarea"><label>Ryhmiä: <input class="nameshuffler-groupcount" type="number" min="1" max="50" value="4" /></label> <label>Vähimmäiskoko: <input class="nameshuffler-groupsize" type="number" min="1" max="200" value="0" /></label></div>',
            '        <div class="nameshuffler-resultarea"></div>',
            '    </div>',
            '</div>'
        ].join('\n'),
        group: [
            '<div class="nameshuffler-groupset">',
            '    <div class="nameshuffler-grouphead"></div>',
            '    <ul class="nameshuffler-groupbody"></ul>',
            '</div>'
        ].join('\n')
    }

    // jQuery-plugin
    $.fn.nameshuffler = function(options) {
        if (methods[options]){
            return methods[options].apply( this, Array.prototype.slice.call( arguments, 1));
        } else if (typeof(options) === 'object' || !options) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.fn.sdeditor' );
            return this;
        }
    };

    var methods = {
        init: function( options ) {
            return this.each(function(){
                var shuffler = new Shuffler(this, options);
            });
        }
    };

})(jQuery);

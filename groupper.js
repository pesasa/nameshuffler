/*******************************
 * nameshuffler.js
 * A tool to shuffle set of names and divide them in groups.
 * Petri Salmela <pesasa@iki.fi>
 *******************************/

var PSTools = (function(PSTools, window, $){

    if (window.jQuery) {
        jQuery.htmlPrefilter = function( html ) {
            return html;
        }
    }

    PSTools.escapeHTML = function(html) {
        return document.createElement('div')
            .appendChild(document.createTextNode(html))
            .parentNode
            .innerHTML
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;')
    };

    PSTools.icons = {
        close: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-close"><path class="mini-icon-foreground" style="stroke: none;" d="M15 14 l12 -12 l2 2 l-12 12 l12 12 l-2 2 l-12 -12 l-12 12 l-2 -2 l12 -12 l-12 -12 l2 -2z"></svg>',
        menu: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="-15 -15 30 30" class="mini-icon mini-icon-hamburgermenu"><path class="mini-icon-foreground mini-icon-hamburger-sides" style="stroke: none;" d="M-10 -10 h20 a2 2 0 0 1 0 4 h-20 a2 2 0 0 1 0 -4z m0 16 h20 a2 2 0 0 1 0 4 h-20 a2 2 0 0 1 0 -4z"></path><path class="mini-icon-foreground mini-icon-hamburger-middle1" stroke="none" d="M-10 -2 h20 a2 2 0 0 1 0 4 h-20 a2 2 0 0 1 0 -4z"></path><path class="mini-icon-foreground mini-icon-hamburger-middle2" stroke="none" d="M-10 -2 h20 a2 2 0 0 1 0 4 h-20 a2 2 0 0 1 0 -4z"></path></svg>',
        remove: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-remove"><path class="mini-icon-foreground" style="stroke: none;" d="M15 14 l12 -12 l2 2 l-12 12 l12 12 l-2 2 l-12 -12 l-12 12 l-2 -2 l12 -12 l-12 -12 l2 -2z"></svg>',
        shuffle: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-shuffle"><path class="mini-icon-foreground" style="stroke: none;" d="M2 19 h4 c5 0 8 -12 15 -12 h2 v-3 l5 5 l-5 5 v-3 h-2 c-5 0 -8 12 -15 12 h-4z M2 7 h4 c5 0 12 12 15 12 h2 v-3 l5 5 l-5 5 v-3 h-2 c-5 0 -12 -12 -15 -12 h-4z"></svg>',
        alphabetical: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-alphabetical"><path class="mini-icon-foreground" style="stroke: none;" d="M1 25 l6 -20 h4 l6 20 h-4 l-2 -7 h-4 l-2 7z m8 -14 l-1 4 h2z m10 -6 h10 v4 l-6 12 h6 v4 h-10 v-4 l6 -12 h-6z m-3 8 h4 v3 h-4z"></svg>',
        print: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-print"><path class="mini-icon-foreground" style="stroke: none;" d="M2 12 a2 2 0 0 1 2 -2 h22 a2 2 0 0 1 2 2 v8 a2 2 0 0 1 -2 2 h-3 v-3 h-16 v3 h-3 a2 2 0 0 1 -2 -2z m3 0 a1 1 0 0 0 0 2 a1 1 0 0 0 0 -2z m3 -3 v-4 a2 2 0 0 1 2 -2 h10 a2 2 0 0 1 2 2 v4 h-1 v-4 a1 1 0 0 0 -1 -1 h-10 a1 1 0 0 0 -1 1 v4z m0 11 h1 v6 a1 1 0 0 0 1 1 h10 a1 1 0 0 0 1 -1 v-6 h1 v6 a2 2 0 0 1 -2 2 h-10 a2 2 0 0 1 -2 -2z m2 1 h10 v1 h-10z m0 2 h10 v1 h-10z m0 2 h10 v1 h-10z"></svg>',
        copy: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-copy"><path class="mini-icon-foreground" style="stroke: none;" d="M3 1 h17 v5 h-2 v-3 h-13 v18 h4 v2 h-6z m7 6 h17 v22 h-17z m2 2 v18 h13 v-18z m2 3 h9 v2 h-9z m0 5 h9 v2 h-9z m0 5 h9 v2 h-9z"/></svg>',
        paste: '<svg class="mini-icon mini-icon-paste" viewBox="0 0 30 30" height="30" width="30" xmlns="http://www.w3.org/2000/svg"><path class="mini-icon-foreground" d="M20 3 h4 a3 3 0 0 1 3 3 v5 h-2 v-5 a1 1 0 0 0 -1 -1 h-4z m-10 0 v2 h-4 a1 1 0 0 0 -1 1 v18 a1 1 0 0 0 1 1 h5 v2 h-5 a3 3 0 0 1 -3 -3 v-18 a3 3 0 0 1 3 -3 h4z m8 0 v1 a2 2 0 0 0 2 2 a2 2 0 0 1 2 2 v1 h-14 v-1 a2 2 0 0 1 2 -2 a2 2 0 0 0 2 -2 v-1 a3 3 0 0 1 6 0z m-5 8 h10 l5 5 v12 h-15z m1.5 1.5 v14 h12 v-10 h-4 v-4z" style="stroke: none;" fill="black"></path></svg>',
        open: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-folder mini-icon-open"><path class="mini-icon-foreground" style="stroke: none;" d="M2 6 l7 0 l1 2 l13 0 l0 2 l-16 0 l-4 14 l5 -12 l21 0 l-5 13 -22 0z"></path></svg>',
        save: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-save mini-icon-disk"><path class="mini-icon-foreground" style="stroke: none;" d="M1 1 l23 0 l5 5 l0 23 l-28 0z m5 2 l0 8 l17 0 l0 -8z m12 1 l3 0 l0 6 l-3 0z m-13 10 l0 14 l20 0 l0 -14z m3 3 l14 0 l0 2 l-14 0z m0 3 l14 0 l0 2 l-14 0z m0 3 l14 0 l0 2 l-14 0z"></path></svg>',
        newdocument: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 30 30" class="mini-icon mini-icon-newdocument"><path class="mini-icon-foreground" style="stroke: none;" d="M3 1 h16 l8 8 v10 h-2 v-8 h-8 v-8 h-12 v24 h12 v2 h-14z m15.6 2 v6.5 h6.5z m0.4 15 a1 1 0 0 1 1 -1 l2 0 a1 1 0 0 1 1 1 v3 h3 a1 1 0 0 1 1 1 v2 a1 1 0 0 1 -1 1 h-3 v3 a1 1 0 0 1 -1 1 h-2 a1 1 0 0 1 -1 -1 v-3 h-3 a1 1 0 0 1 -1 -1 v-2 a1 1 0 0 1 1 -1 h3z"/></svg>'
    }

    class Groupper {
        constructor(place, options) {
            this._place = $(place);
            this.localLoad();
            this._options = Object.assign({}, this._options, options);
            this.localSave();
            this.setAttrs();
            this.setStyles();
            this.initHandlers();
            this.sessionLoad();
            if (!this._names) {
                this._names = new Names();
            }
            this.show();
            window.groupper = this;
        }

        get mode() {
            return this._options.mode;
        }

        get size() {
            return this._options.size;
        }

        set size(size) {
            this._options.size = size;
        }

        get amount() {
            return this._options.amount;
        }

        set amount(amount) {
            this._options.amount = amount;
        }

        get modevalue() {
            return (this.mode === 'amount' ? this.amount : this.size);
        }

        show() {
            this._place.html(this.getTemplate('html'));
            this._input = this._place.find('.groupper-input-addname');
            this._glists = this._place.find('.groupper-grouplists-block');
            this._menuplace = this._place.find('.groupper-menu');
            this._dialogPlace = this._place.find('.groupper-dialog');
            this.drawMenu();
            this.draw();
        }

        addName(name, nid) {
            if (name) {
                this._names.addName(name, nid);
                let groupper = this;
                setTimeout(function() {groupper.dataChanged();}, 300);
            }
        }

        removeName(nid) {
            this._names.removeName(nid);
            this.dataChanged();
        }

        setLang(lang) {
            localizer.lang = lang;
            this._options.lang = localizer.lang;
            this.changed();
            this.show();
        }

        setMode(mode) {
            if (this._gmodes.includes(mode)) {
                this._options.mode = mode;
                this.draw();
                this._menuplace.find('.groupper-input-modevalue').attr('data-mode', this.mode).val(this.modevalue);
                this.changed();
            }
        }

        setModevalue(mode, value) {
            if (this._gmodes.includes(mode)) {
                if (mode === 'amount') {
                    this.amount = value;
                } else {
                    this.size = value;
                }
                this.changed();
                this.draw();
            }
        }

        changed() {
            this.localSave();
        }

        dataChanged() {
            this.sessionSave();
        }

        localSave() {
            let options = JSON.parse(JSON.stringify(this._options));
            localStorage.setItem('groupper-options', JSON.stringify(options));
        }

        localLoad() {
            let options = localStorage.getItem('groupper-options');
            try {
                options = JSON.parse(options);
            } catch (err) {
                console.log('Could not parse local options', err);
                options = {};
            }
            this._options = Object.assign({}, this._defaults, options);
            localizer.lang = this._options.lang;
        }

        sessionSave() {
            let ndata = this._names.getData() || {};
            sessionStorage.setItem('groupper-data', JSON.stringify(ndata));
        }

        sessionLoad() {
            let ndata = sessionStorage.getItem('groupper-data');
            try {
                ndata = JSON.parse(ndata);
            } catch (err) {
                console.log('Could not parse local data', err);
                ndata = false;
            }
            if (ndata) {
                this._names = new Names(ndata);
            }
        }

        newDocument() {
            this._names = new Names();
            this.dataChanged();
            this.show();
        }

        emptyInput() {
            this._input.removeAttr('data-nid').val('');
        }

        shuffle() {
            this._names.shuffle();
        }

        sort() {
            this._names.sort();
        }

        draw() {
            let groups = [];
            switch (this.mode) {
                case 'minsize':
                    groups = this._names.getGroupsByMinSize(this.size);
                    break;
                case 'maxsize':
                    groups = this._names.getGroupsByMaxSize(this.size);
                    break;
                case 'amount':
                    groups = this._names.getGroupsByAmount(this.amount);
                    break;
                default:
                    break;
            }
            let html = [];
            for (let i = 0, len = groups.length; i < len; i++) {
                let gr = groups[i];
                html.push(this.getGroupHtml(gr, i+1));
            }
            this._glists.html(html.join('\n'));
        }

        drawMenu() {
            let html = [];
            html.push(`
                <div class="groupper-settings">
                    <div class="groupper-settings-box groupper-settings-lang">
                        <div class="groupper-settings-label">${PSTools.escapeHTML(localizer.localize('groupper:language'))}</div>
                        <div class="groupper-buttonbar">
                        ${this.getLangButtons()}
                        </div>
                    </div>
                    <div class="groupper-settings-box groupper-settings-groupby">
                        <div class="groupper-settings-label">${PSTools.escapeHTML(localizer.localize('groupper:rule'))}</div>
                        <div class="groupper-buttonbar">
                        ${this.getModeButtons()}
                        </div>
                        <div class="groupper-input">
                            <input type="number" class="groupper-input-modevalue" data-mode="${this.mode}" value="${this.modevalue}">
                        </div>
                    </div>
                    <div class="groupper-settings-box" groupper-settings-actions">
                        <div class="groupper-settings-label">${PSTools.escapeHTML(localizer.localize('groupper:actions'))}</div>
                        <div class="groupper-buttonbar">
                            <div class="groupper-barbutton groupper-newbutton">
                                <span class="groupper-buttonicon">
                                ${PSTools.icons.newdocument}
                                </span>
                                <span class="groupper-buttonlabel">
                                ${PSTools.escapeHTML(localizer.localize('groupper:empty'))}
                                </span>
                            </div>
                        </div>
                        <div class="groupper-buttonbar">
                            <div class="groupper-barbutton groupper-openbutton">
                                <span class="groupper-buttonicon">
                                ${PSTools.icons.open}
                                </span>
                                <span class="groupper-buttonlabel">
                                ${PSTools.escapeHTML(localizer.localize('groupper:open'))}
                                </span>
                            </div>
                        </div>
                        <div class="groupper-buttonbar">
                            <div class="groupper-barbutton groupper-savebutton">
                                <span class="groupper-buttonicon">
                                ${PSTools.icons.save}
                                </span>
                                <span class="groupper-buttonlabel">
                                ${PSTools.escapeHTML(localizer.localize('groupper:save'))}
                                </span>
                            </div>
                        </div>
                        <!--
                        <div class="groupper-buttonbar">
                            <div class="groupper-barbutton groupper-copybutton">
                                <span class="groupper-buttonicon">
                                ${PSTools.icons.copy}
                                </span>
                                <span class="groupper-buttonlabel">
                                ${PSTools.escapeHTML(localizer.localize('groupper:copy'))}
                                </span>
                            </div>
                        </div>
                        <div class="groupper-buttonbar">
                            <div class="groupper-barbutton groupper-pastebutton">
                                <span class="groupper-buttonicon">
                                ${PSTools.icons.paste}
                                </span>
                                <span class="groupper-buttonlabel">
                                ${PSTools.escapeHTML(localizer.localize('groupper:paste'))}
                                </span>
                            </div>
                        </div>
                        -->
                        <div class="groupper-buttonbar">
                            <div class="groupper-barbutton groupper-printbutton">
                                <span class="groupper-buttonicon">
                                ${PSTools.icons.print}
                                </span>
                                <span class="groupper-buttonlabel">
                                ${PSTools.escapeHTML(localizer.localize('groupper:print'))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            this._menuplace.html(html.join('\n'));
        }

        getLangButtons() {
            let html = [];
            let languages = localizer.languages;
            let currlang = localizer.lang;
            for (let lang of languages) {
                html.push(`
                    <label>
                        <input type="radio" name="grlang" class="groupper-settings-input-lang" value="${lang}" ${lang === currlang ? 'checked' : ''}>
                        <span class="groupper-settings-lang-item groupper-radiobutton">${PSTools.escapeHTML(localizer.localize(lang))}</span>
                    </label>
                `);
            };
            return html.join('\n');
        }

        getModeButtons() {
            let html = [];
            let modes = this._gmodes.slice();
            let currmode = this.mode;
            for (let mode of modes) {
                html.push(`
                    <label>
                        <input type="radio" name="grmode" class="groupper-settings-input-mode" value="${mode}" ${mode === currmode ? 'checked' : ''}>
                        <span class="groupper-settings-lang-item groupper-radiobutton">${PSTools.escapeHTML(localizer.localize('groupper:' + mode))}</span>
                    </label>
                `);
            };
            return html.join('\n');
        }

        toggleMenu() {
            this._place.toggleClass('groupper-menuopen');
        }

        selectItem(nid) {
            this._glists.find('.groupper-grouplist-listitem').removeClass('groupper-selecteditem');
            this._glists.find(`.groupper-grouplist-listitem[data-nid="${PSTools.escapeHTML(nid)}"]`).addClass('groupper-selecteditem');
            let name = this._names.getNameById(nid);
            this._input.attr('data-nid', PSTools.escapeHTML(nid)).val(name).focus();
        }

        unselectItem() {
            this.emptyInput();
            this._glists.find('.groupper-grouplist-listitem.groupper-selecteditem').removeClass('groupper-selecteditem');
        }

        getGroupHtml(group, index) {
            let html = [`
                <section class="groupper-grouplist">
                    <h1 class="groupper-grouplist-title">${PSTools.escapeHTML(localizer.localize('groupper:group'))} ${index}</h1>
                    <ul class="groupper-grouplist-list">
            `];
            for (let item of group) {
                html.push(`
                    <li class="groupper-grouplist-listitem" data-nid="${PSTools.escapeHTML(item.id)}">
                        <span class="groupper-name">${PSTools.escapeHTML(localizer.localize(item.name))}</span>
                        <span class="groupper-name-remove groupper-button">${PSTools.icons.remove}</span>
                    </li>
                `);
            }
            html.push(`
                    </ul>
                </section>
            `);
            return html.join('\n');
        }

        toMarkdown() {
            let groups = [];
            switch (this.mode) {
                case 'minsize':
                    groups = this._names.getGroupsByMinSize(this.size);
                    break;
                case 'maxsize':
                    groups = this._names.getGroupsByMaxSize(this.size);
                    break;
                case 'amount':
                    groups = this._names.getGroupsByAmount(this.amount);
                    break;
                default:
                    break;
            }
            let mdtext = [];
            for (let i = 0, len = groups.length; i < len; i++) {
                let gr = groups[i];
                mdtext.push(this.getGroupMd(gr, i+1));
            }
            return mdtext.join('\n');
        }

        getGroupMd(group, index) {
            let gtitle = `${localizer.localize('groupper:group')} ${index}`;
            let mdtext = [
                `${gtitle}`,
                `${Array(gtitle.length + 1).join('-')}`
            ];
            for (let item of group) {
                mdtext.push(`- ${localizer.localize(item.name)}`);
            }
            mdtext.push('');
            return mdtext.join('\n');
        }

        toCSV() {
            let groups = [];
            switch (this.mode) {
                case 'minsize':
                    groups = this._names.getGroupsByMinSize(this.size);
                    break;
                case 'maxsize':
                    groups = this._names.getGroupsByMaxSize(this.size);
                    break;
                case 'amount':
                    groups = this._names.getGroupsByAmount(this.amount);
                    break;
                default:
                    break;
            }
            let csvtext = [];
            let titles = [];
            for (let i = 0, len = groups.length; i < len; i++) {
                titles.push(`${localizer.localize('groupper:group')} ${i+1}`);
            }
            csvtext.push(titles);
            let first = groups[0] || [];
            for (let i = 0, len = first.length; i < len; i++) {
                let row = [];
                for (let j = 0, jlen = groups.length; j < jlen; j++) {
                    let litem = groups[j][i] || {name: ''};
                    row.push((litem.name || '').replace(/"/g, '\\"'));
                }
                csvtext.push(row);
            }
            csvtext = csvtext.map(row => `"${row.join('","')}"`);
            return csvtext.join('\n');
        }

        toJSON() {
            let result = JSON.parse(JSON.stringify(this._names.getData()));
            result.settings = JSON.parse(JSON.stringify(this._options));
            return result;
        }

        export(ftype) {
            let result = '';
            switch (ftype) {
                case 'json':
                    result = JSON.stringify(this.toJSON(), null, 4);
                    break;
                case 'markdown':
                    result = this.toMarkdown();
                    break;
                case 'csv':
                    result = this.toCSV();
                    break;
                default:
                    break;
            }
            return result;
        }

        import(data) {
            let ftype = (data.filetype || '').split('/')[1] || 'json';
            switch (ftype) {
                case 'json':
                    this.importJSON(data.filedata);
                    break;
                case 'markdown':
                    this.importMarkdown(data.filedata);
                    break;
                case 'csv':
                    this.importCSV(data.filedata);
                    break;
                default:
                    break;
            }
            this._dialog.close();
        }

        importJSON(text) {
            let json = false;
            try {
                json = JSON.parse(text);
            } catch (err) {
                console.log('Could not parse opened JSON file. Was it correct format?');
            }
            if (json && json.type === 'groupper') {
                if (json.settings) {
                    this._options = $.extend(this._options, json.settings);
                    this.sessionSave();
                    if (json.settings.lang) {
                        this.setLang(json.settings.lang);
                    }
                }
                this._names = new Names(json);
                this.show();
            }
        }

        importMarkdown(text) {
            text = text.trim();
            let allLangs = localizer.languages;
            let grstr = allLangs.map(lang => localizer.localize('groupper:group', lang));
            let rex = new RegExp(`\\s*(?:${grstr.join('|')}) [0-9]+\\s+\\-+\\s*`, 'g');
            let groups = text.split(rex);
            if (groups[0] === '') {
                groups.shift();
            }
            let settings = {
                amount: groups.length,
                mode: 'amount'
            };
            this._options = $.extend(this._options, settings);
            this.localSave();
            groups = groups.map(item => item.replace(/^\- /, '').split(/\n\- /g));
            let names = [].concat(...groups);
            this._names = new Names();
            for (let name of names) {
                this.addName(name);
            }
            const groupper = this;
            setTimeout(function() {groupper.show();}, 100);
        }

        importCSV(text) {
            text = text.trim();
            let rows = text.split(/\s*\n\s*/g);
            // Remove titles
            rows.shift();
            rows = rows.map(item => item.replace(/^\"/, '').replace(/\"$/, '').split(/\",\"/g));
            let settings = {
                amount: rows[0].length,
                mode: 'amount'
            };
            this._options = $.extend(this._options, settings);
            this.localSave();
            this._names = new Names();
            while (rows[0].length > 0) {
                for (let r of rows) {
                    let name = r.shift();
                    if (name) {
                        this.addName(name);
                    }
                }
            }
            const groupper = this;
            setTimeout(function() {groupper.show();}, 100);
        }

        getTemplate(key, map) {
            let result = '';
            switch (key) {
                case 'html':
                    result = `
                        <header class="groupper-header">
                            <div class="groupper-header-buttons">
                                <div class="groupper-button groupper-menubutton" data-action="toggle_menu">
                                ${PSTools.icons.menu}
                                </div>
                            </div>
                            <div class="groupper-header-title">
                            ${localizer.localize('groupper:title')}
                            </div>
                            <div class="groupper-header-buttons">
                                <div class="groupper-button groupper-sortbutton" data-action="sort">
                                ${PSTools.icons.alphabetical}
                                </div>
                                <div class="groupper-button groupper-shufflebutton" data-action="shuffle">
                                ${PSTools.icons.shuffle}
                                </div>
                            </div>
                        </header>
                        <nav class="groupper-menu">
                        </nav>
                        <article class="groupper-body">
                            <div class="groupper-grouplists-block"></div>
                            <div class="groupper-dialog"></div>
                        </article>
                        <footer class="groupper-footer">
                            <div class="groupper-input">
                                <input type="text" class="groupper-input-addname" placeholder="${PSTools.escapeHTML(localizer.localize('groupper:add_placeholder'))}" />
                            </div>
                        </footer>
                    `;
                    break;
                default:
                    result = '';
            }
            return result;
        }

        openOpenDialog() {
            const groupper = this;
            this._dialog = new PSDialog(this._dialogPlace, {
                mode: 'open',
                form: [
                    {
                        type: 'text',
                        name: 'instruction',
                        value: 'groupper:open_instruction'
                    }
                ],
                openHandler: function(data) {
                    groupper.import(data);
                }
            });
            this._dialog.show();
        }

        openSaveDialog() {
            const groupper = this;
            this._dialog = new PSDialog(this._dialogPlace, {
                mode: 'save',
                previewAction: function(ftype) {
                    return groupper.export(ftype);
                },
                form: [
                    {
                        type: 'preview',
                        name: 'savepreview',
                        classes: [],
                        updateon: 'filetype_changed',
                        update: function(place, data) {
                            let filetype = data && data.value || groupper._filetype || 'json';
                            return groupper.export(filetype);
                        }
                    },
                    {
                        type: 'select',
                        name: 'filetype',
                        options: [
                            {
                                name: 'json',
                                label: 'groupper:json-file',
                                value: 'json',
                                data: {
                                    type: 'json',
                                    extension: '.json'
                                },
                                default: (!groupper._filetype || groupper._filetype === 'json')
                            },
                            {
                                name: 'markdown',
                                label: 'groupper:markdown-file',
                                value: 'markdown',
                                data: {
                                    type: 'markdown',
                                    extension: '.md'
                                },
                                default: groupper._filetype === 'markdown'
                            },
                            {
                                name: 'csv',
                                label: 'groupper:csv-file',
                                value: 'csv',
                                data: {
                                    type: 'csv',
                                    extension: '.csv'
                                },
                                default: groupper._filetype === 'csv'
                            }
                        ],
                        onchange: true
                    },
                    {
                        type: 'textinput',
                        name: 'filename',
                        value: (this._filename || '').replace(/\.[^.]*$/, ''),
                        after: {
                            classes: [],
                            name: 'extension',
                            value: groupper.getExtension(),
                        },
                        updateon: 'filetype_changed',
                        update: function(place, option) {
                            place.next('.psdialog-textinput-after').html(PSTools.escapeHTML(option.data.extension));
                        }
                    }
                ],
                actions: {
                    onok: function(data) {
                        data = data || {};
                        let uri = groupper.getSaveUri(data.filetype.type);
                        data.place.attr('download', `${data.filename}${data.filetype.extension}`)
                            .attr('href', uri);
                        groupper._filename = data.filename;
                        groupper._filetype = data.filetype.type;
                        groupper._dialog.close();
                    }
                }
            });
            this._dialog.show();
        }

        openCopyDialog() {
            this._dialog = new PSDialog(this._dialogPlace, {
                mode: 'copy'
            });
            this._dialog.show();
        }

        openPasteDialog() {
            this._dialog = new PSDialog(this._dialogPlace, {
                mode: 'paste'
            });
            this._dialog.show();
        }

        print() {
            window.print();
        }

        getSaveUri(ftype) {
            if (this._blobUri) {
                // Revoke the previous blob uri to prevent memory leaks!
                URL.revokeObjectURL(this._blobUri);
            }
            let savedata = this.export(ftype);
            let fmime = (ftype === 'json' ? 'application/json' : 'text/plain');
            let gblob = new Blob([savedata], {type: fmime});
            this._blobUri = URL.createObjectURL(gblob);
            return this._blobUri;
        }

        getExtension() {
            const extensions = {
                'markdown': '.md',
                'csv': '.csv',
                'json': '.json'
            };
            let ftype = this._filetype || 'json';
            return extensions[ftype] || '.json';
        }

        setAttrs() {
            this._place.addClass('groupper-wrapper');
        }

        setStyles() {
            if ($('head style#groupperstyles').length === 0) {
                $('head').append(this._styles);
            }
        }

        initHandlers() {
            let groupper = this;
            this._place.off();
            this._place.on('keydown', '.groupper-input-addname', function(event) {
                event.stopPropagation();
                let value = $(this).val();
                let nid = $(this).attr('data-nid');
                switch (event.keyCode) {
                    case 13:
                        groupper.addName(value, nid);
                        break;
                    default:
                        break;
                };
            }).on('keyup', '.groupper-input-addname', function(event) {
                event.stopPropagation();
                switch (event.keyCode) {
                    case 13:
                        groupper.emptyInput();
                        setTimeout(function() {groupper.draw();}, 100);
                        break;
                    default:
                        break;
                };
            }).on('focusout', '.groupper-input-addname', function(event) {
                event.stopPropagation();
                let nid = $(this).attr('data-nid');
                if (nid) {
                    groupper.unselectItem();
                }
            }).on('click', '.groupper-name-remove', function(event) {
                event.stopPropagation();
                let nid = $(this).closest('[data-nid]').attr('data-nid');
                groupper.removeName(nid);
                groupper.draw();
            }).on('click', '.groupper-menubutton', function(event) {
                event.stopPropagation();
                groupper.toggleMenu();
            }).on('click', '.groupper-shufflebutton', function(event) {
                event.stopPropagation();
                groupper.shuffle();
                groupper.draw();
            }).on('click', '.groupper-sortbutton', function(event) {
                event.stopPropagation();
                groupper.sort();
                groupper.draw();
            }).on('click', '.groupper-printbutton', function(event) {
                event.stopPropagation();
                groupper.print();
            }).on('click', '.groupper-newbutton', function(event) {
                event.stopPropagation();
                groupper.newDocument();
            }).on('click', '.groupper-openbutton', function(event) {
                event.stopPropagation();
                groupper.openOpenDialog();
            }).on('click', '.groupper-savebutton', function(event) {
                event.stopPropagation();
                groupper.openSaveDialog();
            }).on('click', '.groupper-copybutton', function(event) {
                event.stopPropagation();
                groupper.openCopyDialog();
            }).on('click', '.groupper-pastebutton', function(event) {
                event.stopPropagation();
                groupper.openPasteDialog();
            }).on('click', '.groupper-grouplist-listitem', function(event) {
                event.stopPropagation();
                let nid = $(this).attr('data-nid');
                groupper.selectItem(nid);
            }).on('change', '.groupper-settings-input-lang', function(event) {
                event.stopPropagation();
                let lang = $(this).val();
                groupper.setLang(lang);
            }).on('change', '.groupper-settings-input-mode', function(event) {
                event.stopPropagation();
                let mode = $(this).val();
                groupper.setMode(mode);
            }).on('change', '.groupper-input-modevalue', function(event) {
                event.stopPropagation();
                let mode = $(this).attr('data-mode');
                let value = $(this).val();
                groupper.setModevalue(mode, value);
            });
        }
    }

    Groupper.prototype._gmodes = ['minsize', 'maxsize', 'amount'];

    Groupper.prototype._defaults = {
        amount: 4,
        size: 4,
        mode: 'minsize'
    };

    Groupper.prototype._styles = `
        <style type="text/css" id="groupperstyles">
            :root {
                --pscolor-bgmain:    #eee;
                --pscolor-bgwhite:   #fff;
                --pscolor-fgmain:    #800066;
                --pscolor-fgdark:    #550044;
                --pscolor-textdark:  #331122;
                --pscolor-textlight: #eee;
                --pscolor-paletext:  #888;
                --pscolor-transbgdark:  rgba(0,0,0,0.2);
                --pscolor-transbglight: rgba(255,255,255,0.2);
                --psfonts-main:      "Source Sans Pro", "Open Sans", Helvetica, Arial, sans-serif;
            }
            html {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
            body.groupper-wrapper {
                margin: 0;
                padding: 0;
                position: relative;
                height: 100vh;
                max-height: 100vh;
            }
            .groupper-wrapper {
                display: grid;
                grid-template-areas:
                    "header header"
                    "menu   body"
                    "menu footer";
                grid-template-rows: auto 1fr auto;
                grid-template-columns: auto 1fr;
                background: var(--pscolor-bgmain);
                color: var(--pscolor-textdark);
                font-family: var(--psfonts-main);
                transition: grid-template-columns 0.3s;
                scrollbar-color: var(--pscolor-fgmain);
                scrollbar-width: thin;
            }
            .groupper-wrapper ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            .groupper-wrapper ::-webkit-scrollbar-track {
                background: var(--pscolor-transbglight);
            }
            .groupper-wrapper ::-webkit-scrollbar-thumb {
                background: var(--pscolor-fgmain);
                border-radius: 3px;
            }
            .groupper-wrapper ::-webkit-scrollbar-thumb:hover {
                background: var(--pscolor-fgdark);
            }
            .groupper-header {
                grid-area: header;
                background: var(--pscolor-fgmain);
                color: var(--pscolor-textlight);
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 0 3px 3px var(--pscolor-fgdark);
                z-index: 2;
            }
            .groupper-header svg .mini-icon-foreground {
                fill: var(--pscolor-textlight);
            }
            .groupper-header-buttons {
                display: flex;
                flex-flow: row nowrap;
                padding: 2px;
            }
            .groupper-header-buttons .groupper-button {
                margin: 0.1em 0.3em;
                flex-shrink: 0;
                flex-grow: 0;
            }
            .groupper-footer {
                grid-area: footer;
                background: var(--pscolor-fgmain);
                color: var(--pscolor-textlight);
                display: flex;
                flex-flow: row nowrap;
                padding: 0.5em;
                justify-content: space-around;
                z-index: 0;
                position: sticky;
                bottom: 0;
            }
            .groupper-footer svg .mini-icon-foreground {
                fill: var(--pscolor-textlight);
            }
            .groupper-input {
                flex-grow: 1;
                flex-shrink: 0;
            }
            .groupper-input input {
                box-sizing: border-box;
                width: 100%;
                font-size: 120%;
                font-weight: bold;
                color: var(--pscolor-fgdark);
            }
            .groupper-input-modevalue {
                text-align: center;
            }
            .groupper-menu {
                grid-area: menu;
                background: var(--pscolor-fgmain);
                color: var(--pscolor-textlight);
                overflow-x: hidden;
                overflow-y: auto;
                width: 0;
                transition: width 0.3s;
                z-index: 1;
                display: flex;
                flex-flow: column nowrap;
                justify-content: flex-start;
                align-items: flex-end;
            }
            .groupper-menuopen .groupper-menu {
                width: 400px;
                box-shadow: 0 0 3px 3px var(--pscolor-fgdark);
            }
            .groupper-body {
                grid-area: body;
                overflow: auto;
                padding-bottom: 3em;
            }
            .groupper-button {
                cursor: pointer;
            }

            .groupper-input {
                padding: 0.2em 0.5em;
            }
            .groupper-grouplists-block {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-content: flex-start;
            }
            .groupper-grouplist {
                background: var(--pscolor-bgwhite);
                padding: 0.5em;
                border-radius: 0.5em;
                box-shadow: 0 0 6px rgba(0,0,0,0.5), 0 0 0 1px var(--pscolor-fgmain, black);
                margin: 1em;
                min-width: 14em;
            }
            .groupper-grouplist-title {
                margin: 0;
                font-size: 120%;
                font-weight: bold;
                text-align: center;
                color: var(--pscolor-fgmain, black);
                border-bottom: 1px solid var(--pscolor-fgmain, black);
            }
            .groupper-grouplist-list {
                margin: 0.1em 0;
                padding: 0 0 0 1em;
            }
            .groupper-grouplist-listitem {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                margin: 1px;
            }
            .groupper-grouplist-listitem:hover {
                background: var(--pscolor-bgmain);
            }
            .groupper-grouplist-listitem.groupper-selecteditem {
                background: var(--pscolor-bgmain);
                box-shadow: 0 0 0 1px var(--pscolor-fgmain);
            }
            .groupper-name {
                flex-grow: 1;
                flex-shrink: 0;
            }
            .groupper-name-remove {
                flex-grow: 0;
                flex-shrink: 0;
                opacity: 0.1;
                transition: opacity 0.2s;
            }
            .groupper-grouplist-listitem:hover .groupper-name-remove {
                opacity: 1;
            }
            .groupper-name-remove svg {
                height: 0.8em;
                width: auto;
            }

            .groupper-menubutton svg path {
                opacity: 1;
                transform: scale(1) rotate(0deg);
                transition: opacity 0.4s, transform 0.4s;
            }
            .groupper-menuopen .groupper-menubutton svg path.mini-icon-hamburger-sides {
                transform: scale(0);
                opacity: 0;
            }
            .groupper-menuopen .groupper-menubutton svg path.mini-icon-hamburger-middle1 {
                transform: rotate(45deg);
            }
            .groupper-menuopen .groupper-menubutton svg path.mini-icon-hamburger-middle2 {
                transform: rotate(-45deg);
            }

            .groupper-settings {
                width: 400px;
            }
            .groupper-settings-box {
                margin: 1em;
            }

            /**
             * Buttons, radiobuttons,...
             */
            .groupper-buttonbar {
                display: flex;
                flex-flow: row nowrap;
                margin: 0.5em;
                padding: 0;
                border: 1px solid var(--pscolor-textlight);
                border-radius: 0.5em;
                color: var(--pscolor-textlight);
                background: var(--pscolor-fgmain);
                overflow: hidden;
                user-select: none;
            }
            .groupper-buttonbar label {
                margin: 0;
                padding: 0;
                outline: none;
                flex-grow: 1;
                flex-shrink: 0;
            }
            .groupper-buttonbar label input[type="radio"]{
                display: none;
            }
            .groupper-buttonbar label input[type="radio"] + .groupper-radiobutton {
                background: var(--pscolor-fgmain);
                padding: 0.2em;
                border-left: 1px solid var(--pscolor-textlight);
                border-right: 1px solid var(--pscolor-textlight);
                display: block;
                text-align: center;
                font-weight: bold;
                cursor: pointer;
            }
            .groupper-buttonbar label:first-child input[type="radio"] + .groupper-radiobutton {
                border-left: none;
            }
            .groupper-buttonbar label:last-child input[type="radio"] + .groupper-radiobutton {
                border-right: none;
            }
            .groupper-buttonbar label input[type="radio"]:checked + .groupper-radiobutton {
                color: var(--pscolor-fgmain);
                background: var(--pscolor-textlight);
                padding: 0.2em 0;
                border-left: 1px solid var(--pscolor-textlight);
                border-right: 1px solid var(--pscolor-textlight);
            }

            .groupper-buttonbar .groupper-barbutton {
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                flex-grow: 1;
                padding: 0.2em;
                text-align: center;
                font-weight: bold;
                cursor: pointer;
            }
            .groupper-buttonbar .groupper-barbutton .groupper-buttonlabel {
                margin: 0.1em 0.5em;
            }
            .groupper-buttonbar .groupper-barbutton .groupper-buttonicon {
                margin: 0.1em 0.5em;
            }
            .groupper-buttonbar .groupper-barbutton svg .mini-icon-foreground {
                fill: var(--pscolor-textlight);
            }
            .groupper-buttonbar .groupper-barbutton:active {
                background: var(--pscolor-textlight);
                color: var(--pscolor-fgmain);
            }
            .groupper-buttonbar .groupper-barbutton:active svg .mini-icon-foreground {
                fill: var(--pscolor-fgmain);
            }

            @media only screen and (max-width: 700px) {
                .groupper-wrapper.groupper-menuopen {
                    grid-template-columns: 1fr 2em;
                }
                .groupper-menuopen .groupper-menu {
                    width: auto;
                }
                .groupper-menuopen .groupper-menu .groupper-settings {
                    margin: 0 auto;
                    width: auto;
                    max-width: 400px;
                }
                .groupper-menuopen .groupper-body {
                    overflow: hidden;
                }
                .groupper-menuopen .groupper-footer {
                    overflow: hidden;
                }

            }

            @media print {
                body.groupper-wrapper {
                    min-height: 0;
                }
                .groupper-wrapper {
                    display: block;
                    color: black;
                }
                .groupper-header,
                .groupper-footer,
                .groupper-menu {
                    display: none;
                }
                .groupper-name-remove {
                    display: none;
                }
                .groupper-grouplist {
                    background: white;
                    box-shadow: none;
                    border: 1px solid black;
                }
                .groupper-grouplist-title {
                    color: black;
                    border-bottom: 1px solid black;
                }
            }
        </style>
    `;

    class Names {
        constructor(data) {
            this._namelist = [];
            this._names = {};
            let now = (new Date()).getTime();
            this._metadata = {
                creator: 'anonymous',
                created: now,
                modifier: 'anonymous',
                modified: now
            };
            if (data) {
                this.initData(data);
            }
        }

        get count() {
            return this._namelist.length;
        }

        addName(text, nid) {
            if (nid && this._names[nid]) {
                this._names[nid].name = text;
            } else if (nid) {
                this._names[nid] = new NameItem(text, nid);
                this._namelist.push(nid);
            } else {
                let item = new NameItem(text);
                // Id of the name is generated asynchronously.
                // Hence the item must be saved after id is resolved.
                (async () => {
                    let nid = await item.getId();
                    this._namelist.push(nid);
                    this._names[nid] = item;
                })();
            }
        }

        removeName(nid) {
            if (this._names[nid]) {
                let index = this._namelist.indexOf(nid);
                if (index > -1) {
                    this._namelist.splice(index, 1);
                }
                delete this._names[nid];
            }
        }

        getNameById(nid) {
            return this._names[nid].name;
        }

        initData(data) {
            this._metadata = Object.assign(this._metadata, data.metadata);
            if (data.data) {
                let ndata = data.data;
                let namelist = ndata.namelist || [];
                let names = ndata.names || {};
                for (let nid of namelist) {
                    let item = names[nid];
                    if (item && item.name && item.id) {
                        this.addName(item.name, item.id);
                    }
                }
            }
        }

        shuffle() {
            this._namelist.sort((a, b) => Math.random() - 0.5);
            this._namelist.sort((a, b) => Math.random() - 0.5);
            this._namelist.sort((a, b) => Math.random() - 0.5);
            this._namelist.sort((a, b) => Math.random() - 0.5);
        }

        sort() {
            this._namelist.sort((a, b) => {
                let aname = this._names[a].name;
                let bname = this._names[b].name;
                return (aname <= bname ? -1 : 1);
            });
        }

        getAll() {
            return this._namelist.slice().map(nid => this.getNameById(nid));
        }

        getGroupsByMinSize(size) {
            let amount = Math.max(1, Math.floor(this.count / size));
            return this.getGroupsByAmount(amount);
        }

        getGroupsByMaxSize(size) {
            let amount = Math.ceil(this.count / size);
            return this.getGroupsByAmount(amount);
        }

        getGroupsByAmount(amount) {
            let minsize = Math.floor(this.count / amount);
            let remainder = this.count % amount;
            let result = [];
            let list = this._namelist.slice();
            for (let i = 0; i < remainder; i++) {
                let group = list.splice(0, minsize + 1).map(nid => {return {id: nid, name: this.getNameById(nid)};});
                result.push(group);
            }
            while (minsize > 0 && list.length > 0) {
                let group = list.splice(0, minsize).map(nid => {return {id: nid, name: this.getNameById(nid)};});
                result.push(group);
            }
            return result;
        }

        getData() {
            let result = {
                type: 'groupper',
                metadata: JSON.parse(JSON.stringify(this._metadata)),
                data: {
                    namelist: this._namelist.slice(),
                    names: JSON.parse(JSON.stringify(this._names))
                }
            }
            return result;
        }
    }

    PSTools.Names = Names;

    class NameItem {
        constructor(text, id) {
            this._name = text;
            if (id) {
                this._id = id;
            } else {
                this.getNewId();
            }
        }

        get name() {
            return this._name;
        }

        set name(name) {
            this._name = name;
        }

        get id() {
            return this._id;
        }

        async getId() {
            if (!this._id) {
                this._id = await this._idpromise;
            }
            return this._id;
        }

        getNewId() {
            let now = (new Date()).getTime();
            let rand = Math.random().toString();
            this._idpromise = PSTools.utils.sha1(this._name + '-' + now + rand);//.then(result => {this._id = result;});
        }

        toJSON() {
            return {
                id: this.id,
                name: this.name
            };
        }
    }

    PSTools.NameItem = NameItem;


    class PSDialog {
        constructor(place, options) {
            this._place = $(place);
            this._options = $.extend({}, this._defaults, options);
            this.setStyles();
        }

        get mode() {
            return this._options.mode;
        }

        show() {
            let modeOptions = this._availModes[this.mode];
            this._place.html(this.getTemplate('dialog', modeOptions));
            this.initHandlers();
            this.initFormHandlers();
        }

        close() {
            this._place.off();
            this._place.empty();
        }

        getTemplate(key, maps) {
            let result = '';
            switch (key) {
                case 'dialog':
                    result = `
                        <div class="psdialog-wrapper">
                            <div class="psdialog-window">
                                <div class="psdialog-window-header">
                                    <div class="psdialog-window-header-icon">
                                        ${maps.icon}
                                    </div>
                                    <div class="psdialog-window-header-title">
                                    ${PSTools.escapeHTML(localizer.localize(maps.title))}
                                    </div>
                                    <div class="psdialog-window-header-close psdialog-action" data-action="close">
                                        ${PSTools.icons.close}
                                    </div>
                                </div>
                                <div class="psdialog-window-body">
                                    ${this.getBody()}
                                </div>
                                <div class="psdialog-window-footer">
                                    <div class="psdialog-buttonbox"></div>
                                    <div class="psdialog-buttonbox">
                                        <a class="psdialog-button psdialog-action" data-action="cancel">
                                        ${PSTools.escapeHTML(localizer.localize('psdialog:cancel'))}
                                        </a>
                                        ${this.getTemplate(maps.name + 'ok', maps)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    break;
                case 'openok':
                    result = `
                        <label class="psdialog-button psdialog-action" data-action="ok">
                            <input type="file">
                            ${PSTools.escapeHTML(localizer.localize(maps.ok))}
                        </label>
                    `;
                    break;
                case 'saveok':
                case 'copyok':
                case 'pasteok':
                    result = `
                        <a class="psdialog-button psdialog-action" data-action="ok">
                        ${PSTools.escapeHTML(localizer.localize(maps.ok))}
                        </a>
                    `;
                    break;
                default:
                    break;
            }
            return result;
        }

        getBody() {
            const form = this._options.form;
            let html = [];
            for (let item of form) {
                switch (item.type) {
                    case 'preview':
                        html.push(this.getPreview(item));
                        break;
                    case 'text':
                        html.push(this.getText(item));
                        break;
                    case 'textinput':
                        html.push(this.getTextInput(item));
                        break;
                    case 'select':
                        html.push(this.getSelect(item));
                        break;
                    default:
                        break;
                }
            }
            return html.join('\n');
        }

        getPreview(item) {
            let result = `
                <div class="psdialog-preview" name="${PSTools.escapeHTML(item.name)}">
                ${PSTools.escapeHTML(item.update())}
                </div>
            `;
            return result;
        }

        getText(item) {
            let result = `
                <div class="psdialog-text" name="${PSTools.escapeHTML(item.name)}">
                ${PSTools.escapeHTML(localizer.localize(item.value))}
                </div>
            `;
            return result;
        }

        getTextInput(item) {
            let result = `
                <div class="psdialog-textinput">
                    <input type="text" class="psdialog-textinput-field" name="${PSTools.escapeHTML(item.name)}" value="${PSTools.escapeHTML(item.value)}">
                    <span class="psdialog-textinput-after">${PSTools.escapeHTML(item.after && item.after.value || '')}</span>
                </div>
            `;
            return result;
        }

        getSelect(item) {
            let result = `
                <div class="psdialog-select">
                    <select class="psdialog-select-field" name="${PSTools.escapeHTML(item.name)}">
                    ${item.options.map(op => '<option value="' + PSTools.escapeHTML(op.value) + '" '+(op.default ? 'selected' : '')+'>' + PSTools.escapeHTML(localizer.localize(op.label)) + '</option>').join('\n')}
                    </select>
                </div>
            `;
            return result;
        }

        getFormData() {
            const form = this._options.form || [];
            let result = {};
            for (let item of form) {
                switch (item.type) {
                    case 'textinput':
                        result[item.name] = this._place.find(`.psdialog-textinput-field[name="${PSTools.escapeHTML(item.name)}"]`).val();
                        break;
                    case 'select':
                        let val = this._place.find(`.psdialog-select-field[name="${PSTools.escapeHTML(item.name)}"]`).val();
                        let opt = item.options.find(op => op.value === val);
                        result[item.name] = JSON.parse(JSON.stringify(opt.data));
                        break;
                    default:
                        break;
                }
            }
            return result;
        }

        runAction(action, adata) {
            const actionfs = this._options.actions || {};
            switch (action) {
                case 'close':
                    this.close();
                    break;
                case 'cancel':
                    this.close();
                    break;
                case 'ok':
                    if (typeof(actionfs.onok) === 'function') {
                        actionfs.onok(adata);
                    }
                    break;
                default:
                    break;
            }
        }

        initHandlers() {
            const dialog = this;
            this._place.off();
            this._place.on('click', '.psdialog-action', function(event) {
                event.stopPropagation();
                const action = $(this).attr('data-action');
                let adata =  dialog.getFormData();
                adata.place = $(this);
                dialog.runAction(action, adata);
            }).on('change', '.psdialog-button input[type="file"]', function(event) {
                event.stopPropagation();
                let thefile = event.target.files[0];
                let filename = thefile.name;
                if (thefile.type === 'application/json' || thefile.type.substr(0,5) === 'text/' || thefile.type === '') {
                    let reader = new FileReader();
                    reader.onload = function(ev) {
                        let handler = dialog._options.openHandler;
                        if (typeof(handler) === 'function') {
                            handler({
                                filename: filename,
                                filetype: thefile.type,
                                filedata: ev.target.result
                            });
                        }
                    };
                    reader.readAsText(thefile);
                    $(this).val('');
                }
            });
        }

        initFormHandlers() {
            const dialog = this;
            const form = this._options.form;
            for (let item of form) {
                if (item.onchange) {
                    // What to do on change of this form item.
                    switch (item.type) {
                        case 'select':
                            this._place.on(`change.${item.name}`, `.psdialog-${PSTools.escapeHTML(item.type)}-field[name="${PSTools.escapeHTML(item.name)}"]`, function(event) {
                                event.stopPropagation();
                                let value = $(this).val();
                                let option = item.options.find(op => op.value === value);
                                $(this).trigger(`psdialog_${item.name}_changed`, [JSON.parse(JSON.stringify(option))])
                            });
                            break;
                        case 'textinput':
                            break;
                        default:
                            break;
                    }
                }
                if (item.updateon) {
                    switch (item.type) {
                        case 'preview':
                            this._place.on(`psdialog_${item.updateon}.${item.name}`, function(event, data) {
                                event.stopPropagation();
                                const place = $(this).find(`.psdialog-preview[name="${PSTools.escapeHTML(item.name)}"]`);
                                place.html(PSTools.escapeHTML(item.update(place, data)));
                            });
                            break;
                        case 'textinput':
                            this._place.on(`psdialog_${item.updateon}.${item.name}`, function(event, data) {
                                event.stopPropagation();
                                const place = $(this).find(`.psdialog-textinput-field[name="${PSTools.escapeHTML(item.name)}"]`);
                                item.update(place, data);
                            })
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        setStyles() {
            if ($('head style#psdialogstyles').length === 0) {
                $('head').append(this._styles);
            }
        }

    }

    PSDialog.prototype._availModes = {
        open: {
            name: 'open',
            title: 'psdialog:open',
            icon: PSTools.icons.open,
            ok: 'psdialog:open'
        },
        save: {
            name: 'save',
            title: 'psdialog:save',
            icon: PSTools.icons.save,
            ok: 'psdialog:save'
        },
        copy: {
            name: 'copy',
            title: 'psdialog:copy',
            icon: PSTools.icons.copy,
            ok: 'psdialog:copy'
        },
        paste: {
            name: 'paste',
            title: 'psdialog:paste',
            icon: PSTools.icons.paste,
            ok: 'psdialog:paste'
        }
    }

    PSDialog.prototype._defaults = {
        mode: 'open',
        previewAction: function() {},
        form: [],
        actions: {}
    }

    PSDialog.prototype._styles = `
        <style type="text/css" id="psdialogstyles">
            .psdialog-wrapper {
                position: fixed;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: 0;
                background: var(--pscolor-transbgdark, rgba(0,0,0,0.2));
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                z-index: 100;
            }
            .psdialog-window {
                background: var(--pscolor-bgmain);
                border: 2px solid var(--pscolor-fgmain);
                border-radius: 0.2em;
                min-width: 14em;
                min-height: 10em;
                max-height: 90%;
                box-shadow: 3px 3px 10px var(--pscolor-fgdark);
                display: grid;
                grid-template-areas:
                    "header"
                    "body"
                    "footer";
                grid-template-rows: auto 1fr auto;
                grid-template-columns: auto;
            }
            .psdialog-window-header {
                grid-area: header;
            }
            .psdialog-window-body {
                grid-area: body;
                overflow: auto;
            }
            .psdialog-window-footer {
                grid-area: footer;
            }
            .psdialog-window-header,
            .psdialog-window-footer {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                background: var(--pscolor-fgmain);
                color: var(--pscolor-textlight);
            }
            .psdialog-window-header svg {
                height: 1em;
                width: auto;
                margin: 0.1em;
            }
            .psdialog-window-header svg .mini-icon-foreground {
                fill: var(--pscolor-textlight);
            }
            .psdialog-buttonbox {
                display: flex;
                flex-flow: row nowrap;
                padding: 0.1em 0.2em;
            }
            .psdialog-button {
                border: 1px solid var(--pscolor-textlight);
                background: var(--pscolor-fgmain);
                color: var(--pscolor-textlight);
                padding: 0.2em 0.5em;
                border-radius: 0.2em;
                margin: 0 0.1em;
                user-select: none;
            }
            .psdialog-button svg .mini-icon-foreground {
                fill: var(--pscolor-textlight);
            }
            .psdialog-button:active {
                border: 1px solid var(--pscolor-textlight);
                background: var(--pscolor-textlight);
                color: var(--pscolor-fgmain);
            }
            .psdialog-button:active svg .mini-icon-foreground {
                fill: var(--pscolor-fgmain);
            }
            .psdialog-button input[type="file"] {
                display: none;
            }
            .psdialog-action {
                cursor: pointer;
            }

            .psdialog-preview {
                min-height: 4em;
                max-height: 15em;
                max-width: 30em;
                overflow: auto;
                font-size: 80%;
                font-family: monospace;
                white-space: pre-wrap;
                padding: 0.5em;
                background: var(--pscolor-bgwhite);
            }
            .psdialog-text {
                padding: 0.5em;
            }
            .psdialog-textinput {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                padding: 0.2em 0.4em;
            }
            .psdialog-textinput-field {
                border: 1px solid var(--pscolor-fgmain);
                border-radius: 0.2em;
                flex-grow: 1;
                flex-shrink: 0;
            }
            .psdialog-textinput-after {
                color: var(--pscolor-paletext);
                flex-grow: 0;
                flex-shrink: 0;
            }
        </style>
    `;

    PSTools.PSDialog = PSDialog;

    PSTools.utils = {
        hash: async function hash(message, hashtype) {
            const text_encoder = new TextEncoder;
            const data = text_encoder.encode(message);
            const digest = await window.crypto.subtle.digest(hashtype, data);
            return digest;
        },
        in_hex: function in_hex(data) {
            const octets = new Uint8Array(data);
            const hex = [].map.call(octets, octet => octet.toString(16).padStart(2, "0")).join("");
            return hex;
        },
        sha512: async function(message) {
            return await PSTools.utils.in_hex(await PSTools.utils.hash(message, 'SHA-512'));
        },
        sha384: async function(message) {
            return await PSTools.utils.in_hex(await PSTools.utils.hash(message, 'SHA-384'));
        },
        sha256: async function(message) {
            return await PSTools.utils.in_hex(await PSTools.utils.hash(message, 'SHA-256'));
        },
        sha1: async function sha1(message) {
            return await PSTools.utils.in_hex(await PSTools.utils.hash(message, 'SHA-1'));
        }
    }

    class Localizer {
        constructor(lang) {
            this._dict = {
                en: {}
            };
            this._lang = lang || 'en'
        }

        get lang() {
            return this._lang;
        }

        set lang(lang) {
            if (this.hasLang(lang)) {
                this._lang = lang;
            }
        }

        get languages() {
            return Object.keys(this._dict);
        }

        hasLang(lang) {
            return this.languages.includes(lang);
        }

        selectLang(langs) {
            langs = langs || [];
            if (Array.isArray(langs)) {
                for (let lang of langs) {
                    if (this.hasLang(lang)) {
                        this.lang = lang;
                        break;
                    }
                }
            }
        }

        addTerms(terms) {
            for (let lang of Object.keys(terms)) {
                if (!this._dict[lang]) {
                    this._dict[lang] = {};
                }
                let ldict = this._dict[lang];
                let lterms = terms[lang];
                for (let key of Object.keys(lterms)) {
                    ldict[key] = lterms[key];
                }
            }
        }

        localize(key, lang) {
            lang = (lang && this.hasLang(lang) ? lang : this.lang);
            let ldict = this._dict[lang];
            return ldict[key] || this._dict.en[key] || key;
        }
    }

    var langs = navigator.languages;
    var localizer = new Localizer();
    localizer.selectLang(langs);
    window.localizer = localizer;

    PSTools.Localizer = Localizer;

    localizer.addTerms({
        en: {
            'groupper:title': 'Groupper',
            'groupper:group': 'Group',
            'groupper:add_placeholder': 'Write text',
            'groupper:language': 'Language',
            'en': 'English',
            'fi': 'Suomi',
            'groupper:rule': 'Rule',
            'groupper:minsize': 'Min size',
            'groupper:maxsize': 'Max size',
            'groupper:amount': 'Groups',
            'groupper:actions': 'Actions',
            'groupper:empty': 'Empty',
            'groupper:save': 'Save',
            'groupper:open': 'Open',
            'groupper:copy': 'Copy',
            'groupper:paste': 'Paste',
            'groupper:print': 'Print',
            'groupper:json-file': 'Groupper (JSON)',
            'groupper:markdown-file': 'Markdown text (md)',
            'groupper:csv-file': 'Spreadsheet (csv)',
            'groupper:open_instruction': 'Click "Open" and select the file.',
            'psdialog:ok': 'OK',
            'psdialog:cancel': 'Cancel',
            'psdialog:open': 'Open',
            'psdialog:save': 'Save',
            'psdialog:copy': 'Copy',
            'psdialog:paste': 'Paste'
        },
        fi: {
            'groupper:title': 'Ryhmittelijä',
            'groupper:group': 'Ryhmä',
            'groupper:add_placeholder': 'Lisää teksti',
            'groupper:language': 'Kieli',
            'en': 'English',
            'fi': 'Suomi',
            'groupper:rule': 'Sääntö',
            'groupper:minsize': 'Vähintään',
            'groupper:maxsize': 'Enintään',
            'groupper:amount': 'Ryhmiä',
            'groupper:actions': 'Toiminnot',
            'groupper:print': 'Tulosta',
            'groupper:json-file': 'Ryhmittelijä (JSON)',
            'groupper:markdown-file': 'Markdown teksti (md)',
            'groupper:csv-file': 'Taulukko (csv)',
            'groupper:open_instruction': 'Klikkaa "Avaa" ja valitse tiedosto.',
            'psdialog:ok': 'OK',
            'psdialog:cancel': 'Peruuta',
            'groupper:empty': 'Tyhjennä',
            'psdialog:open': 'Avaa',
            'psdialog:save': 'Tallenna',
            'psdialog:copy': 'Kopioi',
            'psdialog:paste': 'Liitä'
        }
    });

    PSTools.Groupper = Groupper;

    return PSTools;

})(PSTools || {}, window, jQuery);

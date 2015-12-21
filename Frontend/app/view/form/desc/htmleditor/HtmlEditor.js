/**
 * Редактор html, использующийся в форме описания.
 * Перезаписывает методы стандартного редактора, чтобы извлечь из него кнопку underline.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.htmleditor.HtmlEditor',
	{
		extend: 'Ext.form.field.HtmlEditor',
		xtype: 'form-desc-htmleditor',
		enableColors: false,
		enableAlignments: false,
		enableFont: false,
		enableFontSize: false,
		enableLists: false,
		height: 150,

		getValues: function (d)
		{
			var me = this,
				val = me.getValue(),
				data = d;

			if (val)
			{
				val = val.replace(/<b>/gi, '<strong>');
				val = val.replace(/<\/b>/gi, '</strong>');
				val = val.replace(/<i>/gi, '<em>');
				val = val.replace(/<\/i>/gi, '</em>');
				val = val.replace(/<div>/gi, '<p>');
				val = val.replace(/<\/div>/gi, '</p>');
				//console.log('val1', val);
				val = val.split('<p>');
				//console.log('val2', val);
				val[0] = '<p>' + val[0] + '</p>';
				val = val.join('<p>');
				val = val.replace(/<p><\/p>/gi, '');
				//console.log('val3', val);
				val = val.replace(/<p><br><\/p>/gi, '<br/>');
				val = val.replace(/^<br\/>/gi, '<p></p>');
				val = val.replace(/&nbsp;/gi, '&#160;');
				data[me.name] = val;
			}

			return data;
		},

		/**
		 * Перезаписан стандартный метод.
		 */
		getToolbarCfg: function(){
			var me = this,
				items = [], i,
				tipsEnabled = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled(),
				baseCSSPrefix = Ext.baseCSSPrefix,
				fontSelectItem, undef;

			function btn(id, toggle, handler){
				return {
					itemId: id,
					cls: baseCSSPrefix + 'btn-icon',
					iconCls: baseCSSPrefix + 'edit-'+id,
					enableToggle:toggle !== false,
					scope: me,
					handler:handler||me.relayBtnCmd,
					clickEvent: 'mousedown',
					tooltip: tipsEnabled ? me.buttonTips[id] || undef : undef,
					overflowText: me.buttonTips[id].title || undef,
					tabIndex: -1
				};
			}


			if (me.enableFont && !Ext.isSafari2) {
				fontSelectItem = Ext.widget('component', {
					itemId: 'fontSelect',
					renderTpl: [
							'<select id="{id}-selectEl" data-ref="selectEl" class="' + baseCSSPrefix + 'font-select">',
							'</select>'
					],
					childEls: ['selectEl'],
					afterRender: function() {
						me.fontSelect = this.selectEl;
						Ext.Component.prototype.afterRender.apply(this, arguments);
					},
					onDisable: function() {
						var selectEl = this.selectEl;
						if (selectEl) {
							selectEl.dom.disabled = true;
						}
						Ext.Component.prototype.onDisable.apply(this, arguments);
					},
					onEnable: function() {
						var selectEl = this.selectEl;
						if (selectEl) {
							selectEl.dom.disabled = false;
						}
						Ext.Component.prototype.onEnable.apply(this, arguments);
					},
					listeners: {
						change: function() {
							me.win.focus();
							me.relayCmd('fontName', me.fontSelect.dom.value);
							me.deferFocus();
						},
						element: 'selectEl'
					}
				});

				items.push(
					fontSelectItem,
					'-'
				);
			}

			if (me.enableFormat) {
				items.push(
					btn('bold'),
					btn('italic')
				);
			}

			if (me.enableFontSize) {
				items.push(
					'-',
					btn('increasefontsize', false, me.adjustFont),
					btn('decreasefontsize', false, me.adjustFont)
				);
			}

			if (me.enableColors) {
				items.push(
					'-', {
						itemId: 'forecolor',
						cls: baseCSSPrefix + 'btn-icon',
						iconCls: baseCSSPrefix + 'edit-forecolor',
						overflowText: me.buttonTips.forecolor.title,
						tooltip: tipsEnabled ? me.buttonTips.forecolor || undef : undef,
						tabIndex:-1,
						menu: Ext.widget('menu', {
							plain: true,

							items: [{
								        xtype: 'colorpicker',
								        allowReselect: true,
								        focus: Ext.emptyFn,
								        value: '000000',
								        plain: true,
								        clickEvent: 'mousedown',
								        handler: function(cp, color) {
									        me.relayCmd('forecolor', Ext.isWebKit || Ext.isIE ? '#'+color : color);
									        this.up('menu').hide();
								        }
							        }]
						})
					}, {
						itemId: 'backcolor',
						cls: baseCSSPrefix + 'btn-icon',
						iconCls: baseCSSPrefix + 'edit-backcolor',
						overflowText: me.buttonTips.backcolor.title,
						tooltip: tipsEnabled ? me.buttonTips.backcolor || undef : undef,
						tabIndex:-1,
						menu: Ext.widget('menu', {
							plain: true,

							items: [{
								        xtype: 'colorpicker',
								        focus: Ext.emptyFn,
								        value: 'FFFFFF',
								        plain: true,
								        allowReselect: true,
								        clickEvent: 'mousedown',
								        handler: function(cp, color) {
									        if (Ext.isGecko) {
										        me.execCmd('useCSS', false);
										        me.execCmd('hilitecolor', '#'+color);
										        me.execCmd('useCSS', true);
										        me.deferFocus();
									        } else {
										        me.relayCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isWebKit || Ext.isIE || Ext.isOpera ? '#'+color : color);
									        }
									        this.up('menu').hide();
								        }
							        }]
						})
					}
				);
			}

			if (me.enableAlignments) {
				items.push(
					'-',
					btn('justifyleft'),
					btn('justifycenter'),
					btn('justifyright')
				);
			}

			if (!Ext.isSafari2) {
				if (me.enableLinks) {
					items.push(
						'-',
						btn('createlink', false, me.createLink)
					);
				}

				if (me.enableLists) {
					items.push(
						'-',
						btn('insertorderedlist'),
						btn('insertunorderedlist')
					);
				}
				if (me.enableSourceEdit) {
					items.push(
						'-',
						btn('sourceedit', true, function(){
							me.toggleSourceEdit(!me.sourceEditMode);
						})
					);
				}
			}

			// Everything starts disabled.
			for (i = 0; i < items.length; i++) {
				if (items[i].itemId !== 'sourceedit') {
					items[i].disabled = true;
				}
			}

			// build the toolbar
			// Automatically rendered in Component.afterRender's renderChildren call
			return {
				xtype: 'toolbar',
				defaultButtonUI: me.defaultButtonUI,
				cls: Ext.baseCSSPrefix + 'html-editor-tb',
				enableOverflow: true,
				items: items,

				// stop form submits
				listeners: {
					click: function(e){
						e.preventDefault();
					},
					element: 'el'
				}
			};
		},

		/**
		 * Перезаписан стандартный метод.
		 */
		updateToolbar: function() {
			var me = this,
				i, l, btns, doc, name, queriedName, fontSelect,
				toolbarSubmenus;

			if (me.readOnly) {
				return;
			}

			if (!me.activated) {
				me.onFirstFocus();
				return;
			}

			btns = me.getToolbar().items.map;
			doc = me.getDoc();

			function updateButtons() {
				var state;

				for (i = 0, l = arguments.length, name; i < l; i++) {
					name  = arguments[i];

					// Firefox 18+ sometimes throws NS_ERROR_INVALID_POINTER exception
					// See https://sencha.jira.com/browse/EXTJSIV-9766
					try {
						state = doc.queryCommandState(name);
					}
					catch (e) {
						state = false;
					}

					btns[name].toggle(state);
				}
			}
			if(me.enableFormat){
				updateButtons('bold', 'italic');
			}
			me.syncValue();
		}
	}
);
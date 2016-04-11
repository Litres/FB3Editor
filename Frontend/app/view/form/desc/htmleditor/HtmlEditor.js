/**
 * Редактор html, использующийся в форме описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.htmleditor.HtmlEditor',
	{
		extend: 'Ext.form.field.HtmlEditor',
		requires: [
			'FBEditor.view.form.desc.htmleditor.HtmlEditorController'
		],
		controller: 'form.desc.htmleditor',
		xtype: 'form-desc-htmleditor',

		enableColors: false,
		enableAlignments: false,
		enableFont: false,
		enableFontSize: false,
		enableLists: false,
		height: 150,

		listeners: {
			paste: 'onPaste',
			beforeFieldCleaner: 'onBeforeFieldCleaner',
			afterFieldCleaner: 'onAfterFieldCleaner'
		},

		plugins: [
			{
				ptype: 'fieldCleaner',
				toLowerCase: false,
				capitalize: false,
				style: 'top: -8px; right: 5px'
			}
		],

		/**
		 * @property {Array} Список разрешенных тегов.
		 */
		allowTags: ['strong', 'em', 'a', 'br', 'p'],

		/**
		 * @property {Array} Список блочных тегов, которые будут заменены на p.
		 */
		blockTags: ['address', 'article', 'aside', 'audio', 'blockquote', 'caption', 'dd', 'details', 'div', 'fieldset',
		            'figcaption', 'form', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
		            'legend', 'li', 'meter', 'output', 'pre', 'summary', 'td', 'th'],

		/**
		 * @property {String} Значение по умолчанию для пустого поля.
		 */
		emptyValue: '<p><br/></p>',

		afterRender: function ()
		{
			var me = this,
				iframeEl;

			me.callParent(arguments);

			// добавляем возможность отслеживания события вставки paste
			iframeEl = me.iframeEl.dom;
			iframeEl.addEventListener(
				'load',
				function ()
				{
					var doc = this.contentWindow.document,
						body = doc.body;

					body.addEventListener(
						'paste',
						function (data)
						{
							Ext.defer(
								function ()
								{
									me.fireEvent('paste', data);
								},
							    1
							);
						}
					);
				}
			);
		},

		/**
		 * Приводит в порядок теги согласно схеме.
		 */
		cleanTags: function ()
		{
			var me = this,
				val = me.getValue(),
				reg;

			function replacer (str, slash, tag, attr)
			{
				//console.log(arguments);
				if (Ext.Array.contains(me.blockTags, tag))
				{
					// заменяем блочный тег на p
					str = slash ? '</p>' : '<p>';
				}
				else if (!Ext.Array.contains(me.allowTags, tag))
				{
					// удаляем неразрешенный тег
					str = '';
				}
				else if (attr)
				{
					// корректируем аттрибуты
					attr = attr.match(/href=".*?"/);
					attr = attr ? ' ' + attr[0] : '';
					str = '<' + tag + attr + '>';
				}

				return str;
			}

			reg = new RegExp('<(/)?(.*?)( .*?|/)?>', 'ig');
			val = val.replace(reg, replacer);
			val = /^<p>/.test(val) ? val : '<p>' + val + '</p>';
			val = val.replace(/> </gi, '>&nbsp;<');
			val = val.replace(/[ ]{2}/gi, ' &nbsp;');

			// оборачиваем текст в p
			val = val.replace(
				/<\/p>(.*?)<p>/gi,
			    function (str, text)
			    {
				    str = text && !/(<br\/?>)+/.test(text)  ? '</p><p>' + text + '</p><p>' : str;

				    return str;
			    }
			);

			// пустые строки
			val = val.replace(/<p><\/p>|<p><br\/?><\/p>/gi, '<br>');
			val = val.replace(/^(<br\/?>)+/gi, '');

			me.setValue(val);
		},

		getValues: function (d)
		{
			var me = this,
				data = d;

			data[me.name] = me.normalizeValue();

			return data;
		},

		/**
		 * Нормализует значение.
		 * @return {String}
		 */
		normalizeValue: function ()
		{
			var me = this,
				val = me.getValue();

			if (val)
			{
				// заменяем теги на разрешенные в схеме
				val = val.replace(/<b>/gi, '<strong>');
				val = val.replace(/<\/b>/gi, '</strong>');
				val = val.replace(/<i>/gi, '<em>');
				val = val.replace(/<\/i>/gi, '</em>');
				me.setValue(val);

				// вырезаем лишние теги
				me.cleanTags();

				val = me.getValue();

				// корректируем тег br для xml
				val = val.replace(/<br>/gi, '<br/>');

				// заменяем \n на тег br
				val = val.replace(/\n/gi, '<br/>');

				// корректируем сущности для xml
				val = val.replace(/&nbsp;/gi, '&#160;');
				val = val.replace(/&lt;/gi, '&#60;');
				val = val.replace(/&gt;/gi, '&#62;');

				me.setValue(val);

				if (/^<p><br\/><\/p>(<br\/?>)*$/gi.test(val))
				{
					// возвращаем пустое значение, если в поле только пустые абзацы
					val = '';
				}
			}

			return val;
		},

		setValue: function (val)
		{
			var me = this;

			// корректируем пустое значение
			val = val ? val : me.emptyValue;
			arguments[0] = val;
			me.callParent(arguments);
		},

		/**
		 * Перезаписан стандартный метод, чтобы извлечь из него кнопку underline.
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
		 * Перезаписан стандартный метод, чтобы извлечь из него кнопку underline.
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
		},

		/**
		 * Перезаписан стандартный метод.
		 */
		getDocMarkup: function() {
			var me = this,
				h = me.iframeEl.getHeight() - me.iframePad * 2;

			// добавлены стили
			return Ext.String.format(
				'<!DOCTYPE html>'
				+ '<html><head>'
				+ '<link rel="stylesheet" type="text/css" href="resources/css/htmleditor.css?_v=' + FBEditor.version + '">'
				+ '<style type="text/css">'
				+ (Ext.isOpera ? 'p{margin:0;}' : '')
				+ 'body{border:0;margin:0;padding:{0}px;direction:' + (me.rtl ? 'rtl;' : 'ltr;')
				+ (Ext.isIE8 ? Ext.emptyString : 'min-')
				+ 'height:{1}px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;cursor:text;'/* background-color:white; */
				+ (Ext.isIE ? '' : 'font-size:12px;font-family:{2}')
				+ '}</style></head><body></body></html>'
				, me.iframePad, h, me.defaultFont);
		},
		
		/*
		 * Перзаписан стандартный метод.
		 * Чтобы убрать белый бэкграунд в тестовом поле
		*/
		initEditor: function(){

			var me = this,
				dbody, ss, doc, docEl, fn;
	
			//Destroying the component during/before initEditor can cause issues.
			if (me.destroying || me.isDestroyed) {
				 return;
			}
	
			dbody = me.getEditorBody();
			ss = me.textareaEl.getStyle(['font-size', 'font-family', 'background-image', 'background-repeat', 'color']); // убрал 'background-color'
	
			ss['background-attachment'] = 'fixed'; // w3c
			dbody.bgProperties = 'fixed'; // ie
	
			Ext.DomHelper.applyStyles(dbody, ss);
	
			doc = me.getDoc();
			docEl = Ext.get(doc);
	
			if (docEl) {
				try {
					docEl.clearListeners();
				} catch(e) {}
	
				/*
				 * We need to use createDelegate here, because when using buffer, the delayed task is added
				 * as a property to the function. When the listener is removed, the task is deleted from the function.
				 * Since onEditorEvent is shared on the prototype, if we have multiple html editors, the first time one of the editors
				 * is destroyed, it causes the fn to be deleted from the prototype, which causes errors. Essentially, we're just anonymizing the function.
				 */
				fn = me.onEditorEvent.bind(me);
				docEl.on({
					mousedown: fn,
					dblclick: fn,
					click: fn,
					keyup: fn,
					delegated: false,
					buffer:100
				});
	
				// These events need to be relayed from the inner document (where they stop
				// bubbling) up to the outer document. This has to be done at the DOM level so
				// the event reaches listeners on elements like the document body. The effected
				// mechanisms that depend on this bubbling behavior are listed to the right
				// of the event.
				fn = me.onRelayedEvent;
				docEl.on({
					mousedown: fn, // menu dismisal (MenuManager) and Window onMouseDown (toFront)
					mousemove: fn, // window resize drag detection
					mouseup: fn,   // window resize termination
					click: fn,     // not sure, but just to be safe
					dblclick: fn,  // not sure again
					delegated: false,
					scope: me
				});
	
				if (Ext.isGecko) {
					docEl.on('keypress', me.applyCommand, me);
				}
	
				if (me.fixKeys) {
					docEl.on('keydown', me.fixKeys, me);
				}
				if (me.fixKeysAfter) {
					docEl.on('keyup', me.fixKeysAfter, me);
				}
	
				if (Ext.isIE9) {
					Ext.get(doc.documentElement).on('focus', me.focus, me);
				}
	
				// In old IEs, clicking on a toolbar button shifts focus from iframe
				// and it loses selection. To avoid this, we save current selection
				// and restore it.
				if (Ext.isIE8) {
					docEl.on('focusout', function() {
						me.savedSelection = doc.selection.type !== 'None' ? doc.selection.createRange() : null;
					}, me);
	
					docEl.on('focusin', function() {
						if (me.savedSelection) {
							me.savedSelection.select();
						}
					}, me);
				}
	
				// We need to be sure we remove all our events from the iframe on unload or we're going to LEAK!
				Ext.getWin().on('beforeunload', me.beforeDestroy, me);
				doc.editorInitialized = true;
	
				me.initialized = true;
				me.pushValue();
				me.setReadOnly(me.readOnly);
				me.fireEvent('initialize', me);
			}
		}
		
	}
);
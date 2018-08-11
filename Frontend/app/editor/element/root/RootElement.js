/**
 * Корневой элемент.
 *
 * Это базовый класс для реализации конкретного корневого элемента.
 * Пример реализации смотрите в FBEditor.editor.element.fb3body.Fb3bodyElement.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.root.RootElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.root.RootElementController',
			'FBEditor.editor.element.root.RootElementControllerWebkit',
			'FBEditor.editor.element.root.RootSelection',
			'FBEditor.editor.element.root.RootSelectionWebKit'
		],

		controllerClass: 'FBEditor.editor.element.root.RootElementController',
		controllerClassWebkit: 'FBEditor.editor.element.root.RootElementControllerWebkit',
		selectionClass: 'FBEditor.editor.element.root.RootSelection',
		//selectionClassWebKit: 'FBEditor.editor.element.root.RootSelectionWebKit',

		xmlTag: 'root',
		htmlTag: 'main',
		cls: 'el-root',

		/**
		 * @property {Boolean} Признак корневого элемента.
		 */
		isRoot: true,

		/**
		 * @property {Object} Нативные обработчики событий браузера.
		 */
		customListeners: {
			keydown: 'onKeyDown',
			keyup: 'onKeyUp',
			keypress: 'onKeyPress',
			mouseup: 'onMouseUp',
			mousedown: 'onMouseDown',
			mousemove: 'onMouseMove',
			DOMNodeInserted: 'onNodeInserted',
			DOMNodeRemoved: 'onNodeRemoved',
			DOMCharacterDataModified: 'onTextModified',
			drop: 'onDrop',
			paste: 'onPaste',
			beforecopy: 'onBeforeCopy',
			copy: 'onCopy',
			beforecut: 'onBeforecut',
			cut: 'onCut',
			scroll: 'onScroll',
			focus: 'onFocus'
		},

		/**
		 * @private
		 * @property {FBEditor.editor.view.Editor} Редактор текста, которому принадлежит элемент.
		 */
		//editor: null,

		getXml: function (withoutText, withoutFormat)
		{
			var me = this,
				self = FBEditor.editor.element.AbstractElement,
				nl,
				xml;

			//self.countSpaces++;
			nl = withoutFormat ? '' : '\n';
			xml = nl + me.callParent(arguments);
			//self.countSpaces = 0;
            self.countSpaces = 1;

			return xml;
		},

		setAttributesHtml: function (element)
		{
			var me = this,
				el;

			el = me.callParent(arguments);

			// аттрибут необходим для возможности установить фокус на  корневой элемент при необходимости
			el.setAttribute('tabindex', 1);

			/*
			if (Ext.isWebKit)
			{
				// fix скролл WebKit, чтобы не тормозил на больших объёмах текста
				el.style.opacity = 0.9;
			}
			else
			{
				// устанавливаем редактируемость элемента
				el.setAttribute('contentEditable', true);
			}
			*/
			

			el.setAttribute('contentEditable', true);

			return el;
		},

		setEvents: function (element)
		{
			var me = this,
				listeners = me.customListeners;

			if (me.isRoot)
			{
				Ext.Object.each(
					listeners,
					function (eventName, funcName)
					{
						if (me.controller[funcName])
						{
							element.addEventListener(
								eventName,
								function (e)
								{
									me.controller[funcName](e);
								},
								false
							);
						}
					}
				);
			}

			return element;
		},

		getEditor: function ()
		{
			return this.editor;
		},

		/**
		 * Устанавливает связь элемента с редактором.
		 * @param {FBEditor.editor.view.Editor} editor Редактор текста, которому принадлежит элемент.
		 */
		setEditor: function (editor)
		{
			this.editor = editor;
		}
	}
);
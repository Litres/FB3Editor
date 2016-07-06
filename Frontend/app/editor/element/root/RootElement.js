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

		xmlTag: 'root',
		htmlTag: 'main',
		cls: 'el-root',

		/**
		 * @property {Boolean} Признак корневого элемента.
		 */
		isRoot: true,


		/**
		 * @private
		 * @property {FBEditor.editor.view.Editor} Редактор текста, которому принадлежит элемент.
		 */
		//editor: null,

		setAttributesHtml: function (element)
		{
			var me = this,
				el;

			el = me.callParent(arguments);

			// аттрибут необходим для возможности установить фокус на  корневой элемент при необходимости
			el.setAttribute('tabindex', 1);

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

			return el;
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
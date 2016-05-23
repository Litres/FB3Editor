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
			'FBEditor.editor.element.root.RootSelection',
			'FBEditor.editor.element.root.RootSelectionWebKit'
		],

		controllerClass: 'FBEditor.editor.element.root.RootElementController',
		selectionClass: 'FBEditor.editor.element.root.RootSelection',

		xmlTag: 'root',
		htmlTag: 'main',
		cls: 'el-root',

		/**
		 * @property {Boolean} Признак корневого элемента.
		 */
		isRoot: true,

		setAttributesHtml: function (element)
		{
			var me = this,
				el;

			el = me.callParent(arguments);

			if (Ext.isWebKit)
			{
				// fix скролл WebKit
				el.style.opacity = 0.9;
			}
			else
			{
				// устанавливаем редактируемость элемента
				el.setAttribute('contentEditable', true);
			}

			return el;
		}
	}
);
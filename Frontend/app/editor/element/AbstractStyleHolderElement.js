/**
 * Абстрактный класс элементов содержащих стилевые элементы.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractStyleHolderElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		cls: 'el-styleholder',

		isStyleHolder: true,
		isStyleType: true,
		showedOnTree: false,

		setAttributesHtml: function (element)
		{
			var me = this,
				el;

			el = me.callParent(arguments);

			// аттрибут необходим для возможности установить фокус на  корневой элемент при необходимости
			el.setAttribute('tabindex', -1);

			if (Ext.isWebKit)
			{
				// устанавливаем редактируемость элемента
				el.setAttribute('contentEditable', true);
			}

			return el;
		}
	}
);
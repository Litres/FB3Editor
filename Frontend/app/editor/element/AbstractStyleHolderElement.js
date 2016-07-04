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

			if (Ext.isWebKit)
			{
				// устанавливаем редактируемость элемента
				el.setAttribute('contentEditable', true);
			}

			return el;
		}
	}
);
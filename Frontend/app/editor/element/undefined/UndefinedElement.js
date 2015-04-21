/**
 * Неопределенный элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.undefined.UndefinedElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'undefined',
		xmlTag: 'undefined',
		cls: 'el-undefined',

		constructor: function ()
		{
			var me = this;

			me.callParent(arguments);
		}
	}
);
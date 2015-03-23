/**
 * Неопределенный элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.UndefinedElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		constructor: function ()
		{
			var me = this;

			me.style = 'border: 1px dashed red';
			me.callParent(arguments);
		}
	}
);
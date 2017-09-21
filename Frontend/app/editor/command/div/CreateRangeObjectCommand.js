/**
 * Создает div из выделения с объектом.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.div.CreateRangeObjectCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateRangeObjectCommand',

		elementName: 'div'
	}
);
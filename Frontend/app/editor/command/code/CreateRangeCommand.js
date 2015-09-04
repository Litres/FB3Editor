/**
 * Создает code из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.code.CreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateRangeStyleCommand',

		elementName: 'code'
	}
);
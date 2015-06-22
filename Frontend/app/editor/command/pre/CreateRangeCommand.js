/**
 * Создает pre из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.pre.CreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateRangeStyleCommand',

		elementName: 'pre'
	}
);
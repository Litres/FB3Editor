/**
 * Создает span из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.span.CreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateRangeStyleCommand',

		elementName: 'span'
	}
);
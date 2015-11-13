/**
 * Создает note из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.note.CreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateRangeStyleCommand',

		elementName: 'note'
	}
);
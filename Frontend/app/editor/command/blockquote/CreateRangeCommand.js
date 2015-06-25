/**
 * Создает blockquote из выделения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.blockquote.CreateRangeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateRangeCommand',

		elementName: 'blockquote'
	}
);
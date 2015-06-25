/**
 * Создает blockquote.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.blockquote.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateUnboundedCommand',

		elementName: 'blockquote'
	}
);
/**
 * Команда разделения blockquote.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.blockquote.SplitCommand',
	{
		extend: 'FBEditor.editor.command.AbstractSplitCommand',

		elementName: 'blockquote'
	}
);
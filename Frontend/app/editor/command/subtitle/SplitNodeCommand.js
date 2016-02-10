/**
 * Разбивает subtitle на два.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.subtitle.SplitNodeCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractSplitNodeCommand',

		elementName: 'subtitle'
	}
);
/**
 * Соединяет subtitle со следующим.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.subtitle.JoinNextNodeCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractJoinNextNodeCommand',

		elementName: 'subtitle'
	}
);
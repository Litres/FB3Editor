/**
 * Соединяет li со следующим.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.li.JoinNextNodeCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractJoinNextNodeCommand',

		elementName: 'li'
	}
);
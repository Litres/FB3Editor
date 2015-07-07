/**
 * Соединяет p предыдущим.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.JoinPrevNodeCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractJoinPrevNodeCommand',

		elementName: 'p'
	}
);
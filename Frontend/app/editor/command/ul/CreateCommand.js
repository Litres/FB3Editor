/**
 * Команда создания ul.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.ul.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateLiHolderCommand',

		elementName: 'ul'
	}
);
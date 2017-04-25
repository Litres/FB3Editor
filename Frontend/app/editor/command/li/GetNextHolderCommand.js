/**
 * Подтягивает li из следующего блока.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.li.GetNextHolderCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractGetNextHolderCommand',

		elementName: 'li'
	}
);
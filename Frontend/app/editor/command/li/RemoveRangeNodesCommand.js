/**
 * Удаляет выделенную часть текста в li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.li.RemoveRangeNodesCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractRemoveRangeNodesCommand',

		elementName: 'li'
	}
);
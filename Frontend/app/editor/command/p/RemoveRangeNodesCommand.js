/**
 * Удаляет выделенную часть текста в p.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.RemoveRangeNodesCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractRemoveRangeNodesCommand',

		elementName: 'p'
	}
);
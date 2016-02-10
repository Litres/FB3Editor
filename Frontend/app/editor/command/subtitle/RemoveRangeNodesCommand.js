/**
 * Удаляет выделенную часть текста в subtitle.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.subtitle.RemoveRangeNodesCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractRemoveRangeNodesCommand',

		elementName: 'subtitle'
	}
);
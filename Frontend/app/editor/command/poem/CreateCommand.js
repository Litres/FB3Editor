/**
 * Команда создания стиха poem, содержащего строфу stanza.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.poem.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateUnboundedCommand',

		elementName: 'poem'
	}
);
/**
 * Команда вставки строки сверху.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.InsertRowPrevCommand',
	{
		extend: 'FBEditor.editor.command.table.AbstractInsertRowCommand',

		insertRow: function (els, nodes)
		{
			els.parent.insertBefore(els.tr, els.node);
			nodes.parent.insertBefore(nodes.tr, nodes.node);
		}
	}
);
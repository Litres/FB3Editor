/**
 * Команда вставки строки снизу.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.InsertRowNextCommand',
	{
		extend: 'FBEditor.editor.command.table.AbstractInsertRowCommand',

		insertRow: function (els, nodes)
		{
			nodes.next = nodes.node.nextSibling;

			if (nodes.next)
			{
				els.next = nodes.next.getElement();
				els.parent.insertBefore(els.tr, els.next);
				nodes.parent.insertBefore(nodes.tr, nodes.next);
			}
			else
			{
				els.parent.add(els.tr);
				nodes.parent.appendChild(nodes.tr);
			}
		}
	}
);
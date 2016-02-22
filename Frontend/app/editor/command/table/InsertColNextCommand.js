/**
 * Команда вставки столбца справа.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.InsertColNextCommand',
	{
		extend: 'FBEditor.editor.command.table.AbstractInsertColCommand',

		insertCol: function (elTd, nodeNewTd, els, nodes)
		{
			var me = this,
				data = me.getData(),
				e = {},
				n = {};

			e.td = elTd;
			n.td = e.td.nodes[data.viewportId];
			n.newTd = nodeNewTd;
			e.newTd = n.newTd.getElement();
			n.tr = n.td.parentNode;
			e.tr = n.tr.getElement();
			n.next = n.td.nextSibling;

			if (n.next)
			{
				e.next = n.next.getElement();
				e.tr.insertBefore(e.newTd, e.next);
				n.tr.insertBefore(n.newTd, n.next);
			}
			else
			{
				e.tr.add(e.newTd);
				n.tr.appendChild(n.newTd);
			}

			els.p = els.table.first().children[els.pos + 1].first();
		}
	}
);
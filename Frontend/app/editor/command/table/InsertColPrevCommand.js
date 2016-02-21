/**
 * Команда вставки столбца слева.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.InsertColPrevCommand',
	{
		extend: 'FBEditor.editor.command.table.AbstractInsertColCommand',

		insertCol: function (elTd, newElTd, els, nodes)
		{
			var me = this,
				data = me.getData(),
				e = {},
				n = {};

			e.td = elTd;
			n.td = e.td.nodes[data.viewportId];
			e.newTd = newElTd;
			n.newTd = e.newTd.getNode(data.viewportId);
			n.tr = n.td.parentNode;
			e.tr = n.tr.getElement();

			e.tr.insertBefore(e.newTd, e.td);
			n.tr.insertBefore(n.newTd, n.td);

			els.p = els.table.first().children[els.pos].first();
		}
	}
);
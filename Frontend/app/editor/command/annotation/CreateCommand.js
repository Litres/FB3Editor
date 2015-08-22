/**
 * Создает аннотацию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.annotation.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				range = data.range,
				factory = FBEditor.editor.Factory;

			els.node = factory.createElement('annotation');
			nodes.parent = nodes.node.parentNode;
			nodes.first = nodes.parent.firstChild;
			els.parent = nodes.parent.getElement();

			if (range.collapsed)
			{
				els.p = factory.createElement('p');
				els.t = factory.createElementText('Аннотация');
				els.p.add(els.t);
				els.node.add(els.p);
			}

			nodes.node = els.node.getNode(data.viewportId);

			if (nodes.first)
			{
				// вставка после всех эпиграфов или заголовка
				nodes.next = nodes.first.nextSibling;
				while (nodes.next &&
				       (nodes.first.getElement().isEpigraph ||
				        nodes.first.getElement().isTitle))
				{
					nodes.first = nodes.next;
					nodes.next = nodes.next.nextSibling;
				}
				els.first = nodes.first.getElement();
				els.parent.insertBefore(els.node, els.first);
				nodes.parent.insertBefore(nodes.node, nodes.first);
			}
			else
			{
				els.parent.add(els.node);
				nodes.parent.appendChild(nodes.node);
			}

			if (!range.collapsed)
			{
				// переносим выделенный параграф в аннотацию

				nodes.p = range.start;
				els.p = nodes.p.getElement();
				els.isRoot = els.p.isRoot;
				while (els.p && !els.p.isP)
				{
					nodes.p = els.isRoot ? nodes.p.firstChild : nodes.p.parentNode;
					els.p = nodes.p ? nodes.p.getElement() : null;
				}

				nodes.next = nodes.p.nextSibling;

				els.node.add(els.p);
				nodes.node.appendChild(nodes.p);
			}

			me.data.nodes = nodes;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				range;

			try
			{
				range = data.range;

				if (range.collapsed)
				{
					return me.callParent(arguments);
				}

				manager.suspendEvent = true;

				nodes = data.nodes;
				els.node = nodes.node.getElement();
				els.parent = nodes.parent.getElement();
				els.p = nodes.p.getElement();

				// возвращаем параграф на старое место из аннотации
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parent.insertBefore(els.p, els.next);
					nodes.parent.insertBefore(nodes.p, nodes.next);
				}
				else
				{
					els.parent.add(els.p);
					nodes.parent.appendChild(nodes.p);
				}

				// удаляем аннотацию
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				nodes.cursor = manager.getDeepLast(nodes.p);
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: nodes.cursor.length
				};
				manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
		}
	}
);
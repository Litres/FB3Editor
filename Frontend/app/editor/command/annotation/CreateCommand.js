/**
 * Создает аннотацию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.annotation.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'annotation',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				range = data.range,
				factory = FBEditor.editor.Factory;

			els.node = factory.createElement(me.elementName);
			nodes.parent = nodes.node.parentNode;
			nodes.first = nodes.parent.firstChild;
			els.parent = nodes.parent.getElement();

			if (range.collapsed)
			{
				// содержимое по умолчанию
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
				// переносим выделенный параграф в элемент

				nodes.p = range.start;
				els.p = nodes.p.getElement();
				els.isRoot = els.p.isRoot;
				while (els.p && !els.p.isP)
				{
					nodes.p = els.isRoot ? nodes.p.firstChild : nodes.p.parentNode;
					els.p = nodes.p ? nodes.p.getElement() : null;
				}

				nodes.parentP = nodes.p.parentNode;
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
				manager,
				range;

			try
			{
				range = data.range;

				if (range.collapsed)
				{
					return me.callParent(arguments);
				}

				nodes = data.nodes;
				els.node = nodes.node.getElement();
				els.parent = nodes.parent.getElement();
				els.p = nodes.p.getElement();
				els.parentP = nodes.parentP.getElement();

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				// возвращаем параграф на старое место из элемента
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parentP.insertBefore(els.p, els.next);
					nodes.parentP.insertBefore(nodes.p, nodes.next);
				}
				else
				{
					els.parentP.add(els.p);
					nodes.parentP.appendChild(nodes.p);
				}

				// удаляем элемент
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				els.parent.sync(data.viewportId);

				manager.setSuspendEvent(false);

				// устанавливаем курсор
				nodes.cursor = manager.getDeepLast(nodes.p);
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: 0,
					endNode: nodes.cursor,
					endOffset: nodes.cursor.length
				};
				manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			return res;
		}
	}
);
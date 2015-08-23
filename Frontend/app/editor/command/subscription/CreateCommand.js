/**
 * Создает подпись.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.subscription.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'subscription',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				range = data.range,
				factory = FBEditor.editor.Factory;

			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.last = nodes.parent.lastChild;
			els.last = nodes.last ? nodes.last.getElement() : null;

			if (els.last && els.last.isSubscription)
			{
				// подпись уже существует
				throw Error('Subscription exists');
			}

			// создаем элемент
			els.node = factory.createElement(me.elementName);

			if (range.collapsed)
			{
				// содержимое по умолчанию
				els.p = factory.createElement('p');
				els.t = factory.createElementText('Подпись');
				els.p.add(els.t);
				els.node.add(els.p);
			}

			nodes.node = els.node.getNode(data.viewportId);

			// добавляем в конец
			els.parent.add(els.node);
			nodes.parent.appendChild(nodes.node);

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

				// возвращаем параграф на старое место из элемента
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

				// удаляем элемент
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

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
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
		}
	}
);
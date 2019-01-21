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
				factory = FBEditor.editor.Factory,
				viewportId = data.viewportId;

			els.parent = els.node.getParent();
			els.last = els.parent.last();

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

			// добавляем в конец
			els.parent.add(els.node, viewportId);

			if (!range.collapsed)
			{
				// переносим выделенный параграф в элемент

				nodes.p = range.start;
				els.p = nodes.p.getElement();
				els.isRoot = els.p.isRoot;
				while (els.p && !els.p.isP)
				{
					els.p = els.isRoot ? els.p.first() : els.p.getParent();
				}

				els.next = els.p.next();
				els.node.add(els.p, viewportId);
			}

			data.els = els;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els,
				viewportId,
				manager,
				helper,
				range;

			try
			{
				range = data.range;

				if (range.collapsed)
				{
					return me.callParent(arguments);
				}
				
				els = data.els;
				viewportId = data.viewportId;
				els.parent = els.node.getParent();
				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);

				// возвращаем параграф на старое место из элемента
				if (els.next)
				{
					els.parent.insertBefore(els.p, els.next, viewportId);
				}
				else
				{
					els.parent.add(els.p, viewportId);
				}

				// удаляем элемент
				els.parent.remove(els.node, viewportId);

				els.parent.sync(viewportId);

				// устанавливаем курсор
				els.last = els.p.getDeepLast();
				helper = els.last.getNodeHelper();
				nodes.cursor = helper.getNode();
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: 0,
					endNode: nodes.cursor,
					endOffset: els.last.getLength()
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
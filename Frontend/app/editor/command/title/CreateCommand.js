/**
 * Создает заголовок.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.title.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'title',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				opts = data.opts || {},
				range = data.range,
				factory = FBEditor.editor.Factory,
				viewportId,
				manager;

			viewportId = data.viewportId;
			manager = els.node.getManager();
			els.newNode = factory.createElement(me.elementName);

			if (opts.body)
			{
				// заголовок для всей книги
				els.parent = manager.getContent();
			}
			else
			{
				els.parent = nodes.node.getElement().parent;
				els.node = els.parent.hisName(me.elementName) ? els.parent : els.node;
				els.parent = els.node.parent;
			}

			if (range.collapsed)
			{
				// содержимое по умолчанию
				els.p = factory.createElement('p');
				els.t = factory.createElementText('Заголовок');
				els.p.add(els.t, viewportId);
			}

            els.first = els.parent.first();

            if (els.first)
			{
				els.parent.insertBefore(els.newNode, els.first, viewportId);
			}
			else
			{
				els.parent.add(els.newNode, viewportId);
			}

			if (!range.collapsed)
			{
				// переносим выделенный абзац в заголовок

				nodes.p = range.start;
				els.p = nodes.p.getElement();
				els.p = els.p.getStyleHolder();

				// для undo
				els.next = els.p.next();

				els.newNode.add(els.p, viewportId);
			}

			me.data.nodes = nodes;
            me.data.els = els;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				helper,
				viewportId,
				manager,
				range;

			try
			{
				range = data.range;

				if (range.collapsed)
				{
					return me.callParent(arguments);
				}

				viewportId = data.viewportId;
				nodes = data.nodes;
                els = data.els;
				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				// возвращаем параграф на старое место из элемента
				if (els.next)
				{
					els.oldParent = els.next.parent;
					els.oldParent.insertBefore(els.p, els.next, viewportId);
				}
				else
				{
					els.parent.add(els.p, viewportId);
				}

				// удаляем элемент
				els.parent.remove(els.newNode, viewportId);

				els.parent.sync(viewportId);

				// устанавливаем курсор
				els.cursor = els.p.getDeepLast(els.p);
				helper = els.cursor.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
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
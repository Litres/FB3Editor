/**
 * Абстрактная команда создания элемента из выделения с объектом.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateRangeObjectCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		/**
		 * @property {String} Имя элемента.
		 */
		elementName: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				manager,
				sel,
				collapsed,
				range,
				joinStartContainer,
				joinEndContainer;

			try
			{
				console.log('AbstractCreateRangeObjectCommand', data);
				
				return false;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.common).removeNext();
			}

			manager.setSuspendEvent(false);
			
			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager,
				range,
				viewportId;

			try
			{
				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;

				console.log('undo create range ' + me.elementName, range, nodes);

				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				// переносим все элементы обратно в исходный контейнер

				nodes.first = nodes.node.firstChild;
				els.first = nodes.first.getElement();

				while (els.first)
				{
					els.parent.insertBefore(els.first, els.node);
					nodes.parent.insertBefore(nodes.first, nodes.node);
					nodes.first = nodes.node.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
				}

				// удаляем новый элемент
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				// объединяем элементы в точках разделения
				if (range.joinStartContainer)
				{
					manager.joinNode(nodes.startContainer);
				}
				if (range.joinEndContainer)
				{
					manager.joinNode(nodes.endContainer);
				}

				// синхронизируем
				els.parent.sync(viewportId);

				// устанавливаем выделение
				if (!range.joinStartContainer)
				{
					range.start = nodes.startContainer;
					range.common = range.start.getElement().isText ? range.start.parentNode : range.start;
				}
				else
				{
					range.common = range.common.getElement().isText ? range.common.parentNode : range.common;
				}

				range.common = range.common ? range.common : range.prevParentStart.parentNode;
				range.start = range.start.parentNode ? range.start : range.prevParentStart.nextSibling;
				range.end = range.collapsed || !range.end.parentNode ? range.start : range.end;
				range.end = !range.collapsed && range.end.firstChild ? range.end.firstChild : range.end;

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end
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
		},

		/**
		 * Создает новый элемент.
		 * @param {Object} els
		 * @param {Object} nodes
		 */
		createNewElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory;

			els.node = factory.createElement(me.elementName);
			nodes.node = els.node.getNode(data.viewportId);

			// вставляем новый элемент
			els.common.insertBefore(els.node, els.startContainer);
			nodes.common.insertBefore(nodes.node, nodes.startContainer);

			// переносим элементы, которые находятся в текущем выделении в новый элемент

			nodes.next = nodes.startContainer;
			els.next = nodes.next.getElement();

			while (els.next && els.next.elementId !== els.endContainer.elementId)
			{
				nodes.buf = nodes.next.nextSibling;

				els.node.add(els.next);
				nodes.node.appendChild(nodes.next);

				nodes.next = nodes.buf;
				els.next = nodes.next ? nodes.next.getElement() : null;
			}

			if (els.next && els.next.elementId === els.endContainer.elementId && !data.range.joinEndContainer)
			{
				els.node.add(els.next);
				nodes.node.appendChild(nodes.next);
			}
		}
	}
);
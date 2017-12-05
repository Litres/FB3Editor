/**
 * Удаляет элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.DeleteCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				nodes = {},
				els = {},
				factory = FBEditor.editor.Factory,
				helper,
				manager,
				range;

			try
			{

				els.node = data.el;

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				range = data.range || manager.getRange();
				data.viewportId = range.start.viewportId;

				console.log('del el', data, range);

				helper = els.node.getNodeHelper();
				nodes.node = helper.getNode(data.viewportId);
				els.parent = els.node.parent;
				helper = els.parent.getNodeHelper();
				nodes.parent = helper.getNode(data.viewportId);
				nodes.next = nodes.node.nextSibling;
				els.next = nodes.next ? nodes.next.getElement() : null;
				nodes.prev = nodes.node.previousSibling;
				els.prev = nodes.prev ? nodes.prev.getElement() : null;

				// удаляем
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				nodes.first = nodes.parent.firstChild;

				if (!nodes.first)
				{
					// если в родительском элементе не осталось потомков, то вставляем в него пустой элемент

					if (els.parent.isStyleHolder)
					{
						els.empty = manager.createEmptyElement();
						els.newEl = els.empty;
					}
					else
					{
						// пустой параграф
						els.p = manager.createEmptyP();
						els.newEl = els.p;

						if (els.parent.isRoot)
						{
							// в корневом элементе должна быть хотя бы одна секция
							els.s = factory.createElement('section');
							els.s.add(els.p);
							els.newEl = els.s;
						}
					}

					nodes.newEl = els.newEl.getNode(data.viewportId);

					els.parent.add(els.newEl);
					nodes.parent.appendChild(nodes.newEl);
				}

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.setSuspendEvent(false);

				//console.log('del', nodes);

				// устанавливаем курсор
				nodes.cursor = nodes.newEl ? nodes.newEl : nodes.next;
				nodes.cursor = nodes.cursor ? nodes.cursor : nodes.prev;
				nodes.cursor = nodes.cursor ? nodes.cursor : nodes.parent;
				data.saveRange = {
					startNode: manager.getDeepFirst(nodes.cursor)
				};

				manager.setCursor(data.saveRange);

				// сохраняем
				data.els = els;
				data.range = range;

				// проверяем по схеме
				me.verifyElement(els.parent);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
			}

			manager.setSuspendEvent(false);
			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				nodes = {},
				els = {},
				res = false,
				helper,
				manager,
				range;

			try
			{
				range = data.range;
				els = data.els;

				manager = els.parent.getManager();
				manager.setSuspendEvent(true);

				helper = els.node.getNodeHelper();
				nodes.node = helper.getNode(data.viewportId);
				helper = els.parent.getNodeHelper();
				nodes.parent = helper.getNode(data.viewportId);

				console.log('undo del el', nodes, els, range);

				if (els.newEl)
				{
					// заменяем новый элемент на старый

					helper = els.newEl.getNodeHelper();
					nodes.newEl = helper.getNode(data.viewportId);
					nodes.parent.replaceChild(nodes.node, nodes.newEl);
					els.parent.replace(els.node, els.newEl);
				}
				else if (els.next)
				{
					// вставляем старый перед предыдущим

					helper = els.next.getNodeHelper();
					nodes.next = helper.getNode(data.viewportId);
					els.parent.insertBefore(els.node, els.next);
					nodes.parent.insertBefore(nodes.node, nodes.next);
				}
				else
				{
					// добавляем старый
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}

				els.parent.sync(data.viewportId);

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					focusElement: els.node
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
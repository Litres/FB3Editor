/**
 * Преобразует элемент в текст, оставляя только стилевые элементы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.ConvertToTextCommand',
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
				manager,
				sch,
				range;

			try
			{

				manager = data.el.getManager();
				manager.setSuspendEvent(true);
				sch = manager.getSchema();

				range = data.range || manager.getRange();
				data.viewportId = range.start.viewportId;

				console.log('convert ' + data.el.getName() + ' to text ', data);

				els.node = data.el;
				nodes.node = els.node.nodes[data.viewportId];
				els.parent = els.node.parent;
				nodes.parent = els.parent.nodes[data.viewportId];

				// проверяем по схеме возможную новую структуру

				els.nameEl = els.parent.getName();
				els.pos = els.parent.getChildPosition(els.node);
				els.namesElements = manager.getNamesElements(els.parent);
				els.namesElements.splice(els.pos, 1, 'p');

				if (sch.verify(els.nameEl, els.namesElements))
				{
					// новая структура разрешена, подставляя вместо текущего элемента p
					els.verify = true;
				}
				else if (!sch.verify(els.node.getName(), ['p']))
				{
					// преобразование не соответствует схеме
					return false;
				}

				// преобразуем

				// фрагмент для хранения преобразованных элементов
				els.fragment = factory.createElement('div');

				// помещаем во фрагмент только стилевые элементы и их контейнеры
				els.node.convertToText(els.fragment);

				nodes.fragment = els.fragment.getNode(data.viewportId);

				//console.log('nodes', nodes);

				if (els.verify)
				{
					// вместо текущего элемента вставляем содержимое фрагмента

					nodes.first = nodes.fragment.firstChild;
					els.first = nodes.first.getElement();
					while (els.first)
					{
						els.parent.insertBefore(els.first, els.node);
						nodes.parent.insertBefore(nodes.first, nodes.node);
						nodes.first = nodes.fragment.firstChild;
						els.first = nodes.first ? nodes.first.getElement() : null;
					}
					els.parent.remove(els.node);
					nodes.parent.removeChild(nodes.node);
				}
				else
				{
					// вместо содержимого текущего элемента вставляем содержимое фрагмента

					els.node.removeAll();
					nodes.oldNode = nodes.node;
					nodes.node = els.node.getNode(data.viewportId);
					nodes.parent.replaceChild(nodes.node, nodes.oldNode);

					nodes.first = nodes.fragment.firstChild;
					els.first = nodes.first.getElement();
					while (els.first)
					{
						els.node.add(els.first);
						nodes.node.appendChild(nodes.first);
						nodes.first = nodes.fragment.firstChild;
						els.first = nodes.first ? nodes.first.getElement() : null;
					}
				}

				// синхронизируем
				els.parent.sync(data.viewportId);

				manager.setSuspendEvent(false);

				// устанавливаем курсор
				els.cursor = range.start.getElement();
				nodes.cursor = els.cursor.nodes[data.viewportId];
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: range.offset.start
					}
				);

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
				range;

			//

			manager.setSuspendEvent(false);
			return res;
		}
	}
);
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
				factory = FBEditor.editor.Factory,
				res = false,
				nodes = {},
				els = {},
				helper,
				viewportId,
				manager,
				sch,
				range;

			try
			{

				manager = data.el.getManager();
				sch = manager.getSchema();
				range = data.range || manager.getRange();
				
				console.log('convert ' + data.el.getName() + ' to text ', data, range);
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();
				
				viewportId = data.viewportId = range.start.viewportId;
				manager.setSuspendEvent(true);
				els.node = data.el.getBlock();
				els.parent = els.node.getParent();

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

				//nodes.fragment = els.fragment.getNode(data.viewportId);

				//console.log('nodes', nodes);
				
				els.first = els.fragment.first();

				if (els.verify && els.first)
				{
					// вместо текущего элемента вставляем содержимое фрагмента

					//nodes.first = nodes.fragment.firstChild;
					//els.first = nodes.first.getElement();

					while (els.first)
					{
						els.parent.insertBefore(els.first, els.node, viewportId);
						//nodes.parent.insertBefore(nodes.first, nodes.node);
						els.first = els.fragment.first();
						//nodes.first = nodes.fragment.firstChild;
						//els.first = nodes.first ? nodes.first.getElement() : null;
					}

					els.parent.remove(els.node, viewportId);
					//nodes.parent.removeChild(nodes.node);
				}
				else
				{
					// вместо содержимого текущего элемента вставляем содержимое фрагмента

					helper = els.node.getNodeHelper();
					nodes.node = helper.getNode(viewportId);
					helper = els.parent.getNodeHelper();
					nodes.parent = helper.getNode(viewportId);

					els.node.removeAll();
					nodes.oldNode = nodes.node;
					nodes.node = els.node.getNode(viewportId);
					nodes.parent.replaceChild(nodes.node, nodes.oldNode);

					//nodes.first = nodes.fragment.firstChild;
					//els.first = nodes.first.getElement();

					while (els.first)
					{
						els.node.add(els.first, viewportId);
						//nodes.node.appendChild(nodes.first);
						els.first = els.fragment.first();
						//nodes.first = nodes.fragment.firstChild;
						//els.first = nodes.first ? nodes.first.getElement() : null;
					}
				}

				// синхронизируем
				els.parent.sync(viewportId);

				manager.setSuspendEvent(false);

				// устанавливаем курсор
				els.cursor = range.start.getElement();
				helper = els.cursor.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
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
			manager.updateTree();
			
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

			console.log('Отмена превращения в текст нереализована');

			return res;
		}
	}
);
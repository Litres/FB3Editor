/**
 * Удаляет последний элемент li из списка, и вместо него после списка добавляет пустой абзац.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.li.CreateEmptyPCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				res = false,
				els = {},
				nodes = {},
				viewportId,
				helper,
				range;

			try
			{
				if (manager.isSuspendCmd())
				{
					return false;
				}
				
				if (data.saveRange)
				{
					// восстанвливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();

				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();

				viewportId = data.viewportId = range.start.viewportId;

				console.log('li to empty', range);

				nodes.node = range.start;
				els.node = nodes.node.getElement();
				els.node = els.node.getStyleHolder();
				els.list = els.node.getParent();
				els.parentList = els.list.getParent();
				manager.setSuspendEvent(true);

				// создаем пустой абзац
				els.p = manager.createEmptyP();
				
				els.next = els.list.next();

				if (els.next)
				{
					els.parentList.insertBefore(els.p, els.next, viewportId);
				}
				else
				{
					els.parentList.add(els.p, viewportId);
				}

				// удаляем пустой элемент li
				els.list.remove(els.node, viewportId);
				
				els.parentList.sync(viewportId);

				// устанавливаем курсор
				helper = els.p.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				manager.setCursor(
					{
						startNode: nodes.cursor
					}
				);

				// сохраняем ссылки
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.parentList);

				// скроллим окно вниз, если курсора не видно
				manager.scrollViewDown();

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
				res = false,
				els = {},
				nodes = {},
				helper,
				viewportId,
				manager;

			try
			{
				// исходные данные
				els = data.els;
				viewportId = data.viewportId;

				console.log('undo li to empty', nodes, data);

				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);

				// удаляем пустой абзац
				els.parentList.remove(els.p, viewportId);

				// добавляем вновь элемент li в конец списка
				els.list.add(els.node, viewportId);

				els.parentList.sync(data.viewportId);

				// устанавливаем курсор
				helper = els.node.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				data.saveRange = {
					startNode: nodes.cursor
				};
				manager.setCursor(data.saveRange);

				// скроллим окно вверх, если курсора не видно
				manager.scrollViewUp();

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
/**
 * Удаляет последний элемент li из списка и вместо него всего списка добавляет пустой абзац.
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
				sel = window.getSelection(),
				res = false,
				els = {},
				nodes = {},
				viewportId,
				helper,
				range,
				manager;

			try
			{
				if (data.saveRange)
				{
					// восстанвливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				range = sel.getRangeAt(0);

				viewportId = data.viewportId = range.startContainer.viewportId;

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					parentStart: range.commonAncestorContainer.parentNode,
					collapsed: range.collapsed,
					offset: {
						start: range.startOffset,
						end: range.endOffset
					}
				};

				console.log('li to empty', data.range);

				nodes.node = range.startContainer;
				els.node = nodes.node.getElement();
				els.list = els.node.parent;
				els.parentList = els.list.parent;
				helper = els.parentList.getNodeHelper();
				nodes.parentList = helper.getNode(viewportId);
				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				// создаем пустой абзац
				els.p = manager.createEmptyP();
				nodes.p = els.p.getNode(viewportId);

				if (els.list.next())
				{
					els.next = els.list.next();
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
				me.data.els = els;

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
/**
 * Абстрактная команда создания списка, содержащего элемент li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateLiHolderCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				sel,
				range;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанвливаем выделение
					FBEditor.editor.Manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				sel = data.sel || window.getSelection();
				range = sel.getRangeAt(0);

				data.viewportId = data.node.viewportId;

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					parentStart: range.startContainer.parentNode,
					collapsed: range.collapsed,
					offset: {
						start: range.startOffset,
						end: range.endOffset
					}
				};

				// получаем все параграфы p, которые затрагивают текущее выделение

				nodes.pp = [];

				// первый параграф
				nodes.firstP = data.node;
				els.firstP = nodes.firstP.getElement();
				nodes.pp.push(nodes.firstP);

				// последний параграф
				nodes.lastP = range.endContainer;
				els.lastP = nodes.lastP.getElement();
				while (!els.lastP.isP)
				{
					nodes.lastP = nodes.lastP.parentNode;
					els.lastP = nodes.lastP.getElement();
				}

				if (els.firstP.elementId !== els.lastP.elementId)
				{
					// находим список параграфов в контейнере
					nodes.next = nodes.firstP.nextSibling;
					els.next = nodes.next ? nodes.next.getElement() : null;
					while (els.next && els.next.isP && els.next.elementId !== els.lastP.elementId)
					{
						nodes.pp.push(nodes.next);
						nodes.next = nodes.next.nextSibling;
						els.next = nodes.next ? nodes.next.getElement() : null;
					}
					if (els.next && els.next.elementId === els.lastP.elementId)
					{
						// добавляем последний параграф перед выходом из цикла
						nodes.pp.push(nodes.next);
					}
				}

				// родительский элемент параграфов
				nodes.parent = nodes.firstP.parentNode;
				els.parent = nodes.parent.getElement();

				// новый элемент
				els.node = FBEditor.editor.Factory.createElement(me.elementName);
				nodes.node = els.node.getNode(data.viewportId);
				els.parent.insertBefore(els.node, els.firstP);
				nodes.parent.insertBefore(nodes.node, nodes.firstP);

				// перебираем все параграфы, которые входят в выделение
				// и помещаем их содержимое в список
				Ext.Array.each(
					nodes.pp,
					function (p)
					{
						var elsLi = {},
							nodesLi = {};

						nodesLi.p = p;
						elsLi.p = nodesLi.p.getElement();

						// новый элемент li в списке
						elsLi.node = FBEditor.editor.Factory.createElement('li');
						nodesLi.node = elsLi.node.getNode(data.viewportId);

						// добавляем в список
						els.node.add(elsLi.node);
						nodes.node.appendChild(nodesLi.node);

						// заполняем новый элемент li элементами из праграфа
						nodesLi.first = nodesLi.p.firstChild;
						elsLi.first = nodesLi.first ? nodesLi.first.getElement() : null;
						while (elsLi.first)
						{
							elsLi.node.add(elsLi.first);
							nodesLi.node.appendChild(nodesLi.first);
							nodesLi.first = nodesLi.p.firstChild;
							elsLi.first = nodesLi.first ? nodesLi.first.getElement() : null;
						}

						// удаляем параграф
						els.parent.remove(elsLi.p);
						nodes.parent.removeChild(nodesLi.p);
					}
				);

				// синхронизируем
				els.parent.sync(data.viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setCursor(
					{
						startNode: data.range.start,
						startOffset: data.range.offset.start,
						focusElement: els.node.children[0]
					}
				);

				// сохраянем узлы
				data.saveNodes = nodes;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.removeNext();
			}

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				range,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;

				console.log('undo create ' + me.elementName, range, nodes);

				els.node = nodes.node.getElement();
				els.parent = nodes.parent.getElement();

				// переносим элементы из списка обратно
				nodes.pp = [];
				nodes.li = nodes.node.firstChild;
				els.li = nodes.li ? nodes.li.getElement() : null;
				while (els.li)
				{
					// новый параграф
					els.p = FBEditor.editor.Factory.createElement('p');
					nodes.p = els.p.getNode(data.viewportId);
					nodes.pp.push(nodes.p);

					els.parent.insertBefore(els.p, els.node);
					nodes.parent.insertBefore(nodes.p, nodes.node);

					nodes.first = nodes.li.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
					while (els.first)
					{
						els.p.add(els.first);
						nodes.p.appendChild(nodes.first);
						nodes.first = nodes.li.firstChild;
						els.first = nodes.first ? nodes.first.getElement() : null;
					}

					nodes.li = nodes.li.nextSibling;
					els.li = nodes.li ? nodes.li.getElement() : null;
				}

				// удаляем список
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				// синхронизируем
				els.parent.sync(viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end,
					focusElement: range.common.getElement()
				};
				FBEditor.editor.Manager.setCursor(data.saveRange);

				// сохраняем ссылку на первый параграф
				data.node = nodes.pp[0];

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
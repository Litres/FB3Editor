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
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				isInner,
				viewportId,
				sel,
				range;

			try
			{
				manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанвливаем выделение
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				sel = data.sel || window.getSelection();
				range = sel.getRangeAt(0);

				data.viewportId = data.node.viewportId;
				viewportId = data.viewportId;

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

				// получаем все узлы p/li, которые затрагивают текущее выделение

				nodes.pp = [];

				// первый узел p/li
				nodes.firstP = data.node;
				els.firstP = nodes.firstP.getElement();
				nodes.pp.push(nodes.firstP);

				// если в качестве узла в команду был передан узел li, то создается внутренний список
				// если в качестве узла передан узел p, значит создается обычный список
				isInner = els.firstP.isLi;
				data.isInner = isInner;

				// последний узел p/li
				nodes.lastP = range.endContainer;
				els.lastP = nodes.lastP.getElement();
				els.lastP = isInner ? els.lastP.getParentName('li') : els.lastP.getParentName('p');
				nodes.lastP = els.lastP ? els.lastP.nodes[viewportId] : null;

				if (els.firstP.elementId !== els.lastP.elementId)
				{
					// находим список узлов p/li в контейнере
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
						// добавляем последний узел p/li перед выходом из цикла
						nodes.pp.push(nodes.next);
					}
				}

				// родительский элемент узлов p/li
				nodes.parent = nodes.firstP.parentNode;
				els.parent = nodes.parent.getElement();

				// новый элемент
				els.node = factory.createElement(me.elementName);
				nodes.node = els.node.getNode(data.viewportId);
				els.parent.insertBefore(els.node, els.firstP);
				nodes.parent.insertBefore(nodes.node, nodes.firstP);

				// перебираем все узлы p/li, которые входят в выделение
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
						elsLi.node = factory.createElement('li');
						nodesLi.node = elsLi.node.getNode(data.viewportId);

						// добавляем в список
						els.node.add(elsLi.node);
						nodes.node.appendChild(nodesLi.node);

						// заполняем новый элемент li элементами из узла p/li
						nodesLi.first = nodesLi.p.firstChild;
						elsLi.first = nodesLi.first ? nodesLi.first.getElement() : null;

						while (elsLi.first)
						{
							elsLi.node.add(elsLi.first);
							nodesLi.node.appendChild(nodesLi.first);
							nodesLi.first = nodesLi.p.firstChild;
							elsLi.first = nodesLi.first ? nodesLi.first.getElement() : null;
						}

						// удаляем узел p/li
						els.parent.remove(elsLi.p);
						nodes.parent.removeChild(nodesLi.p);
					}
				);

				// синхронизируем
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: data.range.start,
						startOffset: data.range.offset.start,
						focusElement: els.node.children[0]
					}
				);

				// сохраянем узлы
				data.saveNodes = nodes;
				
				// проверяем по схеме
				me.verifyElement(els.parent);

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
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				range,
				viewportId,
				isInner;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;
				isInner = data.isInner;

				//console.log('undo create ' + me.elementName, range, nodes);

				els.node = nodes.node.getElement();
				els.parent = nodes.parent.getElement();

				// переносим элементы из списка обратно
				nodes.pp = [];
				nodes.li = nodes.node.firstChild;
				els.li = nodes.li ? nodes.li.getElement() : null;

				while (els.li)
				{
					// новый узел p/li
					els.p = isInner ? factory.createElement('li') : factory.createElement('p');
					nodes.p = els.p.getNode(viewportId);
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

				manager.suspendEvent = false;

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end,
					focusElement: range.common.getElement()
				};
				manager.setCursor(data.saveRange);

				// сохраняем ссылку на первый узел p/li
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
/**
 * Команда создания стиха poem, содержащего строфу stanza.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.poem.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: 'poem',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
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
				els.node = factory.createElement(me.elementName);
				nodes.node = els.node.getNode(data.viewportId);
				els.parent.insertBefore(els.node, els.firstP);
				nodes.parent.insertBefore(nodes.node, nodes.firstP);

				// перебираем все параграфы, которые входят в выделение
				// и помещаем их содержимое в стих
				Ext.Array.each(
					nodes.pp,
					function (p)
					{
						var elsStanza = {},
							nodesStanza = {};

						nodesStanza.p = p;
						elsStanza.p = nodesStanza.p.getElement();

						// новый элемент stanza в стихе
						elsStanza.node = factory.createElement('stanza');
						nodesStanza.node = elsStanza.node.getNode(data.viewportId);

						// добавляем в стих
						els.node.add(elsStanza.node);
						nodes.node.appendChild(nodesStanza.node);

						// заполняем новый элемент stanza элементами из параграфа
						nodesStanza.first = nodesStanza.p.firstChild;
						elsStanza.first = nodesStanza.first ? nodesStanza.first.getElement() : null;
						while (elsStanza.first)
						{
							elsStanza.node.add(elsStanza.first);
							nodesStanza.node.appendChild(nodesStanza.first);
							nodesStanza.first = nodesStanza.p.firstChild;
							elsStanza.first = nodesStanza.first ? nodesStanza.first.getElement() : null;
						}

						// удаляем параграф
						els.parent.remove(elsStanza.p);
						nodes.parent.removeChild(nodesStanza.p);
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
				viewportId;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;

				console.log('undo create ' + me.elementName, range, nodes);

				els.node = nodes.node.getElement();
				els.parent = nodes.parent.getElement();

				// переносим элементы из стиха обратно
				nodes.pp = [];
				nodes.stanza = nodes.node.firstChild;
				els.stanza = nodes.stanza ? nodes.stanza.getElement() : null;
				while (els.stanza)
				{
					// новый параграф
					els.p = factory.createElement('p');
					nodes.p = els.p.getNode(data.viewportId);
					nodes.pp.push(nodes.p);

					els.parent.insertBefore(els.p, els.node);
					nodes.parent.insertBefore(nodes.p, nodes.node);

					nodes.first = nodes.stanza.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
					while (els.first)
					{
						els.p.add(els.first);
						nodes.p.appendChild(nodes.first);
						nodes.first = nodes.stanza.firstChild;
						els.first = nodes.first ? nodes.first.getElement() : null;
					}

					nodes.stanza = nodes.stanza.nextSibling;
					els.stanza = nodes.stanza ? nodes.stanza.getElement() : null;
				}

				// удаляем стих
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
/**
 * Разбивает элемент на два.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.styleholder.AbstractSplitNodeCommand',
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
				sel = window.getSelection(),
				range,
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory;

			try
			{
				manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанвливаем выделение
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				range = sel.getRangeAt(0);

				if (!range.collapsed)
				{
					throw Error('Выделение недопустимо');
				}

				nodes.node = range.commonAncestorContainer;
				els.node = nodes.node.getElement();

				data.viewportId = nodes.node.viewportId;

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

				console.log('split ' + me.elementName, data.range);

				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();

				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();

				nodes.nextP = nodes.p.nextSibling;

				// новый элемент
				els.newP = factory.createElement(me.elementName);
				nodes.newP = els.newP.getNode(data.viewportId);
				if (nodes.nextP)
				{
					els.nextP = nodes.nextP.getElement();
					els.parentP.insertBefore(els.newP, els.nextP);
					nodes.parentP.insertBefore(nodes.newP, nodes.nextP);
				}
				else
				{
					els.parentP.add(els.newP);
					nodes.parentP.appendChild(nodes.newP);
				}

				if (els.node.isText)
				{
					nodes.next = nodes.node.nextSibling;

					// разбиваем текстовый узел на два

					els.textValue = nodes.node.nodeValue;

					// сохраняем текст узла для отмены команды
					data.oldValue = els.textValue;

					els.startValue = els.textValue.substring(0, data.range.offset.start);
					els.endValue = els.textValue.substring(data.range.offset.start);

					if (els.startValue)
					{
						// изменяем старый текст
						els.node.setText(els.startValue);
						nodes.node.nodeValue = els.startValue;
					}
					else
					{
						// удаляем пустой текстовый узел
						els.p.remove(els.node);
						nodes.p.removeChild(nodes.node);
					}

					if (els.endValue)
					{
						// создаем новый текст
						els.newText = factory.createElementText(els.endValue);
						nodes.newText = els.newText.getNode(data.viewportId);

						els.newP.add(els.newText);
						nodes.newP.appendChild(nodes.newText);
					}
				}
				else
				{
					nodes.next = nodes.node.nextSibling ? nodes.node.nextSibling : nodes.node;

					if (els.p.isEmpty())
					{
						// удаляем пустой элемент из исходного
						nodes.empty = nodes.p.firstChild;
						els.empty = nodes.empty.getElement();
						els.p.remove(els.empty);
						nodes.p.removeChild(nodes.empty);
						nodes.next = null;
					}
				}

				// переносим все элементы из старого в новый
				while (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.newP.add(els.next);
					nodes.newP.appendChild(nodes.next);
					nodes.next = nodes.node.nextSibling;
				}

				if (els.p.isEmpty())
				{
					// вставляем пустой элемент в исходный
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(data.viewportId);

					els.p.add(els.empty);
					nodes.p.appendChild(nodes.empty);
					nodes.node = nodes.empty;
				}

				if (els.newP.isEmpty())
				{
					// вставляем пустой элемент в новый
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(data.viewportId);

					els.newP.add(els.empty);
					nodes.newP.appendChild(nodes.empty);
				}

				console.log('nodes, els', nodes, els);

				els.parentP.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.newP.firstChild,
					startOffset: 0,
					focusElement: els.newP
				};
				manager.setCursor(data.saveRange);

				// сохраняем ссылки
				me.data.nodes = nodes;

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
				manager;

			manager = FBEditor.editor.Manager;

			try
			{
				manager.suspendEvent = true;

				// исходные данные
				nodes = data.nodes;
				range = data.range;

				console.log('undo split ' + me.elementName, nodes, data);

				els.p = nodes.p.getElement();
				els.node = nodes.node.getElement();
				els.newP = nodes.newP.getElement();
				els.parentP = nodes.parentP.getElement();

				// курсор
				nodes.cursor = nodes.node;

				if (els.p.isEmpty() && els.newP.isEmpty())
				{
					nodes.cursor = nodes.node;
				}
				else
				{
					// восстанавливаем исходный текст
					if (els.p.isEmpty())
					{
						// удаляем пустой элемент из старого
						els.p.remove(els.node);
						nodes.p.removeChild(nodes.node);
					}
					else if (!els.newP.isEmpty())
					{
						nodes.first = nodes.newP.firstChild;
						els.first = nodes.first ? nodes.first.getElement() : null;
						nodes.last = nodes.p.lastChild;
						els.last = nodes.last ? nodes.last.getElement() : null;

						if (els.first && els.last && els.first.isText && els.last.isText)
						{
							// изменяем исходный текстовый элемент
							els.node.setText(data.oldValue);
							nodes.node.nodeValue = data.oldValue;

							// удаляем первый текстовый элемент из нового
							els.newP.remove(els.first);
							nodes.newP.removeChild(nodes.first);
						}
					}

					if (!els.newP.isEmpty())
					{
						// переносим все элементы из нового в старый
						nodes.first = nodes.newP.firstChild;
						while (nodes.first)
						{
							els.first = nodes.first.getElement();
							els.p.add(els.first);
							nodes.p.appendChild(nodes.first);
							nodes.first = nodes.newP.firstChild;
						}

						// курсор
						nodes.cursor = nodes.cursor.parentNode ? nodes.cursor : nodes.p.firstChild;
					}
				}

				// удаляем новый элемент
				els.parentP.remove(els.newP);
				nodes.parentP.removeChild(nodes.newP);

				els.parentP.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: range.offset.start,
					focusElement: els.p
				};
				manager.setCursor(data.saveRange);

				data.nodes = nodes;

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
/**
 * Создает изображение.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.img.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: 'img',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				range;

			try
			{
				manager.suspendEvent = true;

				range = data.opts.range;

				console.log('create img', data.opts);

				data.viewportId = range.start.viewportId;
				data.oldValue = range.start.nodeValue;

				nodes.start = range.start;
				els.start = nodes.start.getElement();

				// новый элемент изображения
				els.node = factory.createElement(me.elementName, {src: data.opts.name});
				nodes.node = els.node.getNode(data.viewportId);

				// вставляем изображение внутри текста

				nodes.parent = nodes.start.parentNode;
				els.parent = nodes.parent.getElement();

				if (!els.parent.isEmpty())
				{
					nodes.next = nodes.start.nextSibling;
					els.next = nodes.next ? nodes.next.getElement() : null;

					// получаем части текста
					els.startValue = nodes.start.nodeValue.substring(0, range.offset);
					els.endValue = nodes.start.nodeValue.substring(range.offset);

					// меняем текст исходного элемента
					els.start.setText(els.startValue);
					nodes.start.nodeValue = els.startValue;
				}
				else
				{
					// удаляем пустой
					els.parent.remove(els.start);
					nodes.parent.removeChild(nodes.start);

					data.isEmpty = true;
				}

				// вставляем изображение
				if (els.next)
				{
					els.parent.insertBefore(els.node, els.next);
					nodes.parent.insertBefore(nodes.node, nodes.next);
				}
				else
				{
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}

				// новый текстовый элемент c последней частью текста
				if (els.endValue)
				{
					els.t = factory.createElementText(els.endValue);
					nodes.t = els.t.getNode(data.viewportId);

					if (els.next)
					{
						els.parent.insertBefore(els.t, els.next);
						nodes.parent.insertBefore(nodes.t, nodes.next);
					}
					else
					{
						els.parent.add(els.t);
						nodes.parent.appendChild(nodes.t);
					}
				}

				//console.log('nodes', nodes, els);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.node
					}
				);

				// сохраняем узел
				data.saveNode = nodes.node;

				// проверяем по схеме
				me.verifyElement(els.parent);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
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
				range;

			try
			{
				manager.suspendEvent = true;

				range = data.opts.range;

				console.log('undo create img', data);

				nodes.node = data.saveNode;
				els.node = nodes.node.getElement();
				nodes.start = range.start;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// удаляем изображение
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				nodes.cursor = range.start;

				if (data.isEmpty)
				{
					// вставляем пустой
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(data.viewportId);

					els.parent.add(els.empty);
					nodes.parent.appendChild(nodes.empty);

					nodes.cursor = nodes.empty;
					range.start = nodes.empty;
				}
				else
				{
					// возвращаем старый текст
					els.start = nodes.start.getElement();
					els.start.setText(data.oldValue);
					nodes.start.nodeValue = data.oldValue;

					nodes.next = nodes.start.nextSibling;
					if (range.offset < nodes.start.nodeValue.length && nodes.next)
					{
						// удаляем новый текстовый узел
						els.next = nodes.next.getElement();
						els.parent.remove(els.next);
						nodes.parent.removeChild(nodes.next);
					}
				}

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: range.offset
					}
				);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			return res;
		}
	}
);
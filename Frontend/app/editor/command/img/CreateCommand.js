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
				range;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				range = data.opts.range;
				data.viewportId = range.start.viewportId;
				data.oldValue = range.start.nodeValue;

				nodes.start = range.start;
				els.start = nodes.start.getElement();

				// новый элемент изображения
				els.node = FBEditor.editor.Factory.createElement(me.elementName, {src: data.opts.name});
				nodes.node = els.node.getNode(data.viewportId);

				// вставляем изображение внутри текста

				nodes.parent = nodes.start.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.next = nodes.start.nextSibling;
				els.next = nodes.next ? nodes.next.getElement() : null;

				// получаем части текста
				els.startValue = nodes.start.nodeValue.substring(0, range.offset);
				els.endValue = nodes.start.nodeValue.substring(range.offset);

				// меняем текст исходного элемента
				els.start.setText(els.startValue);
				nodes.start.nodeValue = els.startValue;

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
					els.t = FBEditor.editor.Factory.createElementText(els.endValue);
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

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset,
					focusElement: els.node
				};
				FBEditor.editor.Manager.setCursor(data.saveRange);

				// сохраняем узел
				data.saveNode = nodes.node;

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
				range;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				range = data.opts.range;

				nodes.node = data.saveNode;
				els.node = nodes.node.getElement();
				nodes.start = range.start;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// удаляем изображение
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

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

				els.parent.sync(data.viewportId);

				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setCursor(
					{
						startNode: range.start,
						startOffset: range.offset,
						focusElement: els.start
					}
				);

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
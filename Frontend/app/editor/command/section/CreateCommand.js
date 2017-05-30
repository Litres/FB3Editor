/**
 * Создает секцию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		syncButtons: false,
		elementName: 'section',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				inner;

			// вложенная ли секция
			inner = data.opts && data.opts.inner;

			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.next = nodes.node.nextSibling;

			if (inner)
			{
				// вложенная секция

				while (!els.parent.isSection && !els.parent.isRoot)
				{
					// ищем родительскую секцию или корневой элемент
					nodes.parent = nodes.parent.parentNode;
					els.parent = nodes.parent.getElement();
				}

				// ищем существующую вложенную секцию
				nodes.next = nodes.parent.firstChild;
				els.next = nodes.next ? nodes.next.getElement() : null;
				while (els.next)
				{
					if (els.next.isSection)
					{
						// вложенная секция уже существует
						throw Error('Section exists');
					}
					nodes.next = nodes.next.nextSibling;
					els.next = nodes.next ? nodes.next.getElement() : null;
				}

				// создаем секцию
				els.node = FBEditor.editor.Factory.createElement(me.elementName);
				nodes.node = els.node.getNode(data.viewportId);

				nodes.last = nodes.lastChild;
				els.last = nodes.last ? nodes.last.getElement() : null;
				if (els.last && els.last.isNotes)
				{
					// вставляем новую секцию перед notes
					els.parent.insertBefore(els.node, els.last);
					nodes.parent.insertBefore(nodes.node, nodes.last);
				}
				else
				{
					// вставляем новую секцию в конец
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}

				// переносим все дочерние элементы в новую секцию, кроме title, epigraph, annotation
				els.except = ['title', 'epigraph', 'annotation'];
				nodes.next = nodes.parent.firstChild;
				els.next = nodes.next ? nodes.next.getElement() : null;
				while (els.next && els.next.elementId !== els.node.elementId)
				{
					nodes.buf = nodes.next.nextSibling;
					if (!Ext.Array.contains(els.except, els.next.xmlTag))
					{
						els.node.add(els.next);
						nodes.node.appendChild(nodes.next);
						els.parent.remove(els.next);
					}
					nodes.next = nodes.buf;
					els.next = nodes.next ? nodes.next.getElement() : null;
				}
			}
			else
			{
				// добавляем секцию

				els.node = FBEditor.editor.Factory.createElement(me.elementName);
				els = Ext.apply(els, els.node.createScaffold());
				nodes.node = els.node.getNode(data.viewportId);
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parent.insertBefore(els.node, els.next);
					nodes.parent.insertBefore(nodes.node, nodes.next);
				}
				else
				{
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}
			}
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager,
				range,
				inner;

			try
			{
				// вложенная ли секция
				inner = data.opts && data.opts.inner;

				nodes.node = data.saveNode;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				if (inner)
				{
					// переносим все элементы из секции обратно
					nodes.first = nodes.node.firstChild;
					while (nodes.first)
					{
						els.first = nodes.first.getElement();
						els.parent.insertBefore(els.first, els.node);
						nodes.parent.insertBefore(nodes.first, nodes.node);
						nodes.first = nodes.node.firstChild;
					}

					// устанавливаем курсор
					me.setCursor();
				}
				else
				{
					// устанавливаем курсор
					range = data.range;
					data.saveRange = {
						startNode: range.start,
						startOffset: range.offset.start,
						focusElement: els.parent
					};
					manager.setCursor(data.saveRange);
				}

				// удаляем секцию
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			return res;
		},

		setCursor: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				range,
				focusEl,
				inner,
				manager;

			inner = data.opts && data.opts.inner;

			if (!inner)
			{
				nodes.p = els.p.nodes[data.viewportId];
				data.saveRange = {
					startNode: nodes.p.firstChild,
					startOffset: nodes.p.firstChild.length,
					focusElement: els.p
				};
			}
			else
			{
				range = data.range;
				focusEl = !range.start.getElement().isText ? range.start.getElement() : range.parentStart.getElement();
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					focusElement: focusEl
				};
			}

			manager = data.saveRange.focusElement.getManager();
			manager.setCursor(data.saveRange);
		}
	}
);
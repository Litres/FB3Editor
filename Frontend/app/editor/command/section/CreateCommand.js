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
				factory = FBEditor.editor.Factory,
				viewportId = data.viewportId,
				inner;

			// вложенная ли секция
			inner = data.opts && data.opts.inner;
			
			els.parent = els.node.getParent();
			els.next = els.node.next();
			
			if (inner)
			{
				// вложенная секция
				
				// ищем родительскую секцию или корневой элемент
				els.parent = els.node.isSection ? els.node : (els.node.getParentName('section') || els.node.getRoot());
				
				// создаем секцию
				els.node = factory.createElement(me.elementName);
				
				// вставляем новую секцию внутрь текущей
				els.parent.add(els.node, viewportId);
				
				// переносим все дочерние элементы в новую секцию, кроме title, epigraph, annotation
				
				els.except = ['title', 'epigraph', 'annotation'];
				els.next = els.parent.first();
				
				while (els.next && !els.next.equal(els.node))
				{
					els.buf = els.next.next();
					
					if (!Ext.Array.contains(els.except, els.next.getName()))
					{
						els.node.add(els.next, viewportId);
					}
					
					els.next = els.buf;
				}
			}
			else
			{
				// добавляем секцию

				els.node = factory.createElement(me.elementName);
				els = Ext.apply(els, els.node.createScaffold());
				if (els.next)
				{
					els.parent.insertBefore(els.node, els.next, viewportId);
				}
				else
				{
					els.parent.add(els.node, viewportId);
				}
			}
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				viewportId,
				manager,
				range,
				inner;

			try
			{
				console.log('undo create section', data);
				
				// вложенная ли секция
				inner = data.opts && data.opts.inner;
				
				viewportId = data.viewportId;
				els = data.els;
				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);
				els.parent = els.node.getParent();

				if (inner)
				{
					// переносим все элементы из секции обратно
					
					els.first = els.node.first();
					
					while (els.first)
					{
						els.parent.insertBefore(els.first, els.node, viewportId);
						els.first = els.node.first();
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
				els.parent.remove(els.node, viewportId);

				els.parent.sync(viewportId);

				manager.suspendEvent = false;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			manager.updateTree();
			
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
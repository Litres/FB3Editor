/**
 * Создает секцию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.section.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				sel = window.getSelection(),
				viewportId;

			try
			{
				// узел, после которого вставляется секция
				nodes.node = data.node;

				FBEditor.editor.Manager.suspendEvent = true;
				viewportId = nodes.node.viewportId;
				els.section = FBEditor.editor.Factory.createElement('section');
				els.title = FBEditor.editor.Factory.createElement('title');
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Заголовок');
				els.p.add(els.t);
				els.title.add(els.p);
				els.section.add(els.title);
				els.p2 = FBEditor.editor.Factory.createElement('p');
				els.t2 = FBEditor.editor.Factory.createElementText('Текст');
				els.p2.add(els.t2);
				els.section.add(els.p2);
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.next = nodes.node.nextSibling;
				nodes.section = els.section.getNode(viewportId);
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parent.insertBefore(els.section, els.next);
					nodes.parent.insertBefore(nodes.section, nodes.next);
				}
				else
				{
					els.parent.add(els.section);
					nodes.parent.appendChild(nodes.section);
				}
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				data.oldRange = sel.getRangeAt(0);
				FBEditor.editor.Manager.setFocusElement(els.p2);
				sel.collapse(els.p2.nodes[viewportId]);

				data.section = nodes.section;

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
				sel = window.getSelection(),
				range,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.section = data.section;
				viewportId = nodes.section.viewportId;
				els.section = nodes.section.getElement();
				nodes.parent = nodes.section.parentNode;
				els.parent = nodes.parent.getElement();
				els.parent.remove(els.section);
				nodes.parent.removeChild(nodes.section);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				range = data.oldRange;
				nodes.cursor = range.endContainer;
				els.cursor = nodes.cursor.getElement();
				FBEditor.editor.Manager.setFocusElement(els.cursor);
				sel.collapse(nodes.cursor, range.endOffset);

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
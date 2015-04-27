/**
 * Перемещает объединенный текстовый узел абзаца с текстом следующего абзаца в начало следующего абзаца
 * и удаляет пустой абзац.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.JoinTextToNextNodeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				sel = window.getSelection(),
				els = {},
				nodes = {},
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.node = data.node;
				els.node = nodes.node.getElement();
				nodes.text = nodes.node.lastChild;

				// сохраняем смещение
				data.offset = nodes.text.length;

				nodes.next = nodes.node.nextSibling;
				els.next = nodes.next.getElement();
				nodes.nextText = nodes.next.firstChild;
				els.nextText = nodes.nextText.getElement();
				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.nextText.nodeValue = nodes.text.nodeValue + nodes.nextText.nodeValue;
				els.nextText.setText(nodes.nextText.nodeValue);
				console.log('join text to next node', nodes, els);
				while (nodes.prevText = nodes.text.previousSibling)
				{
					els.next.insertBefore(nodes.prevText.getElement(), nodes.next.firstChild.getElement());
					nodes.next.insertBefore(nodes.prevText, nodes.next.firstChild);
				}
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				FBEditor.editor.Manager.setFocusElement(els.next);
				sel.collapse(nodes.nextText);
				sel.extend(nodes.nextText, data.offset);
				sel.collapseToEnd();

				me.data.node = nodes.next;
				me.data.text = nodes.nextText;

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
				viewportId,
				offset;

			try
			{
				// позиция курсора, в которой происходит разделение текста
				offset = data.offset;

				FBEditor.editor.Manager.suspendEvent = true;
				nodes.p = data.node;
				els.p = nodes.p.getElement();
				nodes.text = data.text;
				nodes.textValue = nodes.text.nodeValue;
				els.text = nodes.text.getElement();
				viewportId = nodes.text.viewportId;
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				els.start = FBEditor.editor.Factory.createElementText(nodes.textValue.substring(0, offset));
				nodes.start = els.start.getNode(viewportId);
				nodes.text.nodeValue = nodes.textValue.substring(offset);
				els.text.setText(nodes.text.nodeValue);
				els.newP = FBEditor.editor.Factory.createElement('p');
				els.newP.add(els.start);
				nodes.newP = els.newP.getNode(viewportId);
				console.log('undo join text to next node', nodes, els);
				els.parentP.insertBefore(els.newP, els.p);
				nodes.parentP.insertBefore(nodes.newP, nodes.p);
				while (nodes.prevText = nodes.text.previousSibling)
				{
					els.newP.insertBefore(nodes.prevText.getElement(), nodes.newP.firstChild.getElement());
					els.p.remove(nodes.prevText.getElement());
					nodes.newP.insertBefore(nodes.prevText, nodes.newP.firstChild);
				}
				els.parentP.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.newP);
				sel.collapse(nodes.newP);
				sel.extend(nodes.newP.lastChild, nodes.newP.lastChild.length);
				sel.collapseToEnd();

				// сохраняем ссылки
				me.data.node = nodes.newP;

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
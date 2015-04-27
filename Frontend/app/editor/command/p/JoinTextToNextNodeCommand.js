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
				nodes.text = nodes.node.firstChild;

				// сохраняем смещение
				data.offset = nodes.text.length;

				nodes.next = nodes.node.nextSibling;
				els.next = nodes.next.getElement();
				nodes.nextText = nodes.next.firstChild;
				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				els.newText = FBEditor.editor.Factory.createElementText(nodes.text.nodeValue +
				                                                        nodes.nextText.nodeValue);
				nodes.newText = els.newText.getNode(viewportId);
				console.log('join text to next node', nodes, els);
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);
				els.next.replace(els.newText, nodes.nextText.getElement());
				nodes.next.replaceChild(nodes.newText, nodes.nextText);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				FBEditor.editor.Manager.setFocusElement(els.next);
				sel.collapse(nodes.newText);
				sel.extend(nodes.newText, data.offset);
				sel.collapseToEnd();

				me.data.node = nodes.next;

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
				FBEditor.editor.Manager.suspendEvent = true;
				nodes.text = data.node.firstChild;
				nodes.textValue = nodes.text.nodeValue;
				els.text = nodes.text.getElement();
				viewportId = nodes.text.viewportId;

				// позиция курсора, в которой происходит разделение текста
				offset = data.offset;

				nodes.p = nodes.text.parentNode;
				els.p = nodes.p.getElement();
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				els.start = FBEditor.editor.Factory.createElementText(nodes.textValue.substring(0, offset));
				nodes.start = els.start.getNode(viewportId);
				els.end = FBEditor.editor.Factory.createElementText(nodes.textValue.substring(offset));
				nodes.end = els.end.getNode(viewportId);
				els.newP = FBEditor.editor.Factory.createElement('p');
				els.newP.add(els.start);
				nodes.newP = els.newP.getNode(viewportId);
				console.log('undo join text to next node', nodes, els);
				els.parentP.insertBefore(els.newP, els.p);
				nodes.parentP.insertBefore(nodes.newP, nodes.p);
				els.p.replace(els.end, els.text);
				nodes.p.replaceChild(nodes.end, nodes.text);
				els.parentP.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.newP);
				sel.collapse(nodes.newP);
				sel.extend(nodes.newP.firstChild, nodes.newP.firstChild.length);
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
/**
 * Перемещает объединенный текстовый узел абзаца с текстом предыдущего абзаца в конец предыдущего абзаца
 * и удаляет пустой абзац.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.JoinTextToPrevNodeCommand',
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
				nodes.prev = nodes.node.previousSibling;
				els.prev = nodes.prev.getElement();
				nodes.prevText = nodes.prev.firstChild;

				// сохраняем смещение
				data.offset = nodes.prevText.length;

				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				els.newText = FBEditor.editor.Factory.createElementText(nodes.prevText.nodeValue +
				                                                        nodes.text.nodeValue);
				nodes.newText = els.newText.getNode(viewportId);
				console.log('join text to prev node', nodes, els);
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);
				els.prev.replace(els.newText, nodes.prevText.getElement());
				nodes.prev.replaceChild(nodes.newText, nodes.prevText);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				FBEditor.editor.Manager.setFocusElement(els.prev);
				sel.collapse(nodes.newText);
				sel.extend(nodes.newText, data.offset);
				sel.collapseToEnd();

				me.data.node = nodes.prev;

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
				nodes.text = nodes.p.firstChild;
				nodes.textValue = nodes.text.nodeValue;
				els.text = nodes.text.getElement();
				viewportId = nodes.text.viewportId;
				nodes.nextP = nodes.p.nextSibling;
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				els.start = FBEditor.editor.Factory.createElementText(nodes.textValue.substring(0, offset));
				nodes.start = els.start.getNode(viewportId);
				els.end = FBEditor.editor.Factory.createElementText(nodes.textValue.substring(offset));
				nodes.end = els.end.getNode(viewportId);
				els.newP = FBEditor.editor.Factory.createElement('p');
				els.newP.add(els.end);
				nodes.newP = els.newP.getNode(viewportId);
				console.log('undo join text to prev node', nodes, els);
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
				els.p.replace(els.start, els.text);
				nodes.p.replaceChild(nodes.start, nodes.text);
				els.parentP.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.newP);
				sel.collapse(nodes.newP);

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
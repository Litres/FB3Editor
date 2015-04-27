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
				nodes.prevText = nodes.prev.lastChild;
				els.prevText = nodes.prevText.getElement();

				// сохраняем смещение
				data.offset = nodes.prevText.length;

				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.newTextValue = nodes.prevText.nodeValue + nodes.text.nodeValue;
				nodes.prevText.nodeValue = nodes.newTextValue;
				els.prevText.setText(nodes.newTextValue);
				console.log('join text to prev node', data.offset, nodes, els);
				nodes.nextText = nodes.node.firstChild;
				while (nodes.nextText = nodes.nextText.nextSibling)
				{
					els.prev.add(nodes.nextText.getElement());
					nodes.prev.appendChild(nodes.nextText);
					nodes.nextText = nodes.node.firstChild;
				}
				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);
				els.parent.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// курсор
				FBEditor.editor.Manager.setFocusElement(els.prev);
				Ext.defer(
					function ()
					{
						sel.collapse(nodes.prevText);
						sel.extend(nodes.prevText, data.offset);
						sel.collapseToEnd();
					},
				    1
				);

				// сохраняем ссылки
				me.data.node = nodes.prev;
				me.data.text = nodes.prevText;

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
				nodes.nextP = nodes.p.nextSibling;
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				nodes.text.nodeValue = nodes.textValue.substring(0, offset);
				els.text.setText(nodes.text.nodeValue);
				els.end = FBEditor.editor.Factory.createElementText(nodes.textValue.substring(offset));
				nodes.end = els.end.getNode(viewportId);
				els.newP = FBEditor.editor.Factory.createElement('p');
				els.newP.add(els.end);
				nodes.newP = els.newP.getNode(viewportId);
				console.log('undo join text to prev node', data.offset, nodes, els);
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
				while (nodes.nextText = nodes.text.nextSibling)
				{
					els.newP.add(nodes.nextText.getElement());
					nodes.newP.appendChild(nodes.nextText);
				}
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
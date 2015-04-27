/**
 * Разбивает абзац на два.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.p.SplitNodeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		oldText: '',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				sel = window.getSelection(),
				offset,
				viewportId;

			try
			{
				FBEditor.editor.Manager.suspendEvent = true;

				// текстовый узел, который необходимо разбить на два абзаца
				nodes.text = data.node;
				nodes.textValue = nodes.text.nodeValue;
				els.text = nodes.text.getElement();
				viewportId = nodes.text.viewportId;

				// сохраняем текст узла для отмены команды
				me.oldText = nodes.textValue;

				// позиция курсора, в которой происходит разделение текста
				offset = data.offset;

				nodes.p = nodes.text.parentNode;
				els.p = nodes.p.getElement();
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				nodes.nextP = nodes.p.nextSibling;
				els.start = offset ?
				            FBEditor.editor.Factory.createElementText(nodes.textValue.substring(0, offset)) :
				            FBEditor.editor.Factory.createElement('br');
				nodes.start = els.start.getNode(viewportId);
				els.end = offset !== nodes.text.length ?
				          FBEditor.editor.Factory.createElementText(nodes.textValue.substring(offset)) :
				          FBEditor.editor.Factory.createElement('br');
				nodes.end = els.end.getNode(viewportId);
				els.newP = FBEditor.editor.Factory.createElement('p');
				els.newP.add(els.end);
				nodes.newP = els.newP.getNode(viewportId);
				console.log('split', nodes);
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
				while (nodes.nextText = nodes.start.nextSibling)
				{
					els.newP.add(nodes.nextText.getElement());
					els.p.remove(nodes.nextText.getElement());
					nodes.newP.appendChild(nodes.nextText);
				}
				els.parentP.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				sel.collapse(nodes.newP);
				FBEditor.editor.Manager.setFocusElement(els.newP, sel);

				// сохраняем ссылки
				me.data.node = nodes.start;

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
				sel = window.getSelection(),
				els = {},
				nodes = {},
				offset,
				viewportId;

			try
			{
				if (!data.node)
				{
					throw new Error('Невозможно отменить команду разделения абзаца.');
				}
				FBEditor.editor.Manager.suspendEvent = true;
				offset = data.offset;
				nodes.start = data.node;
				viewportId = nodes.start.viewportId;
				els.start = nodes.start.getElement();
				els.text =  FBEditor.editor.Factory.createElementText(me.oldText);
				nodes.text = els.text.getNode(viewportId);
				nodes.p = nodes.start.parentNode;
				console.log('undo split', nodes, els);
				els.p = nodes.p.getElement();
				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();
				nodes.nextP = nodes.p.nextSibling;
				els.nextP = nodes.nextP.getElement();
				els.p.replace(els.text, els.start);
				nodes.p.replaceChild(nodes.text, nodes.start);
				nodes.nextText = nodes.nextP.firstChild;
				while (nodes.nextText = nodes.nextText.nextSibling)
				{
					els.p.add(nodes.nextText.getElement());
					nodes.p.appendChild(nodes.nextText);
					nodes.nextText = nodes.nextP.firstChild;
				}
				els.parentP.remove(els.nextP);
				nodes.parentP.removeChild(nodes.nextP);
				els.parentP.sync(viewportId);
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				FBEditor.editor.Manager.setFocusElement(els.p);
				sel.collapse(nodes.text);
				sel.extend(nodes.text, offset);
				sel.collapseToEnd();

				me.data.node = nodes.text;

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
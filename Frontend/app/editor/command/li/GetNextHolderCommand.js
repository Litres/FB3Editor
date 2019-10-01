/**
 * Подтягивает li из следующего блока.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.li.GetNextHolderCommand',
	{
		extend: 'FBEditor.editor.command.styleholder.AbstractGetNextHolderCommand',

		elementName: 'li',
		
		moveNextP: function (els)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				manager = FBEditor.getEditorManager(),
				nodes = {},
				helper;
			
			// переносим все эелементы из следующего абзаца в конец списка
			
			els.last = els.p.getDeepLast();
			
			// курсор
			els.cursor = els.last;
			
			els.firstNext = els.nextP.first();
			
			while (els.first = els.nextP.first())
			{
				els.p.add(els.first, viewportId);
			}
			
			if (els.firstNext.isText && els.last.isText)
			{
				// соединяем текстовые узлы
				
				// сохраняем позицию разделения
				data.offset = els.last.getLength();
				
				helper = els.firstNext.getNodeHelper();
				nodes.firstNext = helper.getNode(viewportId);
				manager.joinNode(nodes.firstNext);
			}
			
			els.nextNextP = els.nextP.next();
			els.parentNextP.remove(els.nextP, viewportId);
		},
		
		unMoveNextP: function (els)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				manager = FBEditor.getEditorManager(),
				nodes = {};
			
			// воссоздаем старый следующий абзац
			
			if (els.nextNextP)
			{
				els.parentNextP.insertBefore(els.nextP, els.nextNextP, viewportId);
			}
			else
			{
				els.parentNextP.add(els.nextP, viewportId);
			}
			
			els.next = els.firstNext;
			
			if (data.offset)
			{
				// разбиваем узел
				els.common = els.p;
				nodes.container = els.cursor.getNodeHelper().getNode(viewportId);
				nodes.node = manager.splitNode(els, nodes, data.offset);
				//console.log(nodes.node);
				els.next = nodes.node.getElement();
			}
			
			// переносим все элементы в старый абзац
			
			while (els.next)
			{
				els.buf = els.next.next();
				els.nextP.add(els.next, viewportId);
				els.next = els.buf;
			}
		}
	}
);
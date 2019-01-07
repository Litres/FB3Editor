/**
 * Абстрактная команда создания списка, содержащего элемент li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateLiHolderCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				factory = FBEditor.editor.Factory,
				res = false,
				els = {},
				nodes = {},
				isInner,
				viewportId,
				range;

			try
			{
				if (data.saveRange)
				{
					// восстанвливаем выделение
					els.node = data.saveRange.startNode.getElement();
					manager = els.node.getManager();
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				range = data.range = manager.getRange();
				viewportId = data.viewportId = range.common.viewportId;
				
				console.log('create ' + me.elementName, range, data);

				els.node = data.node.getElement();
				manager.setSuspendEvent(true);

				// получаем все элементы p/li, которые затрагивают текущее выделение

				els.pp = [];

				// первый элемент p/li
				els.firstP = els.node;
				els.pp.push(els.firstP);

				// если в качестве узла в команду был передан узел li, то создается внутренний список
				// если в качестве узла передан узел p, значит создается обычный список
				isInner = els.firstP.isLi;
				data.isInner = isInner;

				// последний элемент p/li
				nodes.lastP = range.end;
				els.lastP = nodes.lastP.getElement();
				els.lastP = isInner ? els.lastP.getParentName('li') : els.lastP.getParentName('p');

				if (!els.firstP.equal(els.lastP))
				{
					// находим список элементов p/li в контейнере
					els.next = els.firstP.next();
					
					while (els.next && els.next.isP && !els.next.equal(els.lastP))
					{
						els.pp.push(els.next);
						els.next = els.next.next();
					}

					if (els.next && els.next.equal(els.lastP))
					{
						// добавляем последний элемент p/li перед выходом из цикла
						els.pp.push(els.next);
					}
				}

				// родительский элемент узлов p/li
				els.parent = els.firstP.getParent();
				
				// новый элемент
				els.node = factory.createElement(me.elementName);
				els.parent.insertBefore(els.node, els.firstP, viewportId);

				// перебираем все элементы p/li, которые входят в выделение
				// и помещаем их содержимое в список
				Ext.Array.each(
					els.pp,
					function (p)
					{
						var elsLi = {};

						elsLi.p = p;
							
						// новый элемент li в списке
						elsLi.node = factory.createElement('li');

						// добавляем в список
						els.node.add(elsLi.node, viewportId);

						// заполняем новый элемент li элементами из узла p/li
						elsLi.first = elsLi.p.first();

						while (elsLi.first)
						{
							elsLi.node.add(elsLi.first, viewportId);
							elsLi.first = elsLi.p.first();
						}

						// удаляем узел p/li
						els.parent.remove(elsLi.p, viewportId);
					}
				);

				// синхронизируем
				els.parent.sync(viewportId);

				// устанавливаем курсор
				manager.setCursor(
					{
						withoutSyncButtons: true,
						startNode: range.start,
						startOffset: range.offset.start,
						focusElement: els.node.first()
					}
				);

				// сохраянем ссылки
				data.saveNodes = nodes;
				data.els = els;
				
				// проверяем по схеме
				me.verifyElement(els.parent);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
			}

			manager.setSuspendEvent(false);
			
			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory,
				res = false,
				els = {},
				nodes = {},
				helper,
				manager,
				range,
				viewportId,
				isInner;

			try
			{
				range = data.range;
				els = data.els;
				nodes = data.saveNodes;
				viewportId = data.viewportId;
				isInner = data.isInner;

				console.log('undo create ' + me.elementName, range, els);

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				// переносим элементы из списка обратно
				els.pp = [];
				els.li = els.node.first();

				while (els.li)
				{
					// новый элемент p/li
					els.p = isInner ? factory.createElement('li') : factory.createElement('p');
					//nodes.p = els.p.getNode(viewportId);
					//nodes.pp.push(nodes.p);
					els.pp.push(els.p);

					els.parent.insertBefore(els.p, els.node, viewportId);
					//nodes.parent.insertBefore(nodes.p, nodes.node);

					//nodes.first = nodes.li.firstChild;
					//els.first = nodes.first ? nodes.first.getElement() : null;
					els.first = els.li.first();
					
					while (els.first)
					{
						els.p.add(els.first, viewportId);
						//nodes.p.appendChild(nodes.first);
						//nodes.first = nodes.li.firstChild;
						//els.first = nodes.first ? nodes.first.getElement() : null;
						els.first = els.li.first()
					}

					//nodes.li = nodes.li.nextSibling;
					//els.li = nodes.li ? nodes.li.getElement() : null;
					els.li = els.li.next();
				}

				// удаляем список
				els.parent.remove(els.node, viewportId);
				//nodes.parent.removeChild(nodes.node);

				// синхронизируем
				els.parent.sync(viewportId);

				manager.setSuspendEvent(false);

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end,
					focusElement: range.common.getElement()
				};
				manager.setCursor(data.saveRange);

				// сохраняем ссылку на первый узел p/li
				els.first = els.pp[0];
				helper = els.first.getNodeHelper();
				data.node = helper.getNode();

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
		}
	}
);
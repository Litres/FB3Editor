/**
 * Удаляет выделенную часть элементов.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.RemoveNodesCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: null,
		
		/**
		 * @private
		 * @property {FBEditor.editor.command.p.RemoveRangeNodesCommand} Команда удаления выделенной части тела
		 * на уровне абзаца.
		 */
		removeCmd: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				factory = manager.getFactory(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				pos = {},
				promise,
				viewportId,
				range;
			
			promise = new Promise(
				function (resolve, reject)
				{
					try
					{
						if (manager.isSuspendCmd())
						{
							resolve(false);
							return false;
						}
						
						// удаляем все оверлеи в тексте
						manager.removeAllOverlays();
						
						if (data.saveRange)
						{
							// восстанвливаем выделение
							manager.setCursor(data.saveRange);
						}
						
						// получаем данные из выделения
						range = data.range = manager.getRangeCursor();
						offset = range.offset;
						viewportId = data.viewportId = range.common.viewportId;
						
						if (range.collapsed)
						{
							throw Error('Отсутствует выделение');
						}
						
						els.common = range.common.getElement();
						
						if (els.common.getStyleHolder())
						{
							// удаление на уровне одного абзаца
							
							me.removeCmd = Ext.create('FBEditor.editor.command.p.RemoveRangeNodesCommand', {promise: true});
							me.removeCmd.execute().then(
								function (res)
								{
									resolve(res);
								}
							);
							
							return true;
						}
						
						manager.setSuspendEvent(true);
						
						console.log('remove nodes', range);
						
						// первый элемент
						
						els.first = range.start.getElement();
						
						while (els.first && !els.first.getParent().equal(els.common))
						{
							els.first = els.isRoot ? els.first.first() : els.first.getParent();
						}
						
						// последний элемент
						
						els.last = range.end.getElement();
						
						while (els.last && !els.last.getParent().equal(els.common))
						{
							els.last = els.isRoot ? els.last.last() : els.last.getParent();
						}
						
						// позиция выделения относительно затронутых элементов
						pos.isStart = els.first.isStartRange(range);
						pos.isEnd = els.last.isEndRange(range);
						data.range.pos = pos;
						
						//console.log('pos', pos, range.toString());
						
						if (!pos.isStart)
						{
							// разбиваем первый элемент
							nodes.container = range.start;
							nodes.start = manager.splitNode(els, nodes, offset.start);
							els.start = nodes.start.getElement();
						}
						else
						{
							els.start = els.first;
						}
						
						if (!pos.isEnd)
						{
							// разбиваем последний элемент
							nodes.container = range.end;
							nodes.end = manager.splitNode(els, nodes, offset.end);
							els.end = nodes.end.getElement();
							
							// курсор
							els.cursor = els.end;
							els.startCursor = 0;
							
							els.end = els.end.prev();
						}
						else
						{
							els.end = els.last;
							
							if (els.start.prev())
							{
								//куросор
								els.cursor = els.start.prev().getDeepFirst();
								els.startCursor = els.cursor.isText ? els.cursor.getLength() : 0;
							}
						}
						
						els.parent = els.common;
						
						//console.log('nodes, els', nodes, els);return false;
						
						// удаляем элементы
						
						els.removed = [];
						els.next = els.start;
						
						while (els.next && !els.next.equal(els.end))
						{
							els.removed.push(els.next);
							els.buf = els.next.next();
							els.parent.remove(els.next, viewportId);
							els.next = els.buf;
						}
						
						els.nextCursor = els.next.next();
						els.removed.push(els.next);
						els.parent.remove(els.next, viewportId);
						els.first = els.parent.first();
						
						if (!els.first)
						{
							// если в родительском элементе не осталось потомков, то вставляем в него пустой абзац
							els.isEmpty = true;
							
							// пустой абзац
							els.p = manager.createEmptyP();
							els.newEl = els.p;
							
							if (els.parent.isRoot && !els.parent.isDesc)
							{
								// в корневом элементе должна быть хотя бы одна секция
								els.s = factory.createElement('section');
								els.s.add(els.p);
								els.newEl = els.s;
							}
							
							els.parent.add(els.newEl, viewportId);
							
							// курсор
							els.cursor = els.newEl.getDeepFirst();
							els.startCursor = 0;
						}
						
						//console.log('nodes, els', nodes, els);
						
						// синхронизируем
						els.parent.sync(viewportId);
						
						manager.setSuspendEvent(false);
						
						// устанавливаем курсор
						nodes.cursor = els.cursor.getNodeHelper().getNode(viewportId);
						manager.setCursor(
							{
								startNode: nodes.cursor,
								startOffset: els.startCursor
							}
						);
						
						// сохраняем узлы
						data.nodes = nodes;
						data.els = els;
						
						// проверяем по схеме
						me.verifyElement(els.parent, {resolve: resolve});
						
						res = true;
					}
					catch (e)
					{
						Ext.log({level: 'warn', msg: e, dump: e});
						me.getHistory(els.parent).removeNext();
						reject();
					}
					
					manager.setSuspendEvent(false);
				}
			);
			
			if (!data.promise)
			{
				promise.then();
			}
			
			return promise;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				viewportId,
				manager,
				range;
			
			if (me.removeCmd)
			{
				// восстанавливаем удаленный текст, который был выделен на уровне абзаца
				res = me.removeCmd.unExecute();
				me.removeCmd = null;
				
				return res;
			}

			try
			{
				range = data.range;
				nodes = data.nodes;
				els = data.els;
				viewportId = data.viewportId;
				manager = els.parent.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);

				console.log('undo remove nodes ', els);

				if (els.isEmpty)
				{
					// удаляем пустой абзац или секцию
					els.parent.remove(els.newEl, viewportId);
					els.nextCursor = null;
				}
				
				// восстанавливаем удаленные элементы
				Ext.Array.each(
					els.removed,
					function (el)
					{
						if (els.nextCursor)
						{
							els.parent.insertBefore(el, els.nextCursor, viewportId);
						}
						else
						{
							els.parent.add(el, viewportId);
						}
					}
				);

				if (!range.pos.isStart)
				{
					// соединяем первый элемент
					nodes.first = els.removed[0].getNodeHelper().getNode(viewportId);
					manager.joinNode(nodes.first);

					// удаляем пустые элементы
					manager.removeEmptyNodes(nodes.first);
				}
				
				if (!range.pos.isEnd)
				{
					// соединяем последний элемент
					nodes.nextCursor = els.nextCursor.getNodeHelper().getNode(viewportId);
					manager.joinNode(nodes.nextCursor);

					// удаляем пустые элементы
					nodes.emptyNode = els.removed[els.removed.length - 1].getNodeHelper().getNode(viewportId);
					manager.removeEmptyNodes(nodes.emptyNode);
				}

				els.parent.sync(viewportId);

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end
				};
				
				manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);

			return res;
		}
	}
);
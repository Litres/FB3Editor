/**
 * Подтягивает элемент из следующего блока.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.styleholder.AbstractGetNextHolderCommand',
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
				helper,
				viewportId,
				range;

			try
			{
				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();

				viewportId = data.viewportId = range.common.viewportId;
				nodes.p = range.common;
				els.p = nodes.p.getElement();
				manager.setSuspendEvent(true);

				// абзац
				els.p = els.p.hisName(me.elementName) ? els.p : els.p.getParentName(me.elementName);

				els.parentP = els.p.parent;
				els.parent = els.parentP.parent;

				// первый абзац из следующего блока
				els.nextP = me.getNextP(els);

				if (!els.nextP)
				{
					// отсутствует или не подходит абзац из следующего блока
					return false;
				}

				// сохраняем ссылку на родитель абзаца из следующего блока
				els.parentNextP = els.nextP.parent;

				if (els.parentNextP.isEmpty())
				{
					// следующий блок является пустым и поэтому из него нечего подтягивать
					return false;
				}

				console.log('get next holder ' + me.elementName, els);

				if (els.parentP.isEmpty())
				{
					// удаляем пустой абзац из пустого блока перед тем как перенести в него следующий абзац
					// это необходимо, чтобы избежать образование пустого верхнего абзаца после подтягивания

					els.isEmpty = true;
					els.parentP.remove(els.p, viewportId);
				}

				if (!els.nextP.hisName(me.elementName))
				{
					// создаем новый элемент подходящего типа и переносим в него содержимое следующего абзаца

					els.newP = factory.createElement(me.elementName);
					nodes.newP = els.newP.getNode(viewportId);

					while (els.first = els.nextP.first())
					{
						els.newP.add(els.first, viewportId);
					}

					els.parentP.add(els.newP, viewportId);
					els.nextNextP = els.nextP.next();
					els.parentNextP.remove(els.nextP, viewportId);
				}
				else
				{
					// переносим следующий абзац
					
					els.next = els.p.next();
					
					if (!els.next)
					{
						els.parentP.add(els.nextP, viewportId);
					}
					else
					{
						els.parentP.insertBefore(els.nextP, els.next, viewportId);
					}
				}

				if (els.parentNextP.isEmpty())
				{
					// удаляем пустой следующий блок
					els.isEmptyParentNextP = true;
					els.parentNext = els.parentNextP.parent;
					els.nextParentNextP = els.parentNextP.next();
					els.parentNext.remove(els.parentNextP, viewportId);
				}
				
				// синхронизируем
				els.parent.sync(viewportId);

				//console.log('nodes, els', nodes, els);

				// устанавливаем курсор
				els.cursor = els.newP ? els.newP.getDeepLast() : els.nextP.getDeepLast();
				helper = els.cursor.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				nodes.startCursor = els.cursor.getLength();
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: nodes.startCursor
					}
				);

				// сохраняем ссылки
				data.nodes = nodes;
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.parentP);

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

		beforeUnExecute: function ()
		{
			var me = this,
				data = me.getData(),
				promise,
				viewportId,
				els,
				nodes,
				manager;

			// исходные данные
			nodes = data.nodes;
			els = data.els;

			console.log('before undo get next holder ' + me.elementName, nodes, els);

			if (els.isEmptyParentNextP)
			{
				// восстанавливаем пустой следующий блок и вставляем в него пустой абзац
				// это необходимо, чтобы соответствовать схеме документа

				viewportId = data.viewportId;
				manager = els.p.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);

				if (els.nextParentNextP)
				{
					els.parentNext.insertBefore(els.parentNextP, els.nextParentNextP, viewportId);
				}
				else
				{
					els.parentNext.add(els.parentNextP, viewportId);
				}

				els.emptyP = manager.createEmptyP();
				els.parentNextP.add(els.emptyP, viewportId);

				manager.setSuspendEvent(false);
				els.parent.sync(viewportId);

				console.log('cancel undo');

				// отменяем операцию unExecute
				promise = Promise.reject(false);
			}
			else
			{
				promise = me.callParent(arguments);
			}

			return promise;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				helper,
				viewportId,
				els,
				nodes,
				manager;

			try
			{
				// исходные данные
				nodes = data.nodes;
				els = data.els;

				console.log('undo get next holder ' + me.elementName, els);

				viewportId = data.viewportId;
				manager = els.p.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);

				if (els.parentNext)
				{
					// воссоздаем следующий блок
					if (els.nextParentNextP)
					{
						els.parentNext.insertBefore(els.parentNextP, els.nextParentNextP, viewportId);
					}
					else
					{
						els.parentNext.add(els.parentNextP, viewportId);
					}

					if (els.isEmptyParentNextP)
					{
						// удаляем пустой абзац, который был создан для соответсвия схеме
						els.parentNextP.remove(els.emptyP, viewportId);
					}
				}

				if (els.newP)
				{
					// переносим все элементы в старый абзац

					while (els.first = els.newP.first())
					{
						els.nextP.add(els.first, viewportId);
					}

					els.parentP.remove(els.newP, viewportId);

					// воссоздаем старый следующий абзац

					if (els.nextNextP)
					{
						els.parentNextP.insertBefore(els.nextP, els.nextNextP, viewportId);
					}
					else
					{
						els.parentNextP.add(els.nextP, viewportId);
					}
				}
				else
				{
					// воссоздаем абзац в следующем блоке

					els.next = !els.parentNextP.equal(els.parent) ? els.parentNextP.first() : false;

					if (els.next)
					{
						els.parentNextP.insertBefore(els.nextP, els.next, viewportId);
					}
					else
					{
						els.parentNextP.add(els.nextP, viewportId);
					}
				}

				if (els.isEmpty)
				{
					// восстанавливаем пустой абзац, который был удален из пустого блока, в который происходило
					// подтягивание из следующего блока
					els.parentP.add(els.p, viewportId);
				}

				els.parent.sync(viewportId);

				// устанавливаем курсор
				els.cursor = els.p.getDeepLast();
				helper = els.cursor.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				nodes.startCursor = els.cursor.getText().length;
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: nodes.startCursor
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
		},

		/**
		 * @private
		 * Возвращает первые абзац из следующего блока.
		 * @param {Object} els
		 * @return {FBEditor.editor.element.AbstractStyleHolderElement}
		 */
		getNextP: function (els)
		{
			var me = this;

			els.next = els.p.next();
			els.nextParent = els.next || els.parentP.next();

			if (els.nextParent)
			{
				els.nextDeepFirst = els.nextParent.getDeepFirst();
				els.nextP = els.nextDeepFirst.getStyleHolder();
			}

			return els.nextP;
		}
	}
);
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
				res = false,
				els = {},
				nodes = {},
				sel = window.getSelection(),
				factory = FBEditor.editor.Factory,
				helper,
				viewportId,
				manager,
				range;

			try
			{
				// получаем данные из выделения
				range = sel.getRangeAt(0);

				viewportId = data.viewportId = range.commonAncestorContainer.viewportId;
				nodes.p = range.commonAncestorContainer;
				els.p = nodes.p.getElement();
				manager = els.p.getManager();
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

				console.log('get next holder ' + me.elementName, range, els);

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
					// просто переносим следующий абзац
					els.parentP.add(els.nextP, viewportId);
				}

				if (els.parentNextP.isEmpty())
				{
					// удаляем пустой следующий блок
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
				nodes.startCursor = els.cursor.getText().length;
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

				console.log('undo get next holder ' + me.elementName, nodes, els);

				viewportId = data.viewportId;
				manager = els.p.getManager();
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
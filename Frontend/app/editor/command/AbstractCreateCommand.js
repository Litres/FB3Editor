/**
 * Абстрактная команда создания элемента редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				res = false,
				els = {},
				nodes = {},
				range;

			try
			{
				if (manager.isSuspendCmd())
				{
					return false;
				}
				
				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();
				range.parentStart = range.start.parentNode;
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();
				
				console.log('create', me.elementName, data);

				nodes.node = data.node || data.prevNode;
				data.viewportId = nodes.node.viewportId;
				els.node = nodes.node.getElement();
				els.node = els.node.getStyleHolder() || nodes.node.getElement();
				manager.setSuspendEvent(true);

				if (!els.node.getParent())
				{
					// если ссылка на элемент была потеряна в результате многократного использования ctrl+z,
					// то пытаемся восстановить ссылку из текущего выделения
					
					nodes.parent = range.parentStart;
					els.parent = nodes.parent.getElement();
					
					while (!els.parent.hisName(els.node.getName()))
					{
						els.parent = els.parent.getParent();
					}
					
					els.node = els.parent;
				}

				// создаем элемент
				me.createElement(els, nodes);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				// устанавливаем курсор
				me.setCursor(els, nodes);

				// сохраняем ссылки
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
				res = false,
				els,
				manager,
				range,
				viewportId;

			try
			{
				range = data.range;
				els = data.els;

				console.log('undo create', me.elementName, range);
				
				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);
				viewportId = data.viewportId;
				els.parent = els.node.getParent();
				els.parent.remove(els.node, viewportId);

				els.parent.sync(viewportId);

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					startOffset: range.offset.start,
					focusElement: range.parentStart.getElement()
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
			manager.updateTree();
			
			return res;
		},

		/**
		 * Создает элемент.
		 * @param {Object} els Элементы.
		 * @param {Object} nodes Узлы.
		 */
		createElement: function (els, nodes)
		{
			//
		},

		/**
		 * Устанавливает курсор.
		 * @param {Object} els Элементы.
		 * @param {Object} nodes Узлы.
		 */
		setCursor: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				helper,
				manager;

			manager = els.p.getManager();
			data.oldRange = manager.getRangeCursor();
			els.cursor = els.p.getDeepFirst();
			helper = els.cursor.getNodeHelper();
			nodes.cursor = helper.getNode();
			els.offset = els.cursor.isText ? els.cursor.getLength() : 0;

			data.saveRange = {
				withoutSyncButtons: true,
				startNode: nodes.cursor,
				startOffset: els.offset
			};

			manager.setCursor(data.saveRange);
		}
	}
);
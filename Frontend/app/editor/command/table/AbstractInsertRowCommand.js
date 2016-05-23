/**
 * Абстрактная команда вставки строки.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.AbstractInsertRowCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				range;

			try
			{
				range = data.range || manager.getRange();
				data.range = {
					common: range.common,
					start: range.start,
					end: range.end,
					parentStart: range.start.parentNode,
					collapsed: range.collapsed,
					offset: range.offset
				};

				manager.suspendEvent = true;

				nodes.node = data.node;

				//console.log('data', data);

				if (!nodes.node.parentNode)
				{
					// если ссылка на элемент была потеряна в результате многократного использования ctrl+z,
					// то пытаемся восстановить ссылку из текущего выделения
					nodes.parent = data.range.parentStart;
					els.parent = nodes.parent.getElement();

					while (els.parent.xmlTag !== nodes.node.getElement().xmlTag)
					{
						nodes.parent = nodes.parent.parentNode;
						els.parent = nodes.parent.getElement();
					}

					nodes.node = nodes.parent;
				}

				data.viewportId = nodes.node.viewportId;
				els.node = nodes.node.getElement();

				// ищем tr
				while (!els.node.isTr)
				{
					nodes.node = nodes.node.parentNode;
					els.node = nodes.node.getElement();
					nodes.parent = nodes.node.parentNode;
					els.parent = nodes.parent.getElement();
				}

				// создаем новый элемент
				els.tr = factory.createElement('tr');

				Ext.Array.each(
					els.node.children,
				    function (child)
				    {
					    var td;

					    td = factory.createElement(child.xmlTag);
					    td.createScaffold();
					    els.tr.add(td);
				    }
				);

				nodes.tr = els.tr.getNode(data.viewportId);

				// вставляем новую строку tr
				me.insertRow(els, nodes);

				//console.log('nodes', nodes);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				me.setCursor(els, nodes);

				// сохраняем ссылку на новый узел
				data.saveNode = nodes.tr;

				// проверяем по схеме
				me.verifyElement(els.parent);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
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
				manager = FBEditor.editor.Manager,
				range,
				viewportId;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				nodes.node = data.saveNode;
				els.node = nodes.node.getElement();
				viewportId = nodes.node.viewportId;
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				els.parent.remove(els.node);
				nodes.parent.removeChild(nodes.node);

				els.parent.sync(viewportId);

				manager.suspendEvent = false;

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

			return res;
		},

		/**
		 * @abstract
		 * Вставляет строку tr.
		 * @param {Object} els Элементы.
		 * @param {Object} nodes Узлы.
		 */
		insertRow: function (els, nodes)
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
				sel = window.getSelection(),
				data = me.getData(),
				manager = FBEditor.editor.Manager;

			data.oldRange = sel.getRangeAt(0);
			els.p = els.tr.first().first();
			nodes.p = els.p.nodes[data.viewportId];
			data.saveRange = {
				startNode: nodes.p.firstChild,
				startOffset: nodes.p.firstChild.length
			};
			manager.setCursor(data.saveRange);
		}
	}
);
/**
 * Абстрактная команда вставки строки.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.AbstractInsertColCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				factory = FBEditor.editor.Factory,
				manager,
				range;

			try
			{
				nodes.node = data.node;
				els.node = nodes.node.getElement();

				manager = els.node.getManager();
				manager.setSuspendEvent(true);

				range = data.range || manager.getRange();

				data.range = {
					common: range.common,
					start: range.start,
					end: range.end,
					parentStart: range.start.parentNode,
					collapsed: range.collapsed,
					offset: range.offset
				};

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

				// ищем td
				while (!els.node.isCell)
				{
					nodes.node = nodes.node.parentNode;
					els.node = nodes.node.getElement();
					nodes.parent = nodes.node.parentNode;
					els.parent = nodes.parent.getElement();
				}

				nodes.table = nodes.parent.parentNode;
				els.table = nodes.table.getElement();
				els.pos = els.parent.getChildPosition(els.node);

				// хранит все ссылки на новые td
				data.saveNode = [];

					Ext.Array.each(
					els.table.children,
					function (elTr)
					{
						Ext.Array.each(
							elTr.children,
							function (child, index)
							{
								var elTd,
									nodeTd;

								if (index === els.pos)
								{
									elTd = factory.createElement(child.xmlTag);
									elTd.createScaffold();
									nodeTd = elTd.getNode(data.viewportId);

									// сохраняем ссылку на новый td
									data.saveNode.push(nodeTd);

									// вставляем новый столбец
									me.insertCol(child, nodeTd, els, nodes);

									return false;
								}
							}
						);
					}
				);

				// синхронизируем элемент
				els.parent.sync(data.viewportId);

				// устанавливаем курсор
				me.setCursor(els, nodes);

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
				els = {},
				nodes = {},
				manager,
				range,
				viewportId;

			try
			{
				range = data.range;
				viewportId = data.viewportId;

				manager = data.saveRange.startNode.getElement().getManager();
				manager.setSuspendEvent(true);

				// удаляем все td
				Ext.Array.each(
					data.saveNode,
				    function (td)
				    {
					    nodes.node = td;
					    els.node = nodes.node.getElement();
					    viewportId = nodes.node.viewportId;
					    nodes.parent = nodes.node.parentNode;
					    els.parent = nodes.parent.getElement();

					    els.parent.remove(els.node);
					    nodes.parent.removeChild(nodes.node);
				    }
				);

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
			return res;
		},

		/**
		 * @abstract
		 * Вставляет столбец td во все строки tr.
		 * @param {FBEditor.editor.element.AbstractElement} elTd Текущий элемент td.
		 * @param {Node} nodeNewTd Новый узел td.
		 * @param {Object} els Элементы.
		 * @param {Object} nodes Узлы.
		 */
		insertCol: function (elTd, nodeNewTd, els, nodes)
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
				manager;

			manager = els.p.getManager();

			data.oldRange = sel.getRangeAt(0);
			nodes.p = els.p.nodes[data.viewportId];
			data.saveRange = {
				startNode: nodes.p.firstChild,
				startOffset: nodes.p.firstChild.length
			};
			manager.setCursor(data.saveRange);
		}
	}
);
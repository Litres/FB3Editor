/**
 * Команда объединения ячеек.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.JoinCells',
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
				viewportId,
				size,
				colSpan,
				rowSpan;

			try
			{
				manager.suspendEvent = true;

				viewportId = data.opts.viewportId;

				// убираем выделение
				manager.clearSelectNodes(viewportId);

				size = data.opts.size;
				nodes.table = data.opts.table;
				els.table = nodes.table.getElement();

				//console.log('data', data);

				// вычисляем количество объединямых ячеек по горизонтали и вертикали
				colSpan = size.rb[0] - size.lt[0] + 1;
				rowSpan = size.rb[1] - size.lt[1] + 1;

				//console.log('span', colSpan, rowSpan);

				// объединяем ячейки, проставляя левой верхней ячейке аттрибуты colspan и rowspan
				// лишние ячейки, попавшие в выделение, скрываем
				// содержмиое скрываемых ячеек переносится в объединенную ячейку

				els.table.each(
					function (tr, row)
					{
						tr.each(
							function (td, col)
							{
								var nodeTd = td.nodes[viewportId],
									links;

								if (col === size.lt[0] && row === size.lt[1])
								{
									// объединенная ячейка
									nodes.joinTd = nodeTd;
									els.joinTd = td;

									// ставим аттрибуты
									td.setColSpan(colSpan);
									td.setRowSpan(rowSpan);

									// ссылка для курсора
									nodes.cursor = nodeTd;
								}
								else if (col >= size.lt[0] && col <= size.rb[0] &&
								         row >= size.lt[1] && row <= size.rb[1])
								{
									// скрываем ячейку
									td.hide();

									// переносим содержимое скрытой ячейки в объединенную

									// ссылки на переносимые элементы
									links = {
										ownerTd: nodeTd,
										children: []
									};

									nodes.first = nodeTd.firstChild;
									els.first = nodes.first ? nodes.first.getElement() : null;

									while (els.first)
									{
										// сохраняем ссылку
										links.children.push(nodes.first);

										els.joinTd.add(els.first);
										nodes.joinTd.appendChild(nodes.first);
										nodes.first = nodeTd.firstChild;
										els.first = nodes.first ? nodes.first.getElement() : null;
									}

									// сохраняем ссылки
									nodes.links = nodes.links || [];
									nodes.links.push(links);

									// добавляем пустой параграф в скрытую ячейку для согласования со схемой
									els.emptyP = manager.createEmptyP();
									td.add(els.emptyP);
								}
							}
						);
					}
				);

				//console.log('nodes', nodes);

				// синхронизируем элемент
				els.table.sync(viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				me.setCursor(els, nodes);

				data.nodes = nodes;
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.table);

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
				manager = FBEditor.editor.Manager,
				viewportId;

			try
			{
				manager.suspendEvent = true;

				viewportId = data.opts.viewportId;
				nodes = data.nodes;
				els = data.els;

				// показываем все скрытые ячейки и возвращаем в них содержимое из объедененной ячейки
				Ext.Array.each(
					nodes.links,
				    function (item)
				    {
					    nodes.ownerTd = item.ownerTd;
					    els.ownerTd = nodes.ownerTd.getElement();
					    els.ownerTd.show();

					    Ext.Array.each(
						    item.children,
					        function (child)
					        {
						        els.child = child.getElement();

						        // удаляем пустой параграф, который был вставлен как заглушка для согласования со схемой
						        els.ownerTd.remove(els.ownerTd.first());

						        els.ownerTd.add(els.child);
						        nodes.ownerTd.appendChild(child);
					        }
					    );
				    }
				);

				// удаляем аттрибуты, разъединяя ячейку
				els.joinTd.setColSpan();
				els.joinTd.setRowSpan();

				els.table.sync(viewportId);

				manager.suspendEvent = false;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
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
				manager = FBEditor.editor.Manager;

			data.saveRange = {
				startNode: manager.getDeepFirst(nodes.cursor)
			};

			manager.setCursor(data.saveRange);
		}
	}
);
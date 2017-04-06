/**
 * Абстрактная команда для ячеек.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.table.AbstractCellCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		/**
		 * Объединяет ячейки.
		 * @param {FBEditor.editor.element.table.TableElement} table Таблица.
		 * @param {Object} size Размерность выделения.
		 * @param {String} viewportId Айди окна.
		 * @return {FBEditor.editor.element.td.TdElement} Объединенная ячейка.
		 */
		joinCells: function (table, size, viewportId)
		{
			var me = this,
				els = {},
				nodes = {},
				manager,
				colSpan,
				rowSpan;

			manager = table.getManager();

			// вычисляем количество объединямых ячеек по горизонтали и вертикали
			colSpan = size.rb[0] - size.lt[0] + 1;
			rowSpan = size.rb[1] - size.lt[1] + 1;

			// объединяем ячейки, проставляя левой верхней ячейке аттрибуты colspan и rowspan
			// лишние ячейки, попавшие в выделение, скрываем
			// содержмиое скрываемых ячеек переносится в объединенную ячейку

			table.each(
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

								// сохраняем размерность для последующей возможности отмены разъединения
								els.joinTd._sizeSelection = size;

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

								// ссылки на переносимые элементы
								links = {
									ownerTd: td,
									children: []
								};

								if (!td.isEmpty())
								{
									// переносим содержимое скрытой ячейки в объединенную

									nodes.first = nodeTd.firstChild;
									els.first = nodes.first ? nodes.first.getElement() : null;

									while (els.first)
									{
										// сохраняем ссылку
										links.children.push(els.first);

										els.joinTd.add(els.first);
										nodes.joinTd.appendChild(nodes.first);
										nodes.first = nodeTd.firstChild;
										els.first = nodes.first ? nodes.first.getElement() : null;
									}

									// добавляем пустой параграф в скрытую ячейку для согласования со схемой
									els.emptyP = manager.createEmptyP();
									td.add(els.emptyP);
								}

								// сохраняем ссылки
								els.joinTd.addLinks(links);
							}
						}
					);
				}
			);

			return els.joinTd;
		},

		/**
		 * Разъединяет ячейку.
		 * @param {FBEditor.editor.element.td.TdElement} td Ячейка.
		 * @param {String} viewportId Айди окна.
		 */
		splitCell: function (td, viewportId)
		{
			var els = {},
				nodes = {};

			// показываем все скрытые ячейки и возвращаем в них содержимое из объедененной ячейки
			Ext.Array.each(
				td.getLinks(),
				function (item)
				{
					els.ownerTd = item.ownerTd;
					nodes.ownerTd = els.ownerTd.nodes[viewportId];
					els.ownerTd.show();

					Ext.Array.each(
						item.children,
						function (child)
						{
							nodes.child = child.nodes[viewportId];

							// удаляем пустой параграф, который был вставлен как заглушка для согласования со схемой
							els.ownerTd.remove(els.ownerTd.first());

							els.ownerTd.add(child);
							nodes.ownerTd.appendChild(nodes.child);
						}
					);
				}
			);

			// удаляем аттрибуты, разъединяя ячейку
			td.setColSpan();
			td.setRowSpan();

			// удаляем ссылки
			td.removeLinks();
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
				manager;

			manager = nodes.cursor.getElement().getManager();
			data.saveRange = {
				startNode: manager.getDeepFirst(nodes.cursor)
			};
			manager.setCursor(data.saveRange);
		}
	}
);
/**
 * Виджет выбора размерности таблицы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.size.Picker',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.table.menu.size.PickerController'
		],
		controller: 'panel.toolstab.main.button.table.menu.size',

		/**
		 * @property {Array} Активная ячейка в виджете.
		 */
		activeCell: [0, 0],

		/**
		 * @property {Array} Минимальное количество ячеек в виджете.
		 */
		minCells: [5, 5],

		/**
		 * @property {Array} Максимальное количество ячеек в виджете.
		 */
		maxCells: [20, 20],

		/**
		 * @property {Array} Строки.
		 */
		rows: [],

		cellCls: 'picker-create-table-cell',

		cellActiveCls: 'picker-create-table-cell-active',

		listeners: {
			mouseOverCell: 'onMouseOverCell',
			clickCell: 'onClickCell'
		},

		afterRender: function ()
		{
			var me = this;

			me.add(me.createGrid());
			me.add(
				{
					xtype: 'component',
					html: (me.activeCell[0] + 1) + ' x ' + (me.activeCell[1] + 1),
					style: 'text-align: center'
				}
			);
			me.callParent(arguments);
		},

		/**
		 * Создает и возвращает сетку ячеек.
		 * @return {Ext.Component[]}
		 */
		createGrid: function ()
		{
			var me = this,
				rows = [],
				rowItems,
				cell;

			for (var i = 0; i < me.maxCells[1]; i++)
			{
				rowItems = [];

				for (var j = 0; j < me.maxCells[0]; j++)
				{
					cell = me.createCell(j, i);
					rowItems.push(cell);
				}

				me.rows.push(rowItems);

				rows.push(
					{
						xtype: 'container',
						layout: 'hbox',
						items: rowItems
					}
				);
			}

			return rows;
		},

		/**
		 * Создает и возвращает ячейку.
		 * @param {Number} col Номер столбца.
		 * @param {Number} row Номер строки.
		 * @return {Ext.Component}
		 */
		createCell: function (col, row)
		{
			var me = this,
				cell,
				hidden,
				minRows,
				minCols,
				active;

			minCols = me.activeCell[0] < me.minCells[0] ?  me.minCells[0] : me.activeCell[0] + 1;
			minRows = me.activeCell[1] < me.minCells[1] ?  me.minCells[1] : me.activeCell[1] + 1;
			hidden = col >= minCols || row >= minRows;
			active = col <= me.activeCell[0] && row <= me.activeCell[1] ? me.cellActiveCls : '';

			cell = {
				xtype: 'component',
				html: '<div></div>',
				cls: me.cellCls + ' ' + active,
				hidden: hidden,

				afterRender: function ()
				{
					me.rows[row][col] = this;

					this.getEl().on(
						{
							mouseover: function ()
							{
								me.fireEvent('mouseOverCell', [col, row]);
							},
							click: function ()
							{
								me.fireEvent('clickCell', [col, row]);
							}
						}
					);
				}
			};

			return cell;
		},

		/**
		 * Устанавливает активные ячейки.
		 * @param {Array} activeCell Размерность таблицы.
		 */
		setActiveCell: function (activeCell)
		{
			var me = this,
				rows = me.rows,
				info = me.items.last(),
				cell,
				hidden,
				minRows,
				minCols,
				active;

			me.activeCell = activeCell;
			minCols = me.activeCell[0] < me.minCells[0] - 1 ?  me.minCells[0] - 1 : me.activeCell[0] + 1;
			minRows = me.activeCell[1] < me.minCells[1] - 1 ?  me.minCells[1] - 1 : me.activeCell[1] + 1;

			for (var i = 0; i < rows.length; i++)
			{
				for (var j = 0; j < rows[i].length; j++)
				{
					cell = rows[i][j];
					hidden = j > minCols || i > minRows;
					cell.setHidden(hidden);
					active = j <= me.activeCell[0] && i <= me.activeCell[1];
					cell.removeCls(me.cellActiveCls);

					if (active)
					{
						cell.addCls(me.cellActiveCls);
					}
				}
			}

			// информация о размерности таблицы
			info.setHtml((me.activeCell[0] + 1) + ' x ' + (me.activeCell[1] + 1));
		}
	}
);
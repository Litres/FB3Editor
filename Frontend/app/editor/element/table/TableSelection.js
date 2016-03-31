/**
 * Выделение для элемента table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.table.TableSelection',
	{
		extend: 'FBEditor.editor.element.AbstractSelection',

		/**
		 * @private
		 * @property {Object} Размерность выделения.
		 * @property {Array} size.lt Позиция левой верхней ячейки.
		 * @property {Array} size.rb Позиция правой нижней ячейки.
		 */
		size: null,

		execute: function ()
		{
			var me = this,
				sel = window.getSelection(),
				range = sel.getRangeAt(0),
				els = {},
				viewportId,
				size;

			if (range && !range.collapsed)
			{
				els.common = range.commonAncestorContainer.getElement();

				if (els.common.isTable || els.common.isTr)
				{
					// создаем выделение необходимых ячеек таблицы

					viewportId = range.startContainer.viewportId;

					// определяем размерность выделения - позицию левой верхней и правой нижней ячеек
					size = me.getSizeFromRange(range);

					if (size && !me.sizeEquals(size, me.size))
					{
						//sel.removeAllRanges();
						me.size = size;
						els.table = els.common.isTable ? els.common : els.common.parent;

						// перебираем все tr
						els.table.each(
							function (tr, index)
							{
								var row = index;

								// перебираем все td
								tr.each(
									function (td, index)
									{
										var col = index;

										// проверяем входит ли ячейка в диапазон выделения
										if (row >= size.lt[1] && row <= size.rb[1] &&
										    col >= size.lt[0] && col <= size.rb[0])
										{
											// выделяем
											td.selectNode(true, viewportId);
										}
										else
										{
											// убираем выделение
											td.selectNode(false, viewportId);
										}
									}
								);
							}
						);
					}
				}
			}
		},

		/**
		 * @private
		 * Возвращает размерность выделения.
		 * @param range {Range} Объект выделения.
		 * @return {Object}
		 */
		getSizeFromRange: function (range)
		{
			var me = this,
				els = {},
				size;

			els.start = range.startContainer.getElement();
			els.end = range.endContainer.getElement();

			// начальная и конечная ячейки выделения
			els.startTd = els.start.getParentName('td');
			els.endTd = els.end.getParentName('td');

			// получаем позиции ячеек
			size = {
				lt: els.startTd.getPosition(),
				rb: els.endTd.getPosition()
			};

			return size;
		},

		/**
		 * @private
		 * Сравнивает размерности выделения.
		 * @param {Object} s1
		 * @param {Object} s2
		 * @return {Boolean}
		 */
		sizeEquals: function (s1, s2)
		{
			var res;

			res = s1 && s2 && s1.lt[0] === s2.lt[0] && s1.lt[1] === s2.lt[1] && s1.rb[0] === s2.rb[0] && s1.rb[1] === s2.rb[1];

			return res;
		}
	}
);
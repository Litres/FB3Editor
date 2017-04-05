/**
 * Выделение для элемента table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.table.TableSelection',
	{
		extend: 'FBEditor.editor.selection.Selection',

		/**
		 * @private
		 * @property {Object} Размерность выделения.
		 * @property {Array} size.lt Позиция левой верхней ячейки.
		 * @property {Array} size.rb Позиция правой нижней ячейки.
		 */
		size: null,

		constructor: function (node)
		{
			var me = this;

			// регистрируем событие нажатия кнопки мыши
			node.addEventListener(
				'mousedown',
				function (e)
				{
					// инициализиурет выделение
					me.startSelection.apply(me, [e]);
				}
			);

			// регистрируем событие перемещения курсора мыши
			node.addEventListener(
				'mousemove',
				function (e)
				{
					me.moveSelection.apply(me, [e]);
				}
			);

			me.callParent(arguments);
		},

		startSelection: function (e)
		{
			var me = this,
				node = me.node,
				helper,
				el;

			me.size = null;
			el = node.getElement();
			helper = el.getNodeHelper();
			
			// убираем выделение
			helper.clearSelectNodes();
		},

		moveSelection: function (e)
		{
			var me = this;

			me.execute();
		},

		/**
		 * Возвращает размерность веделения.
		 * @return {Object}
		 */
		getSize: function ()
		{
			return this.size;
		},

		/**
		 * @private
		 * Выделяет ячейки таблицы.
		 */
		execute: function ()
		{
			var me = this,
				sel = window.getSelection(),
				range = sel.getRangeAt(0),
				node = me.node,
				viewportId = node.viewportId,
				els = {},
				size;

			// определяем размерность выделения - позицию левой верхней и правой нижней ячеек
			size = me.getSizeFromRange();

			if (range && !range.collapsed)
			{
				els.common = range.commonAncestorContainer.getElement();

				if (els.common.isTable || els.common.isTr)
				{
					// создаем выделение необходимых ячеек таблицы
					if (size && !me.sizeEquals(size, me.size))
					{
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
										var col = index,
											helper = td.getNodeHelper();

										// проверяем входит ли ячейка в диапазон выделения
										if (row >= size.lt[1] && row <= size.rb[1] &&
										    col >= size.lt[0] && col <= size.rb[0])
										{
											// выделяем
											helper.selectNode(true, viewportId);
										}
										else
										{
											// убираем выделение
											helper.selectNode(false, viewportId);
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
		 * @return {Object}
		 */
		getSizeFromRange: function ()
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range,
				size;

			range = sel.getRangeAt(0);

			if (range && !range.collapsed)
			{
				els.common = range.commonAncestorContainer.getElement();

				if (els.common.isTable || els.common.isTr)
				{
					if (Ext.browser.is.Firefox)
					{
						// для Firefox выделение в таблице работает на уровне строк tr, если выделяется несколько ячеек

						range = {
							startTr: sel.getRangeAt(0),
							endTr: sel.getRangeAt(sel.rangeCount - 1)
						};

						// первая строка в выделении
						els.startTr = range.startTr.startContainer.getElement();

						// последняя строка
						els.endTr = range.endTr.startContainer.getElement();

						size = {
							lt: [
								range.startTr.startOffset,
								els.startTr.getPosition()
							],
							rb: [
								range.endTr.startOffset,
								els.endTr.getPosition()
							]
						};
					}
					else
					{
						// для остальных бразуеров выделение работает нормально - на уровне самого вложенного элемента в ячейке

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
					}
				}
			}

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
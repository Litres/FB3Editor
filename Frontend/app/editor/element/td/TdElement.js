/**
 * Элемент td.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.td.TdElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.td.TdElementController'
		],

		controllerClass: 'FBEditor.editor.element.td.TdElementController',
		htmlTag: 'td',
		xmlTag: 'td',
		cls: 'el-td',
		showedOnTree: false,

		isTd: true,
		isCell: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.br = FBEditor.editor.Factory.createElement('br');
			els.p.add(els.br);
			me.add(els.p);

			return els;
		},

		getXml: function ()
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			// заменяем первый br на пустой параграф согласно схеме
			xml = xml.replace(/<td( .*?)?><br\/?>/gi, '<td$1><p></p>');

			return xml;
		},

		/**
		 * Возвращает позицию ячейки в таблице.
		 * Позиция ячейки отсчитывается от 0.
		 *
		 * @example
		 * Есть таблица размером 5 на 6 ячеек.
		 * Тогда левая верхняя ячейка будет иметь позицию [0, 0], а правая нижняя - [4, 5].
		 *
		 * @return {Array}
		 */
		getPosition: function ()
		{
			var me = this,
				parent = me.parent,
				posCol,
				posRow;

			// позиция td
			posCol = parent.getChildPosition(me);

			// позииция tr
			posRow = parent.parent.getChildPosition(parent);

			return [posCol, posRow];
		},

		/**
		 * Устанавливает аттрибут colspan.
		 * @param {Number} [count] Количество объединяемых ячеек по горизонтали.
		 */
		setColSpan: function (count)
		{
			var me = this,
				attr = me.attributes,
				nodes = me.nodes;

			if (count && count > 1)
			{
				attr.colspan = count;

				Ext.Object.each(
					nodes,
					function (key, node)
					{
						node.setAttribute('colspan', count);
					}
				);
			}
			else if (attr.colspan)
			{
				delete attr.colspan;

				Ext.Object.each(
					nodes,
					function (key, node)
					{
						node.removeAttribute('colspan');
					}
				);
			}

			me.attributes = attr;
		},

		/**
		 * Устанавливает аттрибут colspan.
		 * @param {Number} [count] Количество объединяемых ячеек по горизонтали.
		 */
		setRowSpan: function (count)
		{
			var me = this,
				attr = me.attributes,
				nodes = me.nodes;

			if (count && count > 1)
			{
				attr.rowspan = count;

				Ext.Object.each(
					nodes,
					function (key, node)
					{
						node.setAttribute('rowspan', count);
					}
				);
			}
			else if (attr.rowspan)
			{
				delete attr.rowspan;

				Ext.Object.each(
					nodes,
					function (key, node)
					{
						node.removeAttribute('rowspan');
					}
				);
			}

			me.attributes = attr;
		}
	}
);
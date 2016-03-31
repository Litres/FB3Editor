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
			//'FBEditor.editor.command.td.CreateCommand',
			//'FBEditor.editor.command.td.CreateRangeCommand',
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
			xml = xml.replace(/<td><br\/>/gi, '<td><p></p>');

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
		}
	}
);
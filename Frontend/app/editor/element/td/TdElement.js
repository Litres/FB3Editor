/**
 * Элемент td.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.td.TdElement',
	{
		extend: 'FBEditor.editor.element.AbstractCellElement',
		requires: [
			'FBEditor.editor.element.td.TdElementController'
		],

		controllerClass: 'FBEditor.editor.element.td.TdElementController',
		htmlTag: 'td',
		xmlTag: 'td',
		cls: 'el-td',
		isTd: true
	}
);
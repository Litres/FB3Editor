/**
 * Элемент th.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.th.ThElement',
	{
		extend: 'FBEditor.editor.element.AbstractCellElement',

		htmlTag: 'th',
		xmlTag: 'th',
		cls: 'el-th',
		isTh: true
	}
);
/**
 * Элемент sup.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.sup.SupElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.sup.SupElementController',
			'FBEditor.editor.command.sup.CreateRangeCommand',
			'FBEditor.editor.command.sup.DeleteWrapperCommand'
		],
		htmlTag: 'sup',
		xmlTag: 'sup',
		cls: 'el-sup'
	}
);
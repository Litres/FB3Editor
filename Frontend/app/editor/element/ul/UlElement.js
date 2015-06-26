/**
 * Элемент ul.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.ul.UlElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.ul.CreateCommand',
			'FBEditor.editor.element.ul.UlElementController'
		],
		controllerClass: 'FBEditor.editor.element.ul.UlElementController',
		htmlTag: 'ul',
		xmlTag: 'ul',
		cls: 'el-ul'
	}
);
/**
 * Элемент pre.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.pre.PreElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.pre.PreElementController',
			'FBEditor.editor.command.pre.CreateRangeCommand'
		],
		controllerClass: 'FBEditor.editor.element.pre.PreElementController',
		htmlTag: 'pre',
		xmlTag: 'pre',
		cls: 'el-pre'
	}
);
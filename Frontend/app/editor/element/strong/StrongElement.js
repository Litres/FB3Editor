/**
 * Элемент strong.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.strong.StrongElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.strong.StrongElementController',
			'FBEditor.editor.command.strong.CreateRangeCommand'
		],
		controllerClass: 'FBEditor.editor.element.strong.StrongElementController',
		htmlTag: 'strong',
		xmlTag: 'strong',
		cls: 'el-strong'
	}
);
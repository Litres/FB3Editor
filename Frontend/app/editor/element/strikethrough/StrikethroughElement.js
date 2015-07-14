/**
 * Элемент strikethrough.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.strikethrough.StrikethroughElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.strikethrough.StrikethroughElementController',
			'FBEditor.editor.command.strikethrough.CreateRangeCommand',
			'FBEditor.editor.command.strikethrough.DeleteWrapperCommand'
		],
		controllerClass: 'FBEditor.editor.element.strikethrough.StrikethroughElementController',
		htmlTag: 'strikethrough',
		xmlTag: 'strikethrough',
		cls: 'el-strikethrough'
	}
);
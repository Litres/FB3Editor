/**
 * Элемент underline.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.underline.UnderlineElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.underline.UnderlineElementController',
			'FBEditor.editor.command.underline.CreateRangeCommand'
		],
		controllerClass: 'FBEditor.editor.element.underline.UnderlineElementController',
		htmlTag: 'underline',
		xmlTag: 'underline',
		cls: 'el-underline'
	}
);
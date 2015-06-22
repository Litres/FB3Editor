/**
 * Элемент code.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.code.CodeElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.code.CodeElementController'
		],
		controllerClass: 'FBEditor.editor.element.code.CodeElementController',
		htmlTag: 'code',
		xmlTag: 'code',
		cls: 'el-code'
	}
);
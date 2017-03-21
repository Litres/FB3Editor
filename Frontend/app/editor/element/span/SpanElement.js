/**
 * Элемент span.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.span.SpanElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.span.SpanElementController',
			'FBEditor.editor.command.span.CreateRangeCommand',
			'FBEditor.editor.command.span.DeleteWrapperCommand'
		],

		controllerClass: 'FBEditor.editor.element.span.SpanElementController',
		htmlTag: 'span',
		xmlTag: 'span',
		cls: 'el-span'
	}
);
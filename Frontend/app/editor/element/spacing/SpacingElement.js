/**
 * Элемент spacing.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.spacing.SpacingElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.spacing.SpacingElementController',
			'FBEditor.editor.command.spacing.CreateRangeCommand'
		],
		controllerClass: 'FBEditor.editor.element.spacing.SpacingElementController',
		htmlTag: 'spacing',
		xmlTag: 'spacing',
		cls: 'el-spacing'
	}
);
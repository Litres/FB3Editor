/**
 * Элемент em.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.em.EmElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.em.EmElementController',
			'FBEditor.editor.command.em.CreateRangeCommand',
			'FBEditor.editor.command.em.DeleteWrapperCommand'
		],
		controllerClass: 'FBEditor.editor.element.em.EmElementController',
		htmlTag: 'em',
		xmlTag: 'em',
		cls: 'el-em'
	}
);
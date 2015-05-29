/**
 * Элемент div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.div.DivElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.div.CreateCommand',
			'FBEditor.editor.element.div.DivElementController'
		],
		controllerClass: 'FBEditor.editor.element.div.DivElementController',
		htmlTag: 'div',
		xmlTag: 'div',
		cls: 'el-div',
		permit: {
			splittable: true
		}
	}
);
/**
 * Элемент sub.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.sub.SubElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.sub.SubElementController',
			'FBEditor.editor.command.sub.CreateRangeCommand'
		],
		htmlTag: 'sub',
		xmlTag: 'sub',
		cls: 'el-sub'
	}
);
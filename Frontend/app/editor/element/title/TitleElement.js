/**
 * Элемент title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.title.TitleElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.title.TitleElementController'
		],
		controllerClass: 'FBEditor.editor.element.title.TitleElementController',
		htmlTag: 'header',
		xmlTag: 'title',
		cls: 'el-title'
	}
);
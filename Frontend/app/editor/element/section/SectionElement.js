/**
 * Элемент section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.section.SectionElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.section.SectionElementController'
		],
		controllerClass: 'FBEditor.editor.element.section.SectionElementController',
		htmlTag: 'section',
		xmlTag: 'section',
		cls: 'el-section',
		isBlock: true
	}
);
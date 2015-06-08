/**
 * Кнотроллер элемента section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.section.SectionElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.section.CreateCommand',
			'FBEditor.editor.command.section.SplitCommand'
		]
	}
);
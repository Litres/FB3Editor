/**
 * Кнопка вставки notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.notes.Notes',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.notes.NotesController'
		],
		
		xtype: 'main-editor-button-notes',
		controller: 'main.editor.button.notes',
		
		html: '<i class="fa fa-clone"></i>',
		tooltip: 'Сноски',
		elementName: 'notes'
	}
);
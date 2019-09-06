/**
 * Кнопка создания элемента note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.note.Note',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.note.NoteController'
		],
		
		xtype: 'main-editor-button-note',
		controller: 'main.editor.button.note',
		
		html: '<i class="far fa-sticky-note"></i>',

		tooltipText: 'Сноска',
		elementName: 'note'
	}
);
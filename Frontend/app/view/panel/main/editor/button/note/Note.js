/**
 * Кнопка создания элемента note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.note.Note',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		id: 'main-editor-button-note',
		xtype: 'main-editor-button-note',
		//controller: 'main.editor.button.note',
		html: '<i class="fa fa-sticky-note-o"></i>',
		tooltip: 'Сноска (Ctrl+Alt+N)',
		elementName: 'note'
	}
);
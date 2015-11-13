/**
 * Кнопка создания элемента note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.note.Note',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractStyleButton',
		id: 'panel-toolstab-main-button-note',
		xtype: 'panel-toolstab-main-button-note',
		//controller: 'panel.toolstab.main.button.note',
		html: '<i class="fa fa-sticky-note-o"></i>',
		tooltip: 'Сноска (Ctrl+Alt+N)',
		elementName: 'note'
	}
);
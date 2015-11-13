/**
 * Кнопка вставки notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.notes.Notes',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.notes.NotesController'
		],
		id: 'panel-toolstab-main-button-notes',
		xtype: 'panel-toolstab-main-button-notes',
		controller: 'panel.toolstab.main.button.notes',
		html: '<i class="fa fa-clone"></i>',
		tooltip: 'Сноски',
		elementName: 'notes'
	}
);
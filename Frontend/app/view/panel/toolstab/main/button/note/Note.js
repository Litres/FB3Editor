/**
 * Кнопка вставки note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.note.Note',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-note',
		xtype: 'panel-toolstab-main-button-note',
		//controller: 'panel.toolstab.main.button.note',
		html: '<i class="fa fa-comment"></i>',
		tooltip: 'Сноска',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('note');
		}
	}
);
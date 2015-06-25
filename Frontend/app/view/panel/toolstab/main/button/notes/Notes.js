/**
 * Кнопка вставки notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.notes.Notes',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-notes',
		xtype: 'panel-toolstab-main-button-notes',
		//controller: 'panel.toolstab.main.button.notes',
		html: '<i class="fa fa-comments-o"></i>',
		tooltip: 'Сноски',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('notes');
		}
	}
);
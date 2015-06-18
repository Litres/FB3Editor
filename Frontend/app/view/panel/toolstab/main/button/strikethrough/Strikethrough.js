/**
 * Кнопка создания элемента strikethrough.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.strikethrough.Strikethrough',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-strikethrough',
		xtype: 'panel-toolstab-main-button-strikethrough',
		//controller: 'panel.toolstab.main.button.strikethrough',
		html: '<i class="fa fa-strikethrough"></i>',
		tooltip: 'Зачёркнутый',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('strikethrough');
		}
	}
);
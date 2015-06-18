/**
 * Кнопка создания элемента underline.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.underline.Underline',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-underline',
		xtype: 'panel-toolstab-main-button-underline',
		//controller: 'panel.toolstab.main.button.underline',
		html: '<i class="fa fa-underline"></i>',
		tooltip: 'Подчёркнутый',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('underline');
		}
	}
);
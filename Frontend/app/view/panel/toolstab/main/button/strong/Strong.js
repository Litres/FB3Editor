/**
 * Кнопка создания элемента strong.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.strong.Strong',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-strong',
		xtype: 'panel-toolstab-main-button-strong',
		//controller: 'panel.toolstab.main.button.strong',
		html: '<i class="fa fa-bold"></i>',
		tooltip: 'Полужирный',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('strong');
		}
	}
);
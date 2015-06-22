/**
 * Кнопка создания элемента pre.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.pre.Pre',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-pre',
		xtype: 'panel-toolstab-main-button-pre',
		//controller: 'panel.toolstab.main.button.pre',
		html: '<i class="fa fa-terminal"></i>',
		tooltip: 'Предварительно отформатированный',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('pre');
		}
	}
);
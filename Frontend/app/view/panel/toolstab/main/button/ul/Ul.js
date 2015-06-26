/**
 * Кнопка вставки ul.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.ul.Ul',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-ul',
		xtype: 'panel-toolstab-main-button-ul',
		//controller: 'panel.toolstab.main.button.ul',
		html: '<i class="fa fa-list-ul"></i>',
		tooltip: 'Маркированный список',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('ul');
		}
	}
);
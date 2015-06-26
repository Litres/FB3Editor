/**
 * Кнопка вставки ol.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.ol.Ol',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-ol',
		xtype: 'panel-toolstab-main-button-ol',
		//controller: 'panel.toolstab.main.button.ol',
		html: '<i class="fa fa-list-ol"></i>',
		tooltip: 'Нумерованный список',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('ol');
		}
	}
);
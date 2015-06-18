/**
 * Кнопка вставки заголовка.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.title.Title',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-title',
		xtype: 'panel-toolstab-main-button-title',
		//controller: 'panel.toolstab.main.button.title',
		html: '<i class="fa fa-header"></i>',
		tooltip: 'Заголовок',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('title');
		}
	}
);
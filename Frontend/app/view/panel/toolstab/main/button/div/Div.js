/**
 * Кнопка вставки блока div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.div.Div',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-div',
		xtype: 'panel-toolstab-main-button-div',
		//controller: 'panel.toolstab.main.button.div',
		text: 'Блок',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('div');
		}
	}
);
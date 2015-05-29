/**
 * Кнопка вставки аннотации annotation.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.annotation.Annotation',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-annotation',
		xtype: 'panel-toolstab-main-button-annotation',
		//controller: 'panel.toolstab.main.button.annotation',
		text: 'Аннотация',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('annotation');
		}
	}
);
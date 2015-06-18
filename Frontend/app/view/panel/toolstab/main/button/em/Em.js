/**
 * Кнопка создания элемента em.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.em.Em',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-em',
		xtype: 'panel-toolstab-main-button-em',
		//controller: 'panel.toolstab.main.button.em',
		html: '<i class="fa fa-italic"></i>',
		tooltip: 'Курсив',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('em');
		}
	}
);
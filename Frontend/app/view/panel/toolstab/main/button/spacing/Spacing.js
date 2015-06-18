/**
 * Кнопка создания элемента spacing.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.spacing.Spacing',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-spacing',
		xtype: 'panel-toolstab-main-button-spacing',
		//controller: 'panel.toolstab.main.button.spacing',
		html: '<i class="fa fa-text-width"></i>',
		tooltip: 'Межбуквенный интервал',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('spacing');
		}
	}
);
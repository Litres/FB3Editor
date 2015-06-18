/**
 * Кнопка вставки эпиграфа.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.epigraph.Epigraph',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-epigraph',
		xtype: 'panel-toolstab-main-button-epigraph',
		//controller: 'panel.toolstab.main.button.epigraph',
		html: '<i class="fa fa-pinterest-p"></i>',
		tooltip: 'Эпиграф',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('epigraph');
		}
	}
);
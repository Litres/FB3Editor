/**
 * Кнопка создания элемента sup.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.sup.Sup',
	{
		extend: 'Ext.button.Button',
		id: 'panel-toolstab-main-button-sup',
		xtype: 'panel-toolstab-main-button-sup',
		//controller: 'panel.toolstab.main.button.sup',
		html: '<i class="fa fa-superscript"></i>',
		tooltip: 'Верхний индекс',
		handler: function ()
		{
			FBEditor.editor.Manager.createElement('sup');
		}
	}
);
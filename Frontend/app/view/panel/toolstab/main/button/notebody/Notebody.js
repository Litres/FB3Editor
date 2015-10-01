/**
 * Кнопка вставки notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.notebody.Notebody',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.notebody.NotebodyController'
		],
		id: 'panel-toolstab-main-button-notebody',
		xtype: 'panel-toolstab-main-button-notebody',
		controller: 'panel.toolstab.main.button.notebody',
		html: '<i class="fa fa-comment"></i>',
		tooltip: 'Текст сноски',
		elementName: 'notebody'
	}
);
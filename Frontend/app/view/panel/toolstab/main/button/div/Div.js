/**
 * Кнопка вставки блока div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.div.Div',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.div.DivController'
		],
		id: 'panel-toolstab-main-button-div',
		xtype: 'panel-toolstab-main-button-div',
		controller: 'panel.toolstab.main.button.div',
		html: '<i class="fa fa-cubes"></i>',
		tooltip: 'Блок',
		elementName: 'div'
	}
);
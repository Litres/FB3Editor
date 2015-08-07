/**
 * Кнопка вставки section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.section.Section',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.section.SectionController'
		],
		id: 'panel-toolstab-main-button-section',
		xtype: 'panel-toolstab-main-button-section',
		controller: 'panel.toolstab.main.button.section',
		html: '<i class="fa fa-cube"></i>',
		tooltip: 'Вложенная секция',
		elementName: 'section',

		createOpts: {
			inner: true
		}
	}
);
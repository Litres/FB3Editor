/**
 * Кнопка создания элемента subtitle.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.subtitle.Subtitle',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.subtitle.SubtitleController'
		],
		id: 'panel-toolstab-main-button-subtitle',
		xtype: 'panel-toolstab-main-button-subtitle',
		controller: 'panel.toolstab.main.button.subtitle',
		html: '<i class="fa fa-h-square fa-lg"></i>',
		tooltip: 'Подзаголовок',
		elementName: 'subtitle'
	}
);
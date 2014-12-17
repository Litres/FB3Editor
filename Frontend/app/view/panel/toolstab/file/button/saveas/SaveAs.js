/**
 * Кнопка сохранения книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.saveas.SaveAs',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.saveas.SaveAsController'
		],
		id:'panel-toolstab-file-button-saveas',
		xtype: 'panel-toolstab-file-button-saveas',
		controller: 'panel.toolstab.file.button.saveas',
		text: 'Сохранить как...',
		listeners: {
			click: 'onClick'
		}
	}
);
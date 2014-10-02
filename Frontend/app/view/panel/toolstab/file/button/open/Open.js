/**
 * Кнопка открытия файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.open.Open',
	{
		extend: 'Ext.form.field.FileButton',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.open.OpenController'
		],
		id:'panel-toolstab-file-button-open',
		xtype: 'panel-toolstab-file-button-open',
		controller: 'panel.toolstab.file.button.open',
		text: 'Открыть',
		listeners: {
			change: 'onChange'
		}
	}
);
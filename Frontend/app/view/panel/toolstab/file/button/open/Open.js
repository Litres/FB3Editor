/**
 * Кнопка открытия файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.open.Open',
	{
		extend: 'FBEditor.view.button.AbstractFileButton',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.open.OpenController'
		],
		
		id: 'panel-toolstab-file-button-open',
		xtype: 'panel-toolstab-file-button-open',
		controller: 'panel.toolstab.file.button.open',
		
		listeners: {
			change: 'onChange'
		},

		accept: '', //'application/zip'
		
		text: 'Открыть книгу (локально)'
	}
);
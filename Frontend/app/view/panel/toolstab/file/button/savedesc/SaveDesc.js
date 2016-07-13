/**
 * Кнопка сохранения описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.savedesc.SaveDesc',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.savedesc.SaveDescController'
		],
		
		id:'panel-toolstab-file-button-savedesc',
		xtype: 'panel-toolstab-file-button-savedesc',
		controller: 'panel.toolstab.file.button.savedesc',
		
		text: 'Сохранить описание',
		hidden: true,

		listeners: {
			click: 'onClick',
			accessHub: 'onAccessHub'
		}
	}
);
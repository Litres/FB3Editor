/**
 * Кнопка сохранения тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.file.button.savebody.SaveBody',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.toolstab.file.button.savebody.SaveBodyController'
		],

		id:'panel-toolstab-file-button-savebody',
		xtype: 'panel-toolstab-file-button-savebody',
		controller: 'panel.toolstab.file.button.savebody',

		text: 'Сохранить тело',
		hidden: true,

		listeners: {
			click: 'onClick',
			accessHub: 'onAccessHub'
		}
	}
);
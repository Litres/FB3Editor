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

		listeners: {
			click: 'onClick',
			accessHub: 'onAccessHub'
		},

		disabled: true,
		tooltipType: 'title',

		translateText: {
			save: 'Сохранить тело (хаб)',
			onlySave: 'Сохранить'
		},

		initComponent: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				routeManager = bridge.FBEditor.route.Manager,
				text;
			
			text = routeManager.isSetParam('only_text') ? me.translateText.onlySave : me.translateText.save;
			me.text = text;
			me.tooltip = text;

			me.callParent(arguments);
		},

		/**
		 * Активирует или деактивирует кнопку.
		 * @param {Boolean} active Активировать ли.
		 */
		setActive: function (active)
		{
			var me = this;

			me.setDisabled(!active);
		}
	}
);
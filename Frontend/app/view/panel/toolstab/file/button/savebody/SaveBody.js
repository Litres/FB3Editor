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
		iconCls: 'fa fa-cloud-download',
		tooltipType: 'title',

		translateText: {
			save: 'Сохранить тело (хаб)'
		},

		initComponent: function ()
		{
			var me = this;

			me.text = me.translateText.save;
			me.tooltip = me.translateText.save;

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
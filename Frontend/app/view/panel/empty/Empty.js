/**
 * Пустая панель для центральной части.
 * Используется в качестве заглушки, чтобы не показывать другие, если это требуется.
 * Может содержать информационные сообщения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.empty.Empty',
	{
		extend: 'Ext.panel.Panel',
		id: 'panel-empty',
		xtype: 'panel-empty',
		//controller: 'panel.empty',
		layout: 'fit',

		translateText: {
			loading: 'Загрузка...'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					html: me.translateText.loading
				}
			];

			me.callParent(arguments);
		}
	}
);
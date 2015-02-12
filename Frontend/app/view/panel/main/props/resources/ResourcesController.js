/**
 * Контроллер панели свойств ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.resources.ResourcesController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.props.resources',

		/**
		 * Отображает свойства выбранного ресурса.
		 * @param {Ext.data.Model} record Данные выбранного ресурса.
		 */
		onLoadData: function (record)
		{
			var me = this,
				view = me.getView(),
				data = record ? record.getData() : null,
				deleteBtn = Ext.getCmp('button-delete-resource'),
				infoView = Ext.getCmp('props-resources-info');

			if (data)
			{
				infoView.update(data);
				infoView.setVisible(true);
				deleteBtn.setVisible(true);
				deleteBtn.setResource(data.name);
			}
			else
			{
				Ext.defer(
					function ()
					{
						infoView.setVisible(false);
						deleteBtn.setVisible(false);
						deleteBtn.setResource(null);
					},
					500
				);
			}
		}
	}
);
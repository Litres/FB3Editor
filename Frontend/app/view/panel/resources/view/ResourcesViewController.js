/**
 * Контроллер панели отображения ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.view.ResourcesViewController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.view.resources',

		/**
		 * Показывает свойства выбранного ресурса.
		 * @param {Ext.selection.Model} model
		 * @param {Ext.data.Model} oldFocused Данные ресурса, с которого перемистился фокус.
		 * @param {Ext.data.Model} newFocused Данные выбранного ресурса.
		 */
		onFocusChange: function (model, oldFocused, newFocused)
		{
			var me = this,
				bridgeProps = FBEditor.getBridgeProps();

			bridgeProps.Ext.getCmp('panel-props-resources').fireEvent('loadData', newFocused);
		},

		/**
		 * Открывает папку с ресурсами.
		 * @param {FBEditor.view.panel.resources.view.ResourcesView} view Панель отображения.
		 * @param {Ext.data.Model} record Данные папки.
		 */
		onItemDblClick: function (view, record)
		{
			var me = this,
				data = record.getData(),
				resources;

			if (data.isFolder)
			{
				FBEditor.resource.Manager.setActiveFolder(data.name);
				resources = FBEditor.resource.Manager.getFolderData(data.name);

				// заполняем панель отображения ресурсов файлами из выбранной директории
				view.setStoreData(resources);
			}
		}
	}
);
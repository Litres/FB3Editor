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
		}
	}
);
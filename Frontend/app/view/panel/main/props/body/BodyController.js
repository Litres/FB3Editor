/**
 * Контроллер панели свойств редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.BodyController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.props.body',

		/**
		 * Показывает информацию об элементе редактора текста.
		 * @param {Object} data Данные элемента.
		 */
		onLoadData: function (data)
		{
			var me = this,
				bridgeProps = FBEditor.getBridgeProps();

			if (data)
			{
				bridgeProps.Ext.getCmp('props-element-info').update(data);
			}
		}
	}
);
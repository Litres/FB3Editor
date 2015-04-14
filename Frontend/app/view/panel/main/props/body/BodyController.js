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

		onAfterRender: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				focusEl,
				data;

			// если есть активный элемент в тексте, то показываем его данные
			focusEl = bridge.FBEditor.editor.Manager.getFocusElement();
			if (focusEl)
			{
				data = focusEl.getData();
				me.onLoadData(data);
			}
		},

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